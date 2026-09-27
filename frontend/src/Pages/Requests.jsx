import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

import {
  FaArrowLeft,
  FaInbox,
  FaMapMarkerAlt,
  FaClock,
  FaUtensils,
  FaCheck,
  FaTimes,
  FaBoxOpen,
  FaComments,
} from "react-icons/fa";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const Requests = () => {
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [filter, setFilter] = useState("all");

  // =====================================================
  // GET REQUESTS
  // =====================================================

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("nouriva_token");

      if (!token) {
        toast.error("Please login first.");
        navigate("/auth/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load requests."
        );
      }

      setRequests(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (error) {
      console.error(
        "Requests error:",
        error
      );

      toast.error(
        error.message ||
          "Unable to load requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // =====================================================
  // UPDATE REQUEST STATUS
  // =====================================================

  const updateRequest = async (
    id,
    status
  ) => {
    try {
      setUpdating(id);

      const token =
        localStorage.getItem(
          "nouriva_token"
        );

      const response = await fetch(
        `${API_URL}/requests/${id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update request."
        );
      }

      toast.success(
        `Request ${status}.`
      );

      setRequests((prev) =>
        prev.map((request) =>
          request.id === id
            ? {
                ...request,
                status,
              }
            : request
        )
      );
    } catch (error) {
      console.error(
        "Update request error:",
        error
      );

      toast.error(
        error.message ||
          "Unable to update request."
      );
    } finally {
      setUpdating(null);
    }
  };

  // =====================================================
  // OPEN PRIVATE CHAT
  // =====================================================

  const openChat = (requestId) => {
    navigate(
      `/home/chat?requestId=${requestId}`
    );
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not specified";
    }

    const parsed = new Date(date);

    if (isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (
    status
  ) => {
    switch (
      String(status || "")
        .toLowerCase()
    ) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";

      case "accepted":
        return "bg-green-100 text-green-800";

      case "rejected":
        return "bg-red-100 text-red-800";

      case "completed":
        return "bg-blue-100 text-blue-800";

      case "cancelled":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredRequests =
    filter === "all"
      ? requests
      : requests.filter(
          (request) =>
            String(
              request.status
            ).toLowerCase() === filter
        );

  // =====================================================
  // COUNTS
  // =====================================================

  const pendingCount =
    requests.filter(
      (r) => r.status === "pending"
    ).length;

  const acceptedCount =
    requests.filter(
      (r) => r.status === "accepted"
    ).length;

  const completedCount =
    requests.filter(
      (r) => r.status === "completed"
    ).length;

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f7faf7] py-10 px-4">

      <div className="max-w-6xl mx-auto">

        {/* BACK */}

        <button
          onClick={() =>
            navigate("/home")
          }
          className="flex items-center gap-2 text-[#0a472e] font-semibold mb-6 hover:underline"
        >
          <FaArrowLeft />

          Back to Home
        </button>

        {/* HEADER */}

        <div className="bg-[#0a472e] rounded-2xl text-white p-8 mb-8 shadow-lg">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">

                <FaInbox size={25} />

              </div>

              <div>

                <h1 className="text-3xl font-bold">
                  Food Requests
                </h1>

                <p className="text-green-100 mt-1">
                  Manage food requests you
                  have sent and received.
                </p>

              </div>

            </div>

            <button
              onClick={fetchRequests}
              className="px-5 py-3 bg-white text-[#0a472e] rounded-xl font-semibold hover:bg-green-50 transition"
            >
              Refresh
            </button>

          </div>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

          <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm">

            <p className="text-gray-500 text-sm">
              Pending
            </p>

            <h2 className="text-3xl font-bold text-yellow-600 mt-1">
              {pendingCount}
            </h2>

          </div>

          <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm">

            <p className="text-gray-500 text-sm">
              Accepted
            </p>

            <h2 className="text-3xl font-bold text-green-700 mt-1">
              {acceptedCount}
            </h2>

          </div>

          <div className="bg-white rounded-2xl p-5 border border-green-100 shadow-sm">

            <p className="text-gray-500 text-sm">
              Completed
            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-1">
              {completedCount}
            </h2>

          </div>

        </div>

        {/* FILTER */}

        <div className="flex flex-wrap gap-3 mb-6">

          {[
            ["all", "All"],
            ["pending", "Pending"],
            ["accepted", "Accepted"],
            ["completed", "Completed"],
            ["rejected", "Rejected"],
            ["cancelled", "Cancelled"],
          ].map(
            ([value, label]) => (

              <button
                key={value}
                onClick={() =>
                  setFilter(value)
                }
                className={`px-5 py-2 rounded-full font-medium transition ${
                  filter === value
                    ? "bg-[#0a472e] text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-green-500"
                }`}
              >
                {label}
              </button>

            )
          )}

        </div>

        {/* LOADING */}

        {loading && (

          <div className="bg-white rounded-2xl p-12 text-center border border-green-100">

            <div className="w-10 h-10 border-4 border-green-200 border-t-[#0a472e] rounded-full animate-spin mx-auto mb-4"></div>

            <p className="text-gray-600">
              Loading requests...
            </p>

          </div>

        )}

        {/* EMPTY */}

        {!loading &&
          filteredRequests.length === 0 && (

            <div className="bg-white rounded-2xl p-12 text-center border border-green-100">

              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto">

                <FaInbox
                  size={30}
                  className="text-[#0a472e]"
                />

              </div>

              <h2 className="text-2xl font-bold text-[#0a472e] mt-5">
                No requests found
              </h2>

              <p className="text-gray-500 mt-2">
                Your food requests will
                appear here.
              </p>

              <button
                onClick={() =>
                  navigate(
                    "/home/shared-food"
                  )
                }
                className="mt-6 px-6 py-3 bg-[#0a472e] text-white rounded-xl font-semibold hover:bg-green-900 transition"
              >
                Browse Shared Food
              </button>

            </div>

          )}

        {/* REQUESTS */}

        {!loading &&
          filteredRequests.length > 0 && (

            <div className="space-y-5">

              {filteredRequests.map(
                (request) => (

                  <div
                    key={request.id}
                    className="bg-white rounded-2xl border border-green-100 shadow-sm p-6"
                  >

                    {/* TOP */}

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                      <div>

                        <div className="flex flex-wrap items-center gap-3">

                          <h2 className="text-xl font-bold text-[#0a472e]">
                            {request.title ||
                              "Food Request"}
                          </h2>

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
                              request.status
                            )}`}
                          >
                            {request.status ||
                              "pending"}
                          </span>

                        </div>

                        <p className="text-gray-500 text-sm mt-1">
                          Request #{request.id}
                        </p>

                      </div>

                      <div className="text-sm text-gray-500">
                        {formatDate(
                          request.created_at
                        )}
                      </div>

                    </div>

                    {/* DETAILS */}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">

                      <div className="flex items-start gap-3">

                        <FaUtensils className="text-[#a8b324] mt-1" />

                        <div>

                          <p className="text-xs text-gray-500">
                            Quantity
                          </p>

                          <p className="font-semibold text-gray-800">
                            {request.quantity ||
                              "Not specified"}
                          </p>

                        </div>

                      </div>

                      <div className="flex items-start gap-3">

                        <FaMapMarkerAlt className="text-[#a8b324] mt-1" />

                        <div>

                          <p className="text-xs text-gray-500">
                            Pickup Location
                          </p>

                          <p className="font-semibold text-gray-800">
                            {request.location ||
                              "Not specified"}
                          </p>

                        </div>

                      </div>

                      <div className="flex items-start gap-3">

                        <FaClock className="text-[#a8b324] mt-1" />

                        <div>

                          <p className="text-xs text-gray-500">
                            Available Until
                          </p>

                          <p className="font-semibold text-gray-800">
                            {formatDate(
                              request.available_until
                            )}
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* PEOPLE */}

                    <div className="mt-5 p-4 bg-green-50 rounded-xl">

                      <p className="text-sm text-gray-600">

                        {request.owner_name &&
                        request.requester_name ? (
                          <>
                            <strong>
                              Owner:
                            </strong>{" "}
                            {request.owner_name}

                            <span className="mx-2">
                              •
                            </span>

                            <strong>
                              Requested by:
                            </strong>{" "}
                            {request.requester_name}
                          </>
                        ) : (
                          "Food sharing request"
                        )}

                      </p>

                    </div>

                    {/* MESSAGE */}

                    {request.message && (

                      <div className="mt-4">

                        <p className="text-xs font-semibold text-gray-500 uppercase">
                          Message
                        </p>

                        <p className="text-gray-700 mt-1">
                          {request.message}
                        </p>

                      </div>

                    )}

                    {/* ACTIONS */}

                    <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-gray-100">

                      {/* PENDING */}

                      {request.status ===
                        "pending" && (

                        <>

                          <button
                            onClick={() =>
                              updateRequest(
                                request.id,
                                "accepted"
                              )
                            }
                            disabled={
                              updating ===
                              request.id
                            }
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-700 text-white font-semibold hover:bg-green-800 disabled:opacity-50"
                          >
                            <FaCheck />

                            Accept
                          </button>

                          <button
                            onClick={() =>
                              updateRequest(
                                request.id,
                                "rejected"
                              )
                            }
                            disabled={
                              updating ===
                              request.id
                            }
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-100 text-red-700 font-semibold hover:bg-red-200 disabled:opacity-50"
                          >
                            <FaTimes />

                            Reject
                          </button>

                          <button
                            onClick={() =>
                              updateRequest(
                                request.id,
                                "cancelled"
                              )
                            }
                            disabled={
                              updating ===
                              request.id
                            }
                            className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50"
                          >
                            Cancel Request
                          </button>

                        </>

                      )}

                      {/* =================================
                          ACCEPTED
                      ================================= */}

                      {request.status ===
                        "accepted" && (

                        <>

                          {/* CHAT */}

                          <button
                            onClick={() =>
                              openChat(
                                request.id
                              )
                            }
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#a8b324] text-[#0a472e] font-semibold hover:bg-[#96a21f] transition"
                          >
                            <FaComments />

                            Private Chat
                          </button>

                          {/* COMPLETED */}

                          <button
                            onClick={() =>
                              updateRequest(
                                request.id,
                                "completed"
                              )
                            }
                            disabled={
                              updating ===
                              request.id
                            }
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0a472e] text-white font-semibold hover:bg-green-900 disabled:opacity-50"
                          >
                            <FaBoxOpen />

                            Mark Completed
                          </button>

                        </>

                      )}

                      {/* COMPLETED */}

                      {request.status ===
                        "completed" && (

                        <>

                          <div className="flex items-center gap-2 text-green-700 font-semibold">

                            <FaCheck />

                            Food sharing completed

                          </div>

                          {/* OPTIONAL:
                              Allow them to view
                              the old conversation.
                          */}

                          <button
                            onClick={() =>
                              openChat(
                                request.id
                              )
                            }
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#0a472e] text-[#0a472e] font-semibold hover:bg-green-50 transition"
                          >
                            <FaComments />

                            View Chat
                          </button>

                        </>

                      )}

                      {/* REJECTED */}

                      {request.status ===
                        "rejected" && (

                        <div className="text-red-600 font-semibold">

                          This request was rejected.

                        </div>

                      )}

                      {/* CANCELLED */}

                      {request.status ===
                        "cancelled" && (

                        <div className="text-gray-500 font-semibold">

                          This request was cancelled.

                        </div>

                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

      </div>

    </div>
  );
};

export default Requests;