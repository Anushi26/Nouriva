import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router";

import { toast } from "react-toastify";

import {
  FaArrowLeft,
  FaPaperPlane,
  FaLock,
  FaLeaf,
  FaArchive,
} from "react-icons/fa";

import ChatMessage from "../Components/ChatMessage";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const Chat = () => {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const requestId =
    searchParams.get("requestId");

  const token =
    localStorage.getItem(
      "nouriva_token"
    );

  const [conversation, setConversation] =
    useState(null);

  const [messages, setMessages] =
    useState([]);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const messagesEndRef =
    useRef(null);

  // ====================================================
  // OPEN CHAT
  // ====================================================

  const openChat = async () => {
    if (!token) {
      toast.error(
        "Please login first."
      );

      navigate("/auth/login");
      return;
    }

    if (!requestId) {
      toast.error(
        "No food request selected."
      );

      navigate("/home/requests");
      return;
    }

    try {
      const response =
        await fetch(
          `${API_URL}/chat/conversations`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              requestId:
                requestId,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to open chat."
        );
      }

      setConversation(
        data.conversation
      );
    } catch (error) {
      console.error(
        "Open chat error:",
        error
      );

      toast.error(
        error.message ||
          "Unable to open chat."
      );
    }
  };

  // ====================================================
  // LOAD MESSAGES
  // ====================================================

  const loadMessages = async () => {
    if (!conversation?.id) {
      return;
    }

    try {
      const response =
        await fetch(
          `${API_URL}/chat/conversations/${conversation.id}/messages`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load messages."
        );
      }

      setConversation(
        data.conversation
      );

      setMessages(
        Array.isArray(
          data.messages
        )
          ? data.messages
          : []
      );
    } catch (error) {
      console.error(
        "Load messages error:",
        error
      );
    }
  };

  // ====================================================
  // INITIAL LOAD
  // ====================================================

  useEffect(() => {
    const startChat =
      async () => {
        setLoading(true);

        await openChat();

        setLoading(false);
      };

    startChat();
  }, [requestId]);

  // ====================================================
  // MESSAGE POLLING
  // ====================================================

  useEffect(() => {
    if (!conversation?.id) {
      return;
    }

    loadMessages();

    const interval =
      setInterval(() => {
        loadMessages();
      }, 3000);

    return () => {
      clearInterval(
        interval
      );
    };
  }, [
    conversation?.id,
  ]);

  // ====================================================
  // AUTO SCROLL
  // ====================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [messages]);

  // ====================================================
  // SEND MESSAGE
  // ====================================================

  const sendMessage = async (
    event
  ) => {
    event.preventDefault();

    const text =
      message.trim();

    if (!text) {
      return;
    }

    if (!conversation?.id) {
      return;
    }

    if (
      conversation.status !==
      "active"
    ) {
      toast.error(
        "This chat has been archived."
      );

      return;
    }

    try {
      setSending(true);

      const response =
        await fetch(
          `${API_URL}/chat/conversations/${conversation.id}/messages`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              message: text,
            }),
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to send message."
        );
      }

      setMessages(
        (previous) => [
          ...previous,
          data,
        ]
      );

      setMessage("");
    } catch (error) {
      console.error(
        "Send message error:",
        error
      );

      toast.error(
        error.message ||
          "Unable to send message."
      );
    } finally {
      setSending(false);
    }
  };

  // ====================================================
  // ARCHIVE
  // ====================================================

  const archiveChat =
    async () => {
      if (!conversation?.id) {
        return;
      }

      try {
        const response =
          await fetch(
            `${API_URL}/chat/conversations/${conversation.id}/archive`,
            {
              method: "PATCH",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to archive chat."
          );
        }

        toast.success(
          "Chat archived."
        );

        setConversation(
          (previous) => ({
            ...previous,
            status: "archived",
          })
        );
      } catch (error) {
        toast.error(
          error.message ||
            "Unable to archive chat."
        );
      }
    };

  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7faf7] flex items-center justify-center">

        <div className="text-center">

          <div className="w-11 h-11 border-4 border-green-200 border-t-[#0a472e] rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500">
            Opening private chat...
          </p>

        </div>

      </div>
    );
  }

  // ====================================================
  // PAGE
  // ====================================================

  return (
    <div className="min-h-screen bg-[#f7faf7] py-8 px-4">

      <div className="max-w-3xl mx-auto">

        {/* BACK */}

        <button
          onClick={() =>
            navigate(
              "/home/requests"
            )
          }
          className="flex items-center gap-2 text-[#0a472e] font-semibold mb-5 hover:underline"
        >
          <FaArrowLeft />

          Back to Requests
        </button>

        {/* CHAT */}

        <div className="bg-white rounded-2xl shadow-xl border border-green-100 overflow-hidden">

          {/* HEADER */}

          <div className="bg-[#0a472e] text-white px-6 py-5">

            <div className="flex items-center justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">

                  <FaLeaf size={22} />

                </div>

                <div>

                  <h1 className="text-xl font-bold">
                    Nouriva Private Chat
                  </h1>

                  <p className="text-green-100 text-sm">
                    Food pickup coordination
                  </p>

                </div>

              </div>

              {conversation && (
                <span className="text-xs bg-white/10 px-3 py-1 rounded-full capitalize">
                  {conversation.status}
                </span>
              )}

            </div>

          </div>

          {/* PRIVACY */}

          <div className="px-5 py-3 bg-green-50 border-b border-green-100 flex items-start gap-2">

            <FaLock
              className="text-green-700 mt-0.5"
              size={14}
            />

            <p className="text-xs text-green-800">

              Private conversation. Only
              the food owner and requester
              can access these messages.

            </p>

          </div>

          {/* MESSAGES */}

          <div className="h-[500px] overflow-y-auto bg-gray-50 p-5 space-y-4">

            {messages.length ===
              0 && (

              <div className="h-full flex items-center justify-center">

                <div className="text-center">

                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">

                    <FaLock
                      size={24}
                      className="text-[#0a472e]"
                    />

                  </div>

                  <h2 className="font-bold text-gray-700 mt-4">
                    Private conversation
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Start the conversation
                    to arrange the food
                    pickup.
                  </p>

                </div>

              </div>
            )}

            {messages.map(
              (item) => (

                <ChatMessage
                  key={item.id}
                  message={item}
                  isMine={
                    Number(
                      item.sender_id
                    ) ===
                    Number(
                      conversation?.current_user_id
                    )
                  }
                />

              )
            )}

            <div
              ref={
                messagesEndRef
              }
            />

          </div>

          {/* INPUT */}

          <form
            onSubmit={sendMessage}
            className="p-4 bg-white border-t"
          >

            <div className="flex gap-3">

              <input
                type="text"
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                placeholder="Type a message..."
                maxLength={1000}
                disabled={
                  sending ||
                  conversation?.status !==
                    "active"
                }
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-600 disabled:bg-gray-100"
              />

              <button
                type="submit"
                disabled={
                  sending ||
                  !message.trim() ||
                  conversation?.status !==
                    "active"
                }
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#0a472e] text-white disabled:opacity-50 hover:bg-green-900 transition"
              >
                <FaPaperPlane />
              </button>

            </div>

            <div className="flex items-center justify-between mt-2">

              <p className="text-xs text-gray-400">
                Never share your phone
                number or email.
              </p>

              {conversation?.status ===
                "active" && (

                <button
                  type="button"
                  onClick={
                    archiveChat
                  }
                  className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1"
                >
                  <FaArchive />
                  Archive Chat
                </button>

              )}

            </div>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Chat;