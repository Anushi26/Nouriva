import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {
  Conversation,
  FoodRequest,
  SurplusListing,
  Message,
} from "../models.js";

export default function createChatRouter() {
  const router = express.Router();

  const requireAuth = (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || "";

      if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          message: "Authentication required.",
        });
      }

      req.user = jwt.verify(
        authHeader.substring(7),
        process.env.JWT_SECRET || "nouriva-development-secret"
      );

      next();
    } catch (error) {
      console.error("Chat authentication error:", error);
      return res.status(401).json({
        message: "Invalid or expired login session.",
      });
    }
  };

  const getUserId = (req) =>
    req.user?.id || req.user?.userId || req.user?.user_id;

  const validId = (id) => mongoose.isValidObjectId(id);

  router.post(
    "/conversations",
    requireAuth,
    async (req, res) => {
      try {
        const { requestId } = req.body;
        const userId = getUserId(req);

        if (!userId) {
          return res.status(401).json({
            message: "Unable to identify current user.",
          });
        }

        if (!requestId || !validId(requestId)) {
          return res.status(400).json({
            message: "Request ID is required.",
          });
        }

        const request = await FoodRequest.findById(requestId).lean();

        if (!request) {
          return res.status(404).json({
            message: "Food request not found.",
          });
        }

        const isRequester =
          String(userId) === String(request.requester_id);
        const isOwner =
          String(userId) === String(request.owner_id);

        if (!isRequester && !isOwner) {
          return res.status(403).json({
            message: "You are not part of this food request.",
          });
        }

        if (String(request.status).toLowerCase() !== "accepted") {
          return res.status(400).json({
            message:
              "Chat becomes available after the food request is accepted.",
          });
        }

        let conversation = await Conversation.findOne({
          request_id: request._id,
        }).lean();

        if (!conversation) {
          try {
            conversation = await Conversation.create({
              request_id: request._id,
              status: "active",
            });
            conversation = conversation.toObject();
          } catch (error) {
            if (error?.code === 11000) {
              conversation = await Conversation.findOne({
                request_id: request._id,
              }).lean();
            } else {
              throw error;
            }
          }
        }

        res.status(201).json({
          conversation: {
            id: String(conversation._id),
            request_id: String(conversation.request_id),
            status: conversation.status,
            current_user_id: String(userId),
          },
        });
      } catch (error) {
        console.error("Create conversation error:", error);
        res.status(500).json({
          message: "Unable to create private chat.",
        });
      }
    }
  );

  router.get(
    "/conversations/:conversationId/messages",
    requireAuth,
    async (req, res) => {
      try {
        const { conversationId } = req.params;
        const userId = getUserId(req);

        if (!userId || !validId(conversationId)) {
          return res.status(404).json({
            message: "Conversation not found.",
          });
        }

        const conversation = await Conversation.findById(
          conversationId
        ).lean();

        if (!conversation) {
          return res.status(404).json({
            message: "Conversation not found.",
          });
        }

        const request = await FoodRequest.findById(
          conversation.request_id
        ).lean();

        if (!request) {
          return res.status(404).json({
            message: "Food request not found.",
          });
        }

        const isParticipant =
          String(userId) === String(request.requester_id) ||
          String(userId) === String(request.owner_id);

        if (!isParticipant) {
          return res.status(403).json({
            message: "You do not have access to this conversation.",
          });
        }

        const listing = await SurplusListing.findById(
          request.listing_id
        ).lean();

        const messages = await Message.find({
          conversation_id: conversation._id,
        })
          .sort({ created_at: 1, _id: 1 })
          .lean();

        res.json({
          conversation: {
            id: String(conversation._id),
            request_id: String(conversation.request_id),
            status: conversation.status,
            requester_id: String(request.requester_id),
            owner_id: String(request.owner_id),
            current_user_id: String(userId),
            title: listing?.title || "",
            location: listing?.location || "",
            available_until: listing?.available_until || null,
          },
          messages: messages.map((message) => ({
            id: String(message._id),
            conversation_id: String(message.conversation_id),
            sender_id: String(message.sender_id),
            message: message.message,
            created_at: message.created_at,
          })),
        });
      } catch (error) {
        console.error("Get chat messages error:", error);
        res.status(500).json({
          message: "Unable to load chat.",
        });
      }
    }
  );

  router.post(
    "/conversations/:conversationId/messages",
    requireAuth,
    async (req, res) => {
      try {
        const conversationId = req.params.conversationId;
        const userId = getUserId(req);
        const message = String(req.body.message || "").trim();

        if (!userId || !validId(conversationId)) {
          return res.status(401).json({
            message: "Unable to identify current user.",
          });
        }

        if (!message) {
          return res.status(400).json({
            message: "Message cannot be empty.",
          });
        }

        if (message.length > 1000) {
          return res.status(400).json({
            message: "Message cannot be longer than 1000 characters.",
          });
        }

        const conversation = await Conversation.findById(
          conversationId
        ).lean();

        if (!conversation) {
          return res.status(404).json({
            message: "Conversation not found.",
          });
        }

        const request = await FoodRequest.findById(
          conversation.request_id
        ).lean();

        if (!request) {
          return res.status(404).json({
            message: "Food request not found.",
          });
        }

        const isParticipant =
          String(userId) === String(request.requester_id) ||
          String(userId) === String(request.owner_id);

        if (!isParticipant) {
          return res.status(403).json({
            message: "You cannot send messages in this conversation.",
          });
        }

        if (conversation.status !== "active") {
          return res.status(400).json({
            message: "This chat has been archived.",
          });
        }

        const newMessage = await Message.create({
          conversation_id: conversation._id,
          sender_id: userId,
          message,
        });

        res.status(201).json({
          id: String(newMessage._id),
          conversation_id: String(newMessage.conversation_id),
          sender_id: String(newMessage.sender_id),
          message: newMessage.message,
          created_at: newMessage.created_at,
        });
      } catch (error) {
        console.error("Send chat message error:", error);
        res.status(500).json({
          message: "Unable to send message.",
        });
      }
    }
  );

  router.patch(
    "/conversations/:conversationId/archive",
    requireAuth,
    async (req, res) => {
      try {
        const conversationId = req.params.conversationId;
        const userId = getUserId(req);

        if (!userId || !validId(conversationId)) {
          return res.status(404).json({
            message: "Conversation not found.",
          });
        }

        const conversation = await Conversation.findById(
          conversationId
        ).lean();

        if (!conversation) {
          return res.status(404).json({
            message: "Conversation not found.",
          });
        }

        const request = await FoodRequest.findById(
          conversation.request_id
        ).lean();

        if (!request) {
          return res.status(404).json({
            message: "Food request not found.",
          });
        }

        const isParticipant =
          String(userId) === String(request.requester_id) ||
          String(userId) === String(request.owner_id);

        if (!isParticipant) {
          return res.status(403).json({
            message: "You cannot archive this chat.",
          });
        }

        await Conversation.updateOne(
          { _id: conversationId },
          { $set: { status: "archived" } }
        );

        res.json({
          message: "Chat archived successfully.",
        });
      } catch (error) {
        console.error("Archive chat error:", error);
        res.status(500).json({
          message: "Unable to archive chat.",
        });
      }
    }
  );

  return router;
}
