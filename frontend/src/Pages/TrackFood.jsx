import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import {
  FaBoxOpen,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";

const TrackFood = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchFoodItems = async () => {
      const token = localStorage.getItem("nouriva_token");

      if (!token) {
        setError("Please log in to view your tracked food.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(`${API}/allFoodsItems`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setFoodItems(
          Array.isArray(response.data) ? response.data : []
        );
      } catch (err) {
        console.error("Error fetching tracked food:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load your tracked food."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFoodItems();
  }, []);

  // -----------------------------------------
  // Calculate days remaining
  // -----------------------------------------
  const getDaysRemaining = (expiryDate) => {
    if (!expiryDate) return null;

    const today = new Date();
    const expiry = new Date(expiryDate);

    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const difference =
      expiry.getTime() - today.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  };

  // -----------------------------------------
  // Determine food status
  // -----------------------------------------
  const getFoodStatus = (expiryDate) => {
    const daysRemaining = getDaysRemaining(expiryDate);

    if (daysRemaining === null) {
      return {
        label: "Unknown",
        className: "bg-gray-100 text-gray-700",
        icon: FaClock,
      };
    }

    if (daysRemaining < 0) {
      return {
        label: "Expired",
        className: "bg-red-100 text-red-700",
        icon: FaTimesCircle,
      };
    }

    if (daysRemaining <= 7) {
      return {
        label: "Expiring Soon",
        className: "bg-yellow-100 text-yellow-700",
        icon: FaExclamationTriangle,
      };
    }

    return {
      label: "Fresh",
      className: "bg-green-100 text-green-700",
      icon: FaCheckCircle,
    };
  };

  // -----------------------------------------
  // Expiry text
  // -----------------------------------------
  const getExpiryText = (expiryDate) => {
    const daysRemaining = getDaysRemaining(expiryDate);

    if (daysRemaining === null) {
      return "Expiry date not available";
    }

    if (daysRemaining < 0) {
      const expiredDays = Math.abs(daysRemaining);

      return expiredDays === 1
        ? "Expired 1 day ago"
        : `Expired ${expiredDays} days ago`;
    }

    if (daysRemaining === 0) {
      return "Expires today";
    }

    if (daysRemaining === 1) {
      return "Expires in 1 day";
    }

    return `Expires in ${daysRemaining} days`;
  };

  // -----------------------------------------
  // Summary counts
  // -----------------------------------------
  const summary = useMemo(() => {
    let fresh = 0;
    let expiringSoon = 0;
    let expired = 0;

    foodItems.forEach((item) => {
      const status = getFoodStatus(item.expiryDate);

      if (status.label === "Fresh") {
        fresh++;
      } else if (status.label === "Expiring Soon") {
        expiringSoon++;
      } else if (status.label === "Expired") {
        expired++;
      }
    });

    return {
      total: foodItems.length,
      fresh,
      expiringSoon,
      expired,
    };
  }, [foodItems]);

  // -----------------------------------------
  // Loading
  // -----------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-roboto">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-[#0a472e] rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-600">
            Loading your tracked food...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4 font-roboto">
      <div className="w-11/12 max-w-7xl mx-auto">

        {/* PAGE HEADER */}
        <div className="mb-8">
          <p className="text-green-700 font-semibold">
            NOURIVA FOOD TRACKER
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-[#0a472e] mt-2">
            Track Your Food
          </h1>

          <p className="text-gray-600 mt-3 max-w-2xl">
            Monitor your food items and use them before they
            expire.
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-5 text-red-700">
            {error}
          </div>
        )}

        {/* SUMMARY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          {/* Total */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
            <FaBoxOpen className="text-2xl text-[#0a472e]" />

            <p className="text-sm text-gray-500 mt-4">
              Total Tracked
            </p>

            <h2 className="text-4xl font-bold text-[#0a472e] mt-1">
              {summary.total}
            </h2>
          </div>

          {/* Fresh */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">
            <FaCheckCircle className="text-2xl text-green-600" />

            <p className="text-sm text-gray-500 mt-4">
              Fresh
            </p>

            <h2 className="text-4xl font-bold text-green-700 mt-1">
              {summary.fresh}
            </h2>
          </div>

          {/* Expiring Soon */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-yellow-100">
            <FaExclamationTriangle className="text-2xl text-yellow-600" />

            <p className="text-sm text-gray-500 mt-4">
              Expiring Soon
            </p>

            <h2 className="text-4xl font-bold text-yellow-600 mt-1">
              {summary.expiringSoon}
            </h2>
          </div>

          {/* Expired */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100">
            <FaTimesCircle className="text-2xl text-red-600" />

            <p className="text-sm text-gray-500 mt-4">
              Expired
            </p>

            <h2 className="text-4xl font-bold text-red-600 mt-1">
              {summary.expired}
            </h2>
          </div>

        </div>

        {/* TRACKED FOOD */}
        <div className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden">

          <div className="p-6 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-[#0a472e]">
              Tracked Food
            </h2>

            <p className="text-gray-500 mt-1">
              Check your food inventory and expiry status.
            </p>
          </div>

          {foodItems.length === 0 ? (
            <div className="p-12 text-center">
              <FaBoxOpen className="mx-auto text-5xl text-gray-300" />

              <h3 className="text-xl font-semibold text-gray-700 mt-5">
                No food items tracked yet
              </h3>

              <p className="text-gray-500 mt-2">
                Add food items to start tracking their expiry
                dates.
              </p>

              <Link
                to="/home/addFood"
                className="inline-block mt-6 px-6 py-3 rounded-lg bg-[#0a472e] text-white hover:bg-[#083c26] transition"
              >
                Add Food
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[800px]">

                <thead className="bg-gray-50">
                  <tr className="text-left text-sm text-gray-500">

                    <th className="px-6 py-4 font-semibold">
                      Food Item
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Category
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Quantity
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Expiry
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Status
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {foodItems.map((item) => {
                    const status = getFoodStatus(
                      item.expiryDate
                    );

                    const StatusIcon = status.icon;

                    return (
                      <tr
                        key={item._id || item.id}
                        className="border-t border-gray-100 hover:bg-gray-50 transition"
                      >

                        {/* Food Item */}
                        <td className="px-6 py-5">
                          <div className="font-semibold text-gray-800 capitalize">
                            {item.title || "Unnamed Food"}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-5">
                          <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                            {item.foodCategory || "—"}
                          </span>
                        </td>

                        {/* Quantity */}
                        <td className="px-6 py-5 text-gray-600">
                          {item.quantity ?? "—"}
                        </td>

                        {/* Expiry */}
                        <td className="px-6 py-5">
                          <div className="font-medium text-gray-700">
                            {item.expiryDate
                              ? new Date(
                                  item.expiryDate
                                ).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )
                              : "—"}
                          </div>

                          <div className="text-sm text-gray-500 mt-1">
                            {getExpiryText(
                              item.expiryDate
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold ${status.className}`}
                          >
                            <StatusIcon />
                            {status.label}
                          </span>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* STATUS LEGEND */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-green-100">

          <h3 className="font-bold text-lg text-[#0a472e] mb-4">
            Food Status
          </h3>

          <div className="flex flex-wrap gap-5">

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>

              <span className="text-gray-600">
                Fresh — more than 7 days remaining
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>

              <span className="text-gray-600">
                Expiring Soon — 7 days or less
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span>

              <span className="text-gray-600">
                Expired — expiry date has passed
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default TrackFood;