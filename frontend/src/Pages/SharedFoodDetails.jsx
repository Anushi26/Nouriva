import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaClock,
  FaUtensils,
  FaShareAlt,
  FaUser,
} from "react-icons/fa";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const SharedFoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD SHARED FOOD DETAILS
  // ==========================================

  useEffect(() => {
    const fetchFoodDetails = async () => {
      try {
        const token =
          localStorage.getItem("nouriva_token");

        if (!token) {
          toast.error("Please login first.");

          navigate("/auth/login", {
            replace: true,
          });

          return;
        }

        /*
         * IMPORTANT:
         * We use /surplus here because
         * SurplusFood.jsx also uses /surplus.
         *
         * This allows us to find ANY shared
         * food item displayed in the marketplace.
         */

        const response = await fetch(
          `${API_URL}/surplus`,
          {
            method: "GET",

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
              "Unable to load shared food."
          );
        }

        const items = Array.isArray(data)
          ? data
          : [];

        // Find the clicked food item
        const selectedFood = items.find(
          (item) =>
            String(item.id) ===
            String(id)
        );

        if (!selectedFood) {
          toast.error(
            "Shared food item not found."
          );

          navigate(
            "/home/shared-food",
            {
              replace: true,
            }
          );

          return;
        }

        setFood(selectedFood);

      } catch (error) {
        console.error(
          "Shared food details error:",
          error
        );

        toast.error(
          error.message ||
            "Unable to load food details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFoodDetails();
  }, [id, navigate]);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Not specified";
    }

    const parsedDate =
      new Date(date);

    if (
      isNaN(
        parsedDate.getTime()
      )
    ) {
      return date;
    }

    return parsedDate.toLocaleString(
      "en-IN",
      {
        dateStyle: "medium",
        timeStyle: "short",
      }
    );
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7faf7] flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-green-200 border-t-[#0a472e] rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-gray-600">
            Loading shared food...
          </p>

        </div>

      </div>
    );
  }

  // ==========================================
  // FOOD NOT FOUND
  // ==========================================

  if (!food) {
    return (
      <div className="min-h-screen bg-[#f7faf7] flex items-center justify-center px-4">

        <div className="text-center">

          <h2 className="text-2xl font-bold text-[#0a472e]">
            Food item not found
          </h2>

          <p className="text-gray-500 mt-2">
            This shared food may no longer
            be available.
          </p>

          <button
            onClick={() =>
              navigate(
                "/home/shared-food"
              )
            }
            className="mt-5 px-6 py-3 bg-[#0a472e] text-white rounded-lg"
          >
            Back to Shared Food
          </button>

        </div>

      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-[#f7faf7] py-10 px-4">

      <div className="max-w-5xl mx-auto">

        {/* =====================================
            BACK BUTTON
        ===================================== */}

        <button
          onClick={() =>
            navigate(
              "/home/shared-food"
            )
          }
          className="flex items-center gap-2 text-[#0a472e] font-semibold mb-6 hover:underline"
        >
          <FaArrowLeft />

          Back to Shared Food
        </button>


        {/* =====================================
            MAIN CARD
        ===================================== */}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">

          <div className="grid md:grid-cols-2">


            {/* =================================
                FOOD IMAGE
            ================================= */}

            <div className="min-h-[400px] bg-gray-100">

              {food.image_url ? (

                <img
                  src={food.image_url}
                  alt={
                    food.title ||
                    "Shared food"
                  }
                  className="w-full h-full min-h-[400px] object-cover"
                />

              ) : (

                <div className="w-full min-h-[400px] flex items-center justify-center">

                  <FaUtensils
                    size={75}
                    className="text-gray-300"
                  />

                </div>

              )}

            </div>


            {/* =================================
                FOOD INFORMATION
            ================================= */}

            <div className="p-8">

              {/* HEADER */}

              <div className="flex items-start justify-between gap-4">

                <div>

                  <p className="text-sm font-semibold tracking-widest text-green-700 uppercase">
                    Shared Food
                  </p>

                  <h1 className="text-3xl md:text-4xl font-bold text-[#0a472e] mt-2">
                    {food.title ||
                      "Unnamed Food"}
                  </h1>

                </div>

                <FaShareAlt
                  size={25}
                  className="text-[#a8b324] mt-2"
                />

              </div>


              {/* STATUS */}

              <div className="mt-5">

                <span className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-semibold capitalize">
                  {food.status ||
                    "Available"}
                </span>

              </div>


              {/* DESCRIPTION */}

              {food.description && (

                <div className="mt-6">

                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Description
                  </h2>

                  <p className="text-gray-600 leading-relaxed">
                    {food.description}
                  </p>

                </div>

              )}


              {/* =================================
                  FOOD DETAILS
              ================================= */}

              <div className="mt-7 space-y-5">


                {/* CATEGORY */}

                <div className="flex items-center gap-4">

                  <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center">

                    <FaUtensils className="text-[#0a472e]" />

                  </div>

                  <div>

                    <p className="text-xs text-gray-500">
                      Category
                    </p>

                    <p className="font-semibold text-gray-800">
                      {food.category ||
                        "Not specified"}
                    </p>

                  </div>

                </div>


                {/* QUANTITY */}

                <div className="flex items-center gap-4">

                  <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center">

                    <FaUtensils className="text-[#0a472e]" />

                  </div>

                  <div>

                    <p className="text-xs text-gray-500">
                      Quantity
                    </p>

                    <p className="font-semibold text-gray-800">
                      {food.quantity ||
                        "Not specified"}
                    </p>

                  </div>

                </div>


                {/* LOCATION */}

                <div className="flex items-start gap-4">

                  <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center">

                    <FaMapMarkerAlt className="text-[#0a472e]" />

                  </div>

                  <div>

                    <p className="text-xs text-gray-500">
                      Pickup Location
                    </p>

                    <p className="font-semibold text-gray-800">
                      {food.location ||
                        "Not specified"}
                    </p>

                  </div>

                </div>


                {/* AVAILABLE UNTIL */}

                <div className="flex items-start gap-4">

                  <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center">

                    <FaClock className="text-[#0a472e]" />

                  </div>

                  <div>

                    <p className="text-xs text-gray-500">
                      Available Until
                    </p>

                    <p className="font-semibold text-gray-800">
                      {formatDate(
                        food.available_until
                      )}
                    </p>

                  </div>

                </div>


                {/* SHARED BY */}

                <div className="flex items-start gap-4">

                  <div className="w-11 h-11 rounded-full bg-green-50 flex items-center justify-center">

                    <FaUser className="text-[#0a472e]" />

                  </div>

                  <div>

                    <p className="text-xs text-gray-500">
                      Shared By
                    </p>

                    <p className="font-semibold text-gray-800">
                      {food.owner_name ||
                        "Nouriva User"}
                    </p>

                  </div>

                </div>

              </div>


              {/* DIETARY TYPE */}

              {food.dietary_type && (

                <div className="mt-7">

                  <p className="text-xs text-gray-500 mb-2">
                    Dietary Type
                  </p>

                  <span className="inline-block px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-semibold">
                    {food.dietary_type}
                  </span>

                </div>

              )}


              {/* INFORMATION */}

              <div className="mt-8 p-4 bg-green-50 border border-green-100 rounded-xl">

                <p className="text-sm text-green-800">
                  🌱 This food has been shared
                  through Nouriva to help
                  reduce unnecessary food
                  waste.
                </p>

              </div>


              {/* BACK BUTTON */}

              <button
                onClick={() =>
                  navigate(
                    "/home/shared-food"
                  )
                }
                className="w-full mt-6 py-3 rounded-xl bg-[#0a472e] text-white font-semibold hover:bg-green-900 transition"
              >
                ← Back to Shared Food
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SharedFoodDetails;