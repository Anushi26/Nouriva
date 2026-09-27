import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
      <span className="loading loading-dots loading-xl text-green-900"></span>
    </div>
  );
};

export default Loading;
