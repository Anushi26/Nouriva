import React, { useEffect, useState } from "react";
import axios from "axios";
import Loading from "../Pages/Loading";
import { MdOutlineAssignmentTurnedIn } from "react-icons/md";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

import ExpiredFoodItemCard from "./ExpiredFoodItemCard";

const ExpiredFoodItems = () => {
  const [expiredFoods, setExpiredFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  useEffect(() => {
    const token = localStorage.getItem("nouriva_token");

    if (!token) {
      setExpiredFoods([]);
      setLoading(false);
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/expired-food-items`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setExpiredFoods(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching expired foods:", error);
        setExpiredFoods([]);
        setLoading(false);
      });
  }, []);

  if (loading) return <Loading />;
  const totalPages = Math.ceil(expiredFoods.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFoods = expiredFoods.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <div className="w-11/12 mx-auto pb-24">
      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-bold pb-2 text-center">
          Expired Food Items
        </h1>
        <p className="md:w-3/5 mx-auto pt-6 text-gray-700 pb-6 text-center">
          Below are food items that have passed their expiry dates. Review and
          remove them to maintain a clean and up-to-date inventory, and ensure
          food safety.
        </p>
      </div>

      {expiredFoods.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-green-100 rounded-lg shadow-sm md:w-1/2 md:mx-auto">
          <MdOutlineAssignmentTurnedIn className="text-5xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            No Expired Food Items
          </h2>
          <p className="text-sm text-gray-500">
            Great job! You have no expired food items at the moment.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {paginatedFoods.map((food) => (
              <ExpiredFoodItemCard key={food._id} food={food} />
            ))}
          </div>

          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-full border ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-200"
              }`}
            >
              <FaArrowLeft />
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`w-10 h-10 rounded-full flex items-center justify-center border font-semibold transition-colors duration-300
                  ${
                    currentPage === index + 1
                      ? "bg-green-900 text-white"
                      : "bg-white hover:bg-green-200"
                  }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full border ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-200"
              }`}
            >
              <FaArrowRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ExpiredFoodItems;
