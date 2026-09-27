import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router";

import { toast } from "react-toastify";

import {
  FaShareAlt,
  FaMapMarkerAlt,
  FaClock,
  FaArrowLeft,
  FaUtensils,
  FaCheckCircle,
  FaInbox,
} from "react-icons/fa";


const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";


const SharedFood = () => {

  const navigate =
    useNavigate();

  const [foods, setFoods] =
    useState([]);

  const [loading, setLoading] =
    useState(true);


  // =====================================================
  // FETCH MY SHARED FOOD
  // =====================================================

  const fetchSharedFood =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "nouriva_token"
          );


        if (!token) {

          toast.error(
            "Please login first."
          );

          navigate(
            "/auth/login"
          );

          return;
        }


        const response =
          await fetch(
            `${API_URL}/surplus/mine`,
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


        setFoods(
          Array.isArray(data)
            ? data
            : []
        );


      } catch (error) {

        console.error(
          "Shared food error:",
          error
        );

        toast.error(
          error.message ||
            "Unable to load shared food."
        );

      } finally {

        setLoading(false);

      }

    };


  useEffect(() => {

    fetchSharedFood();

  }, []);


  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (
    date
  ) => {

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


  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle =
    (status) => {

      switch (
        String(
          status || ""
        ).toLowerCase()
      ) {

        case "available":
          return "bg-green-100 text-green-800";

        case "claimed":
          return "bg-yellow-100 text-yellow-800";

        case "completed":
          return "bg-blue-100 text-blue-800";

        case "cancelled":
          return "bg-red-100 text-red-800";

        default:
          return "bg-gray-100 text-gray-700";

      }

    };


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

                <FaShareAlt
                  size={25}
                />

              </div>


              <div>

                <h1 className="text-3xl font-bold">
                  My Shared Food
                </h1>

                <p className="text-green-100 mt-1">
                  Food items you have shared
                  with the Nouriva community.
                </p>

              </div>

            </div>


            <button
              onClick={() =>
                navigate(
                  "/home/share-food"
                )
              }
              className="px-5 py-3 bg-white text-[#0a472e] rounded-xl font-semibold hover:bg-green-50 transition"
            >
              + Share More Food
            </button>

          </div>

        </div>


        {/* LOADING */}

        {loading && (

          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-green-100">

            <div className="w-10 h-10 border-4 border-green-200 border-t-[#0a472e] rounded-full animate-spin mx-auto mb-4"></div>

            <p className="text-gray-600">
              Loading your shared food...
            </p>

          </div>

        )}


        {/* EMPTY */}

        {!loading &&
          foods.length === 0 && (

            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-green-100">

              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">

                <FaInbox
                  size={30}
                  className="text-[#0a472e]"
                />

              </div>


              <h2 className="text-2xl font-bold text-[#0a472e]">
                No shared food yet
              </h2>


              <p className="text-gray-600 mt-2 mb-6">
                When you share surplus food,
                it will appear here.
              </p>


              <button
                onClick={() =>
                  navigate(
                    "/home/share-food"
                  )
                }
                className="px-6 py-3 bg-[#0a472e] text-white rounded-xl font-semibold hover:bg-green-900 transition"
              >
                Share Food
              </button>

            </div>

          )}


        {/* FOOD LIST */}

        {!loading &&
          foods.length > 0 && (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {foods.map(
                (food) => (

                  <div
                    key={food.id}
                    className="bg-white rounded-2xl overflow-hidden border border-green-100 shadow-sm hover:shadow-xl transition"
                  >


                    {/* IMAGE */}

                    <div className="h-56 bg-gray-100">

                      {food.image_url ? (

                        <img
                          src={
                            food.image_url
                          }
                          alt={
                            food.title
                          }
                          className="w-full h-full object-cover"
                        />

                      ) : (

                        <div className="w-full h-full flex items-center justify-center">

                          <FaUtensils
                            size={50}
                            className="text-gray-300"
                          />

                        </div>

                      )}

                    </div>


                    {/* CONTENT */}

                    <div className="p-5">


                      {/* TITLE */}

                      <div className="flex justify-between items-start gap-3 mb-2">

                        <h2 className="text-xl font-bold text-[#0a472e]">
                          {food.title ||
                            "Unnamed Food"}
                        </h2>


                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap ${getStatusStyle(
                            food.status
                          )}`}
                        >
                          {food.status ||
                            "available"}
                        </span>

                      </div>


                      {/* CATEGORY */}

                      <p className="text-sm text-gray-500 mb-4">
                        {food.category ||
                          "Food"}
                      </p>


                      {/* QUANTITY */}

                      <div className="flex items-center gap-3 text-sm mb-3">

                        <FaUtensils className="text-[#a8b324]" />

                        <span>

                          <strong>
                            Quantity:
                          </strong>{" "}

                          {food.quantity ||
                            "Not specified"}

                        </span>

                      </div>


                      {/* LOCATION */}

                      <div className="flex items-start gap-3 text-sm mb-3">

                        <FaMapMarkerAlt className="text-[#a8b324] mt-1" />

                        <span>

                          <strong>
                            Pickup:
                          </strong>{" "}

                          {food.location ||
                            "Not specified"}

                        </span>

                      </div>


                      {/* AVAILABLE UNTIL */}

                      <div className="flex items-start gap-3 text-sm">

                        <FaClock className="text-[#a8b324] mt-1" />

                        <span>

                          <strong>
                            Available until:
                          </strong>{" "}

                          {formatDate(
                            food.available_until
                          )}

                        </span>

                      </div>


                      {/* DESCRIPTION */}

                      {food.description && (

                        <p className="text-sm text-gray-600 mt-4 pt-4 border-t border-gray-100 line-clamp-3">
                          {food.description}
                        </p>

                      )}


                      {/* DIETARY TYPE */}

                      {food.dietary_type && (

                        <div className="mt-4">

                          <span className="inline-block px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
                            {food.dietary_type}
                          </span>

                        </div>

                      )}


                      {/* DETAILS */}

                      <button
                        onClick={() =>
                          navigate(
                            `/home/shared-food/${food.id}`
                          )
                        }
                        className="w-full mt-5 py-3 bg-[#0a472e] text-white rounded-xl font-semibold hover:bg-green-900 transition"
                      >
                        View Shared Food
                      </button>


                      {/* SUCCESS */}

                      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-green-700 text-sm font-semibold">

                        <FaCheckCircle />

                        Successfully shared

                      </div>

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


export default SharedFood;