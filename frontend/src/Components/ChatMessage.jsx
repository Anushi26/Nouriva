import React from "react";

const ChatMessage = ({
  message,
  isMine,
}) => {
  return (
    <div
      className={`flex ${
        isMine
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl ${
          isMine
            ? "bg-[#0a472e] text-white rounded-br-md"
            : "bg-gray-100 text-gray-800 rounded-bl-md"
        }`}
      >
        <p className="text-sm break-words whitespace-pre-wrap">
          {message.message}
        </p>

        <p
          className={`text-[10px] mt-1 ${
            isMine
              ? "text-green-100"
              : "text-gray-400"
          }`}
        >
          {message.created_at
            ? new Date(
                message.created_at
              ).toLocaleTimeString(
                "en-IN",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )
            : ""}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;