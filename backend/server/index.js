import createChatRouter from "./routes/chat.js";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import {
  User,
  FoodItem,
  ImpactAction,
  SurplusListing,
  FoodRequest,
  Notification,
  Conversation,
} from "./models.js";

/* =========================================================
   ENVIRONMENT
========================================================= */

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 5000);
const JWT_SECRET = process.env.JWT_SECRET || "nouriva-development-secret";
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/nouriva";

const allowedOrigin = process.env.FRONTEND_URL || true;
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));
app.use(express.json({ limit: "20mb" }));

/* =========================================================
   HELPERS
========================================================= */

const asyncHandler = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (error) {
    next(error);
  }
};

const isValidId = (id) => mongoose.isValidObjectId(id);

function signToken(user) {
  return jwt.sign(
    {
      id: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role || "user",
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function safeUser(user) {
  if (!user) return null;

  return {
    id: String(user._id),
    uid: String(user._id),
    displayName: user.name,
    email: user.email,
    photoURL: user.photo_url || "",
    points: Number(user.points || 0),
    role: user.role || "user",
  };
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";

  if (!header.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required.",
    });
  }

  try {
    req.auth = jwt.verify(header.substring(7), JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired session.",
    });
  }
}

function adminMiddleware(req, res, next) {
  if (req.auth?.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required.",
    });
  }
  next();
}

function toId(value) {
  return value?._id ? String(value._id) : String(value);
}

function formatDateOnly(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toISOString().slice(0, 10);
}

function formatFood(row) {
  return {
    _id: String(row._id),
    id: String(row._id),
    userId: String(row.user_id),
    title: row.title,
    description: row.description || "",
    foodCategory: row.food_category,
    quantity: row.quantity,
    foodImageUrl: row.food_image_url || "",
    expiryDate: formatDateOnly(row.expiry_date),
    notes: row.notes || "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function addPoints(userId, actionType, points, quantity = 1) {
  await ImpactAction.create({
    user_id: userId,
    action_type: actionType,
    quantity,
    points,
  });

  await User.findByIdAndUpdate(userId, {
    $inc: { points },
  });
}

/* =========================================================
   HEALTH
========================================================= */

app.get("/api/health", (req, res) => {
  res.json({ message: "Nouriva API is running." });
});

/* =========================================================
   AUTH - REGISTER
========================================================= */

app.post(
  "/api/auth/register",
  asyncHandler(async (req, res) => {
    const { name, email, password, photoURL = "" } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    if (
      password.length < 6 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password)
    ) {
      return res.status(400).json({
        message:
          "Password must be 6+ characters with uppercase and lowercase letters.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail }).lean();

    if (existing) {
      return res.status(409).json({
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: passwordHash,
      photo_url: String(photoURL).trim(),
    });

    res.status(201).json({
      message: "Account created successfully.",
      user: safeUser(user),
    });
  })
);

/* =========================================================
   AUTH - LOGIN
========================================================= */

app.post(
  "/api/auth/login",
  asyncHandler(async (req, res) => {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    res.json({
      message: "Login successful.",
      token: signToken(user),
      user: safeUser(user),
    });
  })
);

/* =========================================================
   AUTH - ME
========================================================= */

app.get(
  "/api/auth/me",
  authMiddleware,
  asyncHandler(async (req, res) => {
    if (!isValidId(req.auth.id)) {
      return res.status(401).json({ message: "User not found." });
    }

    const user = await User.findById(req.auth.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found.",
      });
    }

    res.json({ user: safeUser(user) });
  })
);

/* =========================================================
   CHANGE PASSWORD
========================================================= */

app.put(
  "/api/auth/change-password",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current and new passwords are required.",
      });
    }

    if (
      newPassword.length < 6 ||
      !/[A-Z]/.test(newPassword) ||
      !/[a-z]/.test(newPassword)
    ) {
      return res.status(400).json({
        message:
          "New password must be 6+ characters with uppercase and lowercase letters.",
      });
    }

    const user = await User.findById(req.auth.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const valid = await bcrypt.compare(currentPassword, user.password);

    if (!valid) {
      return res.status(401).json({
        message: "Current password is incorrect.",
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json({ message: "Password changed successfully." });
  })
);

/* =========================================================
   PROFILE
========================================================= */

app.put(
  "/api/auth/profile",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const update = {};

    if (req.body.displayName) {
      update.name = req.body.displayName;
    }

    if (req.body.photoURL !== undefined) {
      update.photo_url = req.body.photoURL;
    }

    const user = await User.findByIdAndUpdate(
      req.auth.id,
      { $set: update },
      { new: true }
    );

    res.json({ user: safeUser(user) });
  })
);

/* =========================================================
   FOOD INVENTORY
========================================================= */

app.get(
  "/api/allFoodsItems",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const search = String(req.query.search || "").trim();
    const category = String(req.query.category || "").trim();

    const query = {};

    if (search) {
      const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      query.$or = [
        { title: regex },
        { description: regex },
        { food_category: regex },
      ];
    }

    if (category) {
      query.food_category = category;
    }

    const rows = await FoodItem.find(query).sort({ created_at: -1 }).lean();
    res.json(rows.map(formatFood));
  })
);

app.get(
  "/api/expired-food-items",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rows = await FoodItem.find({
      user_id: req.auth.id,
      expiry_date: { $lt: today },
    }).sort({ expiry_date: -1 }).lean();

    res.json(rows.map(formatFood));
  })
);

app.get(
  "/api/nearly-expired-foods",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 3);

    const rows = await FoodItem.find({
      user_id: req.auth.id,
      expiry_date: { $gte: start, $lte: end },
    }).sort({ expiry_date: 1 }).lean();

    res.json(rows.map(formatFood));
  })
);

app.post(
  "/api/added-food",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const {
      foodImageUrl,
      title,
      foodCategory,
      quantity,
      expiryDate,
      description,
      notes,
    } = req.body;

    if (!title || !foodCategory || !quantity || !expiryDate) {
      return res.status(400).json({
        message: "Please complete all required food fields.",
      });
    }

    if (foodImageUrl) {
      if (typeof foodImageUrl !== "string" || !/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(foodImageUrl)) {
        return res.status(400).json({ message: "Please upload a valid JPG, PNG or WEBP image." });
      }
      const base64Length = foodImageUrl.split(",")[1]?.length || 0;
      if (base64Length > 2.8 * 1024 * 1024) {
        return res.status(400).json({ message: "Food image is too large. Maximum size is 2 MB." });
      }
    }

    const food = await FoodItem.create({
      user_id: req.auth.id,
      title: String(title).trim(),
      description: description || "",
      food_category: foodCategory,
      quantity: String(quantity),
      food_image_url: foodImageUrl || "",
      expiry_date: new Date(expiryDate),
      notes: notes || "",
    });

    await addPoints(
      req.auth.id,
      "add_food",
      5,
      Number(quantity) || 1
    );

    res.status(201).json({
      insertedId: String(food._id),
      message: "Food added successfully.",
    });
  })
);

app.get(
  "/api/my-food-items",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const rows = await FoodItem.find({
      user_id: req.auth.id,
    }).sort({ created_at: -1 }).lean();

    res.json(rows.map(formatFood));
  })
);

app.get(
  "/api/added-food/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: "Food item not found." });
    }

    const row = await FoodItem.findOne({
      _id: req.params.id,
      user_id: req.auth.id,
    }).lean();

    if (!row) {
      return res.status(404).json({
        message: "Food item not found.",
      });
    }

    res.json(formatFood(row));
  })
);

app.put(
  "/api/update-item/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: "Food item not found." });
    }

    const {
      foodImageUrl,
      title,
      foodCategory,
      quantity,
      expiryDate,
      description,
      notes,
    } = req.body;

    const update = {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(foodCategory !== undefined ? { food_category: foodCategory } : {}),
      ...(quantity !== undefined ? { quantity } : {}),
      ...(foodImageUrl !== undefined ? { food_image_url: foodImageUrl } : {}),
      ...(expiryDate !== undefined ? { expiry_date: new Date(expiryDate) } : {}),
      ...(notes !== undefined ? { notes } : {}),
      updated_at: new Date(),
    };

    const result = await FoodItem.updateOne(
      { _id: req.params.id, user_id: req.auth.id },
      { $set: update }
    );

    res.json({
      modifiedCount: result.modifiedCount,
      message: "Food updated successfully.",
    });
  })
);

app.delete(
  "/api/food-items/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
      return res.json({
        deletedCount: 0,
        message: "Food deleted successfully.",
      });
    }

    const result = await FoodItem.deleteOne({
      _id: req.params.id,
      user_id: req.auth.id,
    });

    res.json({
      deletedCount: result.deletedCount,
      message: "Food deleted successfully.",
    });
  })
);

/* =========================================================
   SURPLUS FOOD
========================================================= */

app.post(
  "/api/surplus",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const {
      title,
      category,
      quantity,
      description,
      images,
      location,
      availableUntil,
      dietaryType,
    } = req.body;

    if (!title || !category || !quantity || !location || !availableUntil) {
      return res.status(400).json({
        message:
          "Title, category, quantity, location and availability are required.",
      });
    }

    if (!Array.isArray(images) || images.length === 0) {
      return res.status(400).json({
        message: "At least one image of the surplus food is required.",
      });
    }

    if (images.length > 5) {
      return res.status(400).json({
        message: "You can upload a maximum of 5 images.",
      });
    }

    const invalidImage = images.some(
      (image) =>
        typeof image !== "string" ||
        !/^data:image\/(jpeg|jpg|png|webp);base64,/i.test(image)
    );

    if (invalidImage) {
      return res.status(400).json({
        message:
          "One or more uploaded files are not valid JPG, PNG or WEBP images.",
      });
    }

    const listing = await SurplusListing.create({
      owner_id: req.auth.id,
      title: String(title).trim(),
      category,
      quantity: String(quantity),
      description: description || "",
      image_url: JSON.stringify(images),
      location: String(location).trim(),
      available_until: new Date(availableUntil),
      dietary_type: dietaryType || "Not specified",
    });

    await addPoints(
      req.auth.id,
      "share_food",
      20,
      Number(quantity) || 1
    );

    res.status(201).json({
      id: String(listing._id),
      images,
      message: "Surplus food shared successfully.",
    });
  })
);

app.get(
  "/api/surplus",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const rows = await SurplusListing.find({
      status: "available",
      available_until: { $gt: new Date() },
    }).sort({ created_at: -1 }).lean();

    const ownerIds = [...new Set(rows.map((r) => String(r.owner_id)))];
    const owners = await User.find({
      _id: { $in: ownerIds },
    }).select("name email").lean();

    const ownerMap = new Map(
      owners.map((u) => [String(u._id), u])
    );

    res.json(
      rows.map((row) => ({
        ...row,
        id: String(row._id),
        owner_id: String(row.owner_id),
        owner_name: ownerMap.get(String(row.owner_id))?.name || "",
        owner_email: ownerMap.get(String(row.owner_id))?.email || "",
      }))
    );
  })
);

app.get(
  "/api/surplus/mine",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const rows = await SurplusListing.find({
      owner_id: req.auth.id,
    }).sort({ created_at: -1 }).lean();

    res.json(
      rows.map((row) => ({
        ...row,
        id: String(row._id),
        owner_id: String(row.owner_id),
      }))
    );
  })
);

app.post(
  "/api/surplus/:id/request",
  authMiddleware,
  asyncHandler(async (req, res) => {
    if (!isValidId(req.params.id)) {
      return res.status(404).json({
        message: "Listing is no longer available.",
      });
    }

    const listing = await SurplusListing.findOne({
      _id: req.params.id,
      status: "available",
    }).lean();

    if (!listing) {
      return res.status(404).json({
        message: "Listing is no longer available.",
      });
    }

    if (String(listing.owner_id) === String(req.auth.id)) {
      return res.status(400).json({
        message: "You cannot request your own listing.",
      });
    }

    const existing = await FoodRequest.findOne({
      listing_id: req.params.id,
      requester_id: req.auth.id,
      status: { $in: ["pending", "accepted"] },
    }).lean();

    if (existing) {
      return res.status(409).json({
        message: "You already requested this food.",
      });
    }

    const request = await FoodRequest.create({
      listing_id: listing._id,
      requester_id: req.auth.id,
      owner_id: listing.owner_id,
      message:
        req.body.message ||
        "I would like to collect this food.",
    });

    await Notification.create({
      user_id: listing.owner_id,
      title: "New food request",
      message: `${req.auth.name} requested ${listing.title}.`,
      type: "request",
    });

    res.status(201).json({
      id: String(request._id),
      message: "Food request sent successfully.",
    });
  })
);

/* =========================================================
   REQUESTS
========================================================= */

app.get(
  "/api/requests",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const rows = await FoodRequest.find({
      $or: [
        { requester_id: req.auth.id },
        { owner_id: req.auth.id },
      ],
    }).sort({ created_at: -1 }).lean();

    const listingIds = [...new Set(rows.map((r) => String(r.listing_id)))];
    const userIds = [
      ...new Set(
        rows.flatMap((r) => [
          String(r.requester_id),
          String(r.owner_id),
        ])
      ),
    ];

    const [listings, users] = await Promise.all([
      SurplusListing.find({
        _id: { $in: listingIds },
      }).lean(),
      User.find({
        _id: { $in: userIds },
      }).select("name email").lean(),
    ]);

    const listingMap = new Map(
      listings.map((s) => [String(s._id), s])
    );
    const userMap = new Map(
      users.map((u) => [String(u._id), u])
    );

    res.json(
      rows.map((r) => {
        const listing = listingMap.get(String(r.listing_id));
        const requester = userMap.get(String(r.requester_id));
        const owner = userMap.get(String(r.owner_id));

        return {
          ...r,
          id: String(r._id),
          listing_id: String(r.listing_id),
          requester_id: String(r.requester_id),
          owner_id: String(r.owner_id),
          title: listing?.title || "",
          quantity: listing?.quantity || "",
          location: listing?.location || "",
          image_url: listing?.image_url || "",
          available_until: listing?.available_until || null,
          requester_name: requester?.name || "",
          requester_email: requester?.email || "",
          owner_name: owner?.name || "",
          owner_email: owner?.email || "",
        };
      })
    );
  })
);

app.patch(
  "/api/requests/:id",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    const allowed = ["accepted", "rejected", "completed", "cancelled"];

    if (!allowed.includes(status)) {
      return res.status(400).json({
        message: "Invalid request status.",
      });
    }

    if (!isValidId(req.params.id)) {
      return res.status(404).json({ message: "Request not found." });
    }

    const request = await FoodRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Request not found.",
      });
    }

    const isOwner = String(request.owner_id) === String(req.auth.id);
    const isRequester =
      String(request.requester_id) === String(req.auth.id);

    if (!isOwner && !isRequester) {
      return res.status(403).json({ message: "Not allowed." });
    }

    if (
      (status === "accepted" || status === "rejected") &&
      !isOwner
    ) {
      return res.status(403).json({
        message:
          "Only the food owner can accept or reject a request.",
      });
    }

    request.status = status;
    request.updated_at = new Date();
    await request.save();

    if (status === "accepted") {
      await SurplusListing.findByIdAndUpdate(request.listing_id, {
        $set: { status: "claimed" },
      });

      await Conversation.findOneAndUpdate(
        { request_id: request._id },
        {
          $setOnInsert: {
            request_id: request._id,
            status: "active",
            created_at: new Date(),
          },
        },
        { upsert: true, new: true }
      );
    }

    if (status === "completed") {
      await SurplusListing.findByIdAndUpdate(request.listing_id, {
        $set: { status: "removed" },
      });

      await addPoints(req.auth.id, "complete_pickup", 15, 1);
    }

    const target =
      String(request.owner_id) === String(req.auth.id)
        ? request.requester_id
        : request.owner_id;

    await Notification.create({
      user_id: target,
      title: "Request updated",
      message: `A food request is now ${status}.`,
      type: "request",
    });

    res.json({
      message: "Request updated successfully.",
    });
  })
);

/* =========================================================
   DASHBOARD
========================================================= */

app.get(
  "/api/dashboard",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 3);

    const nearItems = await FoodItem.find({
      user_id: req.auth.id,
      expiry_date: { $gte: start, $lte: end },
    }).select("_id title expiry_date").lean();

    const dayStart = new Date();
    dayStart.setHours(0, 0, 0, 0);

    for (const item of nearItems) {
      const exists = await Notification.findOne({
        user_id: req.auth.id,
        type: "expiry",
        message: { $regex: item.title, $options: "i" },
        created_at: { $gte: dayStart },
      }).lean();

      if (!exists) {
        await Notification.create({
          user_id: req.auth.id,
          title: "Expiry reminder",
          message:
            `${item.title} is nearing its expiry date. Use it soon to prevent waste.`,
          type: "expiry",
        });
      }
    }

    const foodItems = await FoodItem.find({
      user_id: req.auth.id,
    }).select("expiry_date").lean();

    let expired = 0;
    let nearExpiry = 0;

    for (const item of foodItems) {
      const expiry = new Date(item.expiry_date);
      expiry.setHours(0, 0, 0, 0);

      if (expiry < start) expired += 1;
      else if (expiry >= start && expiry <= end) nearExpiry += 1;
    }

    const [shared, acceptedRequests, user, actions] = await Promise.all([
      SurplusListing.countDocuments({ owner_id: req.auth.id }),
      FoodRequest.countDocuments({
        requester_id: req.auth.id,
        status: "accepted",
      }),
      User.findById(req.auth.id).select("points").lean(),
      ImpactAction.aggregate([
        { $match: { user_id: new mongoose.Types.ObjectId(req.auth.id) } },
        {
          $group: {
            _id: "$action_type",
            count: { $sum: 1 },
            quantity: { $sum: "$quantity" },
            points: { $sum: "$points" },
          },
        },
        { $sort: { count: -1 } },
      ]),
    ]);

    res.json({
      inventory: {
        total: foodItems.length,
        expired,
        near_expiry: nearExpiry,
      },
      shared,
      acceptedRequests,
      points: Number(user?.points || 0),
      actions: actions.map((a) => ({
        action_type: a._id,
        count: a.count,
        quantity: a.quantity,
        points: a.points,
      })),
    });
  })
);

/* =========================================================
   NOTIFICATIONS
========================================================= */

app.get(
  "/api/notifications",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const rows = await Notification.find({
      user_id: req.auth.id,
    }).sort({ created_at: -1 }).limit(30).lean();

    res.json(
      rows.map((row) => ({
        ...row,
        id: String(row._id),
        user_id: String(row.user_id),
      }))
    );
  })
);

app.patch(
  "/api/notifications/:id/read",
  authMiddleware,
  asyncHandler(async (req, res) => {
    if (isValidId(req.params.id)) {
      await Notification.updateOne(
        {
          _id: req.params.id,
          user_id: req.auth.id,
        },
        { $set: { is_read: true } }
      );
    }

    res.json({ message: "Marked as read." });
  })
);

/* =========================================================
   RECIPES
========================================================= */

app.get(
  "/api/recipes",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const q = String(req.query.ingredients || "").toLowerCase();

    const recipes = [
      {
        name: "Vegetable Sandwich",
        items: ["bread", "tomato", "onion", "vegetable"],
        time: "15 min",
        category: "Quick",
      },
      {
        name: "Cheese Toast",
        items: ["bread", "cheese", "dairy"],
        time: "10 min",
        category: "Quick",
      },
      {
        name: "Mixed Vegetable Stir Fry",
        items: ["vegetable", "carrot", "pepper", "onion"],
        time: "20 min",
        category: "Healthy",
      },
      {
        name: "Fruit Bowl",
        items: ["fruit", "apple", "banana"],
        time: "5 min",
        category: "No Cook",
      },
      {
        name: "Creamy Pasta",
        items: ["pasta", "cheese", "milk", "dairy"],
        time: "25 min",
        category: "Dinner",
      },
      {
        name: "Rice & Veggie Bowl",
        items: ["rice", "vegetable", "grain"],
        time: "20 min",
        category: "Dinner",
      },
    ];

    const result = q
      ? recipes.filter((recipe) =>
          recipe.items.some((item) => q.includes(item))
        )
      : recipes;

    res.json(result);
  })
);

/* =========================================================
   LEADERBOARD
========================================================= */

app.get(
  "/api/leaderboard",
  authMiddleware,
  asyncHandler(async (req, res) => {
    const rows = await User.find({})
      .select("name points created_at")
      .sort({ points: -1, created_at: 1 })
      .limit(10)
      .lean();

    res.json(
      rows.map((row) => ({
        id: String(row._id),
        name: row.name,
        points: row.points,
      }))
    );
  })
);

/* =========================================================
   ADMIN
========================================================= */

app.get(
  "/api/admin/users",
  authMiddleware,
  adminMiddleware,
  asyncHandler(async (req, res) => {
    const rows = await User.find({})
      .select("name email role points created_at")
      .sort({ created_at: -1 })
      .lean();

    res.json(
      rows.map((row) => ({
        id: String(row._id),
        name: row.name,
        email: row.email,
        role: row.role,
        points: row.points,
        created_at: row.created_at,
      }))
    );
  })
);

app.patch(
  "/api/admin/users/:id/role",
  authMiddleware,
  adminMiddleware,
  asyncHandler(async (req, res) => {
    const role = req.body.role;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role.",
      });
    }

    if (isValidId(req.params.id)) {
      await User.findByIdAndUpdate(req.params.id, {
        $set: { role },
      });
    }

    res.json({ message: "Role updated successfully." });
  })
);

app.delete(
  "/api/admin/users/:id",
  authMiddleware,
  adminMiddleware,
  asyncHandler(async (req, res) => {
    if (String(req.params.id) === String(req.auth.id)) {
      return res.status(400).json({
        message: "You cannot delete your own admin account.",
      });
    }

    if (isValidId(req.params.id)) {
      await User.findByIdAndDelete(req.params.id);
    }

    res.json({ message: "User deleted successfully." });
  })
);

app.get(
  "/api/admin/stats",
  authMiddleware,
  adminMiddleware,
  asyncHandler(async (req, res) => {
    const [users, food, surplus, requests, saved] = await Promise.all([
      User.countDocuments(),
      FoodItem.countDocuments(),
      SurplusListing.countDocuments(),
      FoodRequest.countDocuments(),
      ImpactAction.aggregate([
        {
          $match: {
            action_type: {
              $in: ["share_food", "complete_pickup"],
            },
          },
        },
        {
          $group: {
            _id: null,
            quantity: { $sum: "$quantity" },
          },
        },
      ]),
    ]);

    res.json({
      users,
      food,
      surplus,
      requests,
      saved: Number(saved[0]?.quantity || 0),
    });
  })
);

/* =========================================================
   DATABASE + SERVER STARTUP
========================================================= */

export async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log("MongoDB connection successful.");
  console.log(`MongoDB database: ${mongoose.connection.name}`);
  return mongoose.connection;
}

// Register chat routes once. The database connection is established by the
// local server startup or by the Vercel function before each request.
app.use("/api/chat", createChatRouter());

app.use((error, req, res, next) => {
  console.error("Nouriva API error:", error);

  if (error?.code === 11000) {
    return res.status(409).json({
      message: "A record with this value already exists.",
    });
  }

  res.status(500).json({
    message: "Internal server error.",
  });
});

export default app;

// Local development only. Vercel imports the Express app through api/index.js
// and does not call app.listen().
if (process.env.VERCEL !== "1") {
  connectDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log("========================================");
        console.log("       NOURIVA API STARTED");
        console.log("========================================");
        console.log(`Server: http://localhost:${PORT}`);
        console.log(`Health: http://localhost:${PORT}/api/health`);
        console.log("========================================");
      });
    })
    .catch((error) => {
      console.error("Failed to connect to MongoDB:", error);
      process.exit(1);
    });
}
