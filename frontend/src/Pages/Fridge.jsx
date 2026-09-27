import React, { useEffect, useMemo, useState } from "react";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { BiSolidCommentError } from "react-icons/bi";
import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router";
import axios from "axios";
import FoodItemCard from "../Components/FoodItemCard";
import Loading from "./Loading";

const Fridge = () => {
  const [allFoodsItems, setAllFoodsItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const API =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // ---------------------------------------------------
  // FETCH ALL FOOD ITEMS
  // ---------------------------------------------------
  useEffect(() => {
    const fetchFoods = async () => {
      const token = localStorage.getItem("nouriva_token");

      if (!token) {
        setError("Please log in to view your food inventory.");
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

        console.log(
          "FRIDGE API RESPONSE:",
          JSON.stringify(response.data, null, 2)
        );

        setAllFoodsItems(
          Array.isArray(response.data) ? response.data : []
        );
      } catch (err) {
        console.error("Error fetching food items:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load your food inventory."
        );

        setAllFoodsItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  // ---------------------------------------------------
  // SEARCH + CATEGORY FILTER
  // ---------------------------------------------------
  const filteredFoods = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return allFoodsItems.filter((item) => {
      const title = (item.title || "").toLowerCase();
      const category = (item.foodCategory || "").toLowerCase();

      const matchesSearch =
        search === "" ||
        title.includes(search) ||
        category.includes(search);

      const matchesCategory =
        selectedCategory === "All" ||
        item.foodCategory === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allFoodsItems, searchText, selectedCategory]);

  // ---------------------------------------------------
  // RESET PAGE WHEN FILTER CHANGES
  // ---------------------------------------------------
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, selectedCategory]);

  // ---------------------------------------------------
  // PAGINATION
  // ---------------------------------------------------
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentFoods = filteredFoods.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(
    filteredFoods.length / itemsPerPage
  );

  // ---------------------------------------------------
  // LOADING
  // ---------------------------------------------------
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-roboto">
      <div className="w-11/12 mx-auto py-24">

        {/* ------------------------------------------------
            PAGE HEADER
        ------------------------------------------------ */}
        <div className="mb-8">
          <p className="text-green-700 font-semibold">
            NOURIVA FOOD INVENTORY
          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-[#0a472e] mt-2">
            Food Inventory
          </h1>

          <p className="text-gray-600 mt-3 max-w-2xl">
            View and manage all the food items you are currently
            tracking.
          </p>
        </div>

        {/* ------------------------------------------------
            FILTER / SEARCH BAR
        ------------------------------------------------ */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">

          <div className="text-gray-700 font-medium text-base">
            Showing {filteredFoods.length} result
            {filteredFoods.length !== 1 && "s"}
          </div>

          <div className="flex flex-wrap items-center gap-4">

            <BsFillGrid3X3GapFill
              size={30}
              className="text-gray-600 hidden md:inline-block"
            />

            {/* CATEGORY */}
            <select
              name="foodCategory"
              id="foodCategory"
              className="select select-bordered text-sm w-40"
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value)
              }
            >
              <option value="All">All Food Items</option>
              <option value="Grain">Grains</option>
              <option value="Dairy">Dairy</option>
              <option value="Meat">Meat</option>
              <option value="Fruit">Fruit</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Snacks">Snacks</option>
            </select>

            {/* SEARCH */}
            <label className="input input-bordered flex items-center gap-2 w-64">

              <svg
                className="h-4 w-4 opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <g
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                  />
                  <path d="m21 21-4.3-4.3" />
                </g>
              </svg>

              <input
                type="search"
                className="grow"
                placeholder="Search food"
                value={searchText}
                onChange={(e) =>
                  setSearchText(e.target.value)
                }
              />
            </label>

          </div>
        </div>

        {/* ------------------------------------------------
            ERROR
        ------------------------------------------------ */}
        {error && (
          <div className="mt-6 p-5 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        {/* ------------------------------------------------
            FOOD ITEMS
        ------------------------------------------------ */}
        <div className="pt-8">

          {filteredFoods.length === 0 ? (
            <div className="flex justify-center items-center min-h-[300px]">

              <div className="text-center bg-red-50 text-gray-600 p-6 py-12 rounded-lg shadow-md space-y-4 max-w-md">

                <BiSolidCommentError
                  className="mx-auto text-red-500"
                  size={35}
                />

                <h2 className="text-xl font-semibold">
                  No food items found
                </h2>

                <p>
                  {allFoodsItems.length === 0
                    ? "Your food inventory is empty."
                    : "No results match your selected category or search term."}
                </p>

              </div>
            </div>
          ) : (
            <>

              {/* FOOD CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {currentFoods.map((foodItem) => (
                  <FoodItemCard
                    key={foodItem._id || foodItem.id}
                    foodItem={foodItem}
                  />
                ))}

              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">

                  {Array.from(
                    { length: totalPages },
                    (_, index) => {
                      const pageNumber = index + 1;

                      return (
                        <button
                          key={pageNumber}
                          className={`px-4 py-2 border rounded ${
                            currentPage === pageNumber
                              ? "bg-[#0a472e] text-white"
                              : "bg-white text-gray-700"
                          }`}
                          onClick={() =>
                            setCurrentPage(pageNumber)
                          }
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                  )}

                </div>
              )}

            </>
          )}

        </div>

        {/* ------------------------------------------------
            GO TO HOME BUTTON
        ------------------------------------------------ */}
        <div className="flex justify-center mt-12 mb-6">
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

export default Fridge;