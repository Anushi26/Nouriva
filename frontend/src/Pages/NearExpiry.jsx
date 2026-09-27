import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import {
  FaBell,
  FaExclamationTriangle,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const NearExpiry = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ---------------------------------------------------
  // Fetch food items
  // ---------------------------------------------------
  useEffect(() => {
    const fetchNearExpiryItems = async () => {
      const token = localStorage.getItem("nouriva_token");

      if (!token) {
        setError("Please log in to view your near-expiry food.");
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

        const allItems = Array.isArray(response.data)
          ? response.data
          : [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const nearExpiry = allItems.filter((item) => {
          if (!item.expiryDate) return false;

          const expiry = new Date(item.expiryDate);
          expiry.setHours(0, 0, 0, 0);

          const difference =
            expiry.getTime() - today.getTime();

          const daysRemaining = Math.ceil(
            difference / (1000 * 60 * 60 * 24)
          );

          return daysRemaining >= 0 && daysRemaining <= 7;
        });

        // Earliest expiry first
        nearExpiry.sort(
          (a, b) =>
            new Date(a.expiryDate) -
            new Date(b.expiryDate)
        );

        setFoodItems(nearExpiry);
      } catch (err) {
        console.error(
          "Error fetching near expiry items:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Unable to load near expiry food items."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNearExpiryItems();
  }, []);

  // ---------------------------------------------------
  // Days remaining
  // ---------------------------------------------------
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

  // ---------------------------------------------------
  // Expiry text
  // ---------------------------------------------------
  const getExpiryText = (expiryDate) => {
    const days = getDaysRemaining(expiryDate);

    if (days === null) {
      return "Expiry date unavailable";
    }

    if (days === 0) {
      return "Expires today";
    }

    if (days === 1) {
      return "Expires in 1 day";
    }

    return `Expires in ${days} days`;
  };

  // ---------------------------------------------------
  // Loading
  // ---------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-roboto">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-[#0a472e] rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-600">
            Loading near expiry food...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4 font-roboto">
      <div className="w-11/12 max-w-6xl mx-auto">

        {/* -------------------------------------------
            HEADER
        ------------------------------------------- */}
        <div className="mb-8">
          <p className="text-yellow-600 font-semibold tracking-wide">
            FOOD ALERT
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-[#0a472e] mt-2">
            Near Expiry
          </h1>

          <p className="text-gray-600 mt-3 max-w-2xl">
            These food items are expiring within the next 7 days.
            Use them soon to help reduce food waste.
          </p>
        </div>

        {/* -------------------------------------------
            ERROR
        ------------------------------------------- */}
        {error && (
          <div className="mb-6 p-5 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {/* -------------------------------------------
            SUMMARY
        ------------------------------------------- */}
        {!error && (
          <div className="bg-white rounded-2xl shadow-sm border border-yellow-100 p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                <FaBell className="text-yellow-600 text-xl" />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Food items needing attention
                </p>

                <h2 className="text-3xl font-bold text-[#0a472e]">
                  {foodItems.length}
                </h2>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------
            NO ITEMS
        ------------------------------------------- */}
        {!error && foodItems.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-12 text-center">
            <FaCheckCircle className="mx-auto text-5xl text-green-600" />

            <h2 className="text-2xl font-bold text-[#0a472e] mt-5">
              No food items are near expiry
            </h2>

            <p className="text-gray-500 mt-2 max-w-xl mx-auto">
              Great! None of your food items are expiring within
              the next 7 days.
            </p>
          </div>
        )}

        {/* -------------------------------------------
            FOOD ITEMS
        ------------------------------------------- */}
        {foodItems.length > 0 && (
          <div className="space-y-4">

            {foodItems.map((item) => {
              const daysRemaining = getDaysRemaining(
                item.expiryDate
              );

              return (
                <div
                  key={item._id || item.id}
                  className="bg-white rounded-2xl shadow-sm border border-yellow-200 p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                    {/* Food Information */}
                    <div className="flex items-start gap-4">

                      <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
                        <FaExclamationTriangle className="text-yellow-600 text-xl" />
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-gray-800 capitalize">
                          {item.title || "Unnamed Food"}
                        </h2>

                        <p className="text-gray-500 mt-1">
                          {item.foodCategory ||
                            "Category not available"}
                        </p>

                        <p className="text-gray-600 mt-2">
                          Quantity:{" "}
                          <span className="font-semibold">
                            {item.quantity ?? "—"}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Expiry Information */}
                    <div className="text-left md:text-right">

                      <p className="text-sm text-gray-500">
                        Expiry Date
                      </p>

                      <p className="font-semibold text-gray-800 mt-1">
                        {new Date(
                          item.expiryDate
                        ).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>

                      <span className="inline-block mt-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm">
                        {getExpiryText(item.expiryDate)}
                      </span>

                    </div>
                  </div>

                  {/* ----------------------------------
                      EXPIRY PROGRESS
                  ---------------------------------- */}
                  <div className="mt-5 pt-5 border-t border-gray-100">

                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-500">
                        Expiry status
                      </span>

                      <span className="font-semibold text-yellow-600">
                        {daysRemaining === 0
                          ? "Today"
                          : `${daysRemaining} day${
                              daysRemaining !== 1
                                ? "s"
                                : ""
                            } remaining`}
                      </span>
                    </div>

                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              10,
                              ((7 - daysRemaining + 1) /
                                7) *
                                100
                            )
                          )}%`,
                        }}
                      ></div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* -------------------------------------------
            GO TO HOME
        ------------------------------------------- */}
        <div className="flex justify-center mt-10">
          <Link
            to="/home"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-lg bg-[#0a472e] text-white hover:bg-[#083c26] transition font-semibold shadow-sm"
          >
            <FaArrowLeft />
            Go to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NearExpiry;