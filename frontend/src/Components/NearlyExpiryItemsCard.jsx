import React from "react";
import {
  FaClock,
  FaUtensils,
  FaEye,
  FaShareAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router";

const NearlyExpiryItemCard = ({ food }) => {
  const navigate = useNavigate();

  const getDaysLeft = () => {
    const today = new Date();
    const expiry = new Date(food.expiryDate);

    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    return Math.ceil(
      (expiry - today) /
        (1000 * 60 * 60 * 24)
    );
  };

  const daysLeft = getDaysLeft();

  const expiryText =
    daysLeft === 0
      ? "Expires Today"
      : daysLeft === 1
      ? "Expires Tomorrow"
      : `${daysLeft} Days Left`;

  const expiryColor =
    daysLeft === 0
      ? "bg-red-100 text-red-700"
      : daysLeft === 1
      ? "bg-orange-100 text-orange-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-green-100 shadow-sm hover:shadow-lg transition">

      {/* IMAGE */}
      <div className="relative h-52 bg-green-50">

        {food.foodImageUrl ? (
          <img
            src={food.foodImageUrl}
            alt={food.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaUtensils
              size={45}
              className="text-green-200"
            />
          </div>
        )}

        {/* EXPIRY BADGE */}
        <span
          className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold ${expiryColor}`}
        >
          {expiryText}
        </span>
      </div>

      {/* CONTENT */}
      <div className="p-5">

        <h2 className="text-xl font-bold text-[#0a472e]">
          {food.title}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          {food.foodCategory || "Food"}
        </p>

        {/* DETAILS */}
        <div className="mt-5 space-y-3">

          <div className="flex items-center gap-3 text-sm">
            <FaUtensils className="text-[#a8b324]" />

            <span>
              <strong>Quantity:</strong>{" "}
              {food.quantity || "Not specified"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <FaClock className="text-[#a8b324]" />

            <span>
              <strong>Expiry:</strong>{" "}
              {new Date(
                food.expiryDate
              ).toLocaleDateString("en-IN")}
            </span>
          </div>

        </div>

        {/* DIETARY TYPE */}
        {food.dietaryType && (
          <div className="mt-4">
            <span className="inline-block px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-semibold">
              {food.dietaryType}
            </span>
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex gap-3 mt-5">

          <button
            onClick={() =>
              navigate(`/food-details/${food.id}`)
            }
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0a472e] text-white font-semibold hover:bg-green-900 transition"
          >
            <FaEye />
            View
          </button>

          <button
            onClick={() =>
              navigate("/share-food", {
                state: { food },
              })
            }
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#0a472e] text-[#0a472e] font-semibold hover:bg-green-50 transition"
          >
            <FaShareAlt />
            Share
          </button>

        </div>

      </div>
    </div>
  );
};

export default NearlyExpiryItemCard;