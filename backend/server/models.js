import mongoose from "mongoose";

const { Schema } = mongoose;

const baseOptions = {
  versionKey: false,
};

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  photo_url: { type: String, default: "" },
  points: { type: Number, default: 0 },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  created_at: { type: Date, default: Date.now },
}, baseOptions);

const foodItemSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, default: "" },
  food_category: { type: String, required: true },
  quantity: { type: String, required: true },
  food_image_url: { type: String, default: "" },
  expiry_date: { type: Date, required: true },
  notes: { type: String, default: "" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, baseOptions);

const impactActionSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  action_type: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  points: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
}, baseOptions);

const surplusListingSchema = new Schema({
  owner_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  quantity: { type: String, required: true },
  description: { type: String, default: "" },
  image_url: { type: String, required: true },
  location: { type: String, required: true, trim: true },
  available_until: { type: Date, required: true },
  dietary_type: { type: String, default: "Not specified" },
  status: { type: String, enum: ["available", "claimed", "removed"], default: "available" },
  created_at: { type: Date, default: Date.now },
}, baseOptions);

const foodRequestSchema = new Schema({
  listing_id: { type: Schema.Types.ObjectId, ref: "SurplusListing", required: true, index: true },
  requester_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  owner_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  message: { type: String, default: "" },
  status: { type: String, enum: ["pending", "accepted", "rejected", "completed", "cancelled"], default: "pending" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, baseOptions);

const notificationSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true },
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
}, baseOptions);

const conversationSchema = new Schema({
  request_id: { type: Schema.Types.ObjectId, ref: "FoodRequest", required: true, unique: true, index: true },
  status: { type: String, enum: ["active", "archived"], default: "active" },
  created_at: { type: Date, default: Date.now },
}, baseOptions);

const messageSchema = new Schema({
  conversation_id: { type: Schema.Types.ObjectId, ref: "Conversation", required: true, index: true },
  sender_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true, maxlength: 1000 },
  created_at: { type: Date, default: Date.now },
}, baseOptions);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const FoodItem = mongoose.models.FoodItem || mongoose.model("FoodItem", foodItemSchema);
export const ImpactAction = mongoose.models.ImpactAction || mongoose.model("ImpactAction", impactActionSchema);
export const SurplusListing = mongoose.models.SurplusListing || mongoose.model("SurplusListing", surplusListingSchema);
export const FoodRequest = mongoose.models.FoodRequest || mongoose.model("FoodRequest", foodRequestSchema);
export const Notification = mongoose.models.Notification || mongoose.model("Notification", notificationSchema);
export const Conversation = mongoose.models.Conversation || mongoose.model("Conversation", conversationSchema);
export const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
