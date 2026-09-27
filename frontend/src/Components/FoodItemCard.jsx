import React, { useState } from "react";
import { motion } from "motion/react";
import { RiShoppingBasket2Fill } from "react-icons/ri";
import { MdWarningAmber } from "react-icons/md";
import { Link } from "react-router";

const FoodItemCard = ({ foodItem }) => {
  const { foodImageUrl, title, foodCategory, quantity, expiryDate } = foodItem;
  const isExpired = new Date(expiryDate) < new Date();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="group bg-base-200 px-6 space-y-4 rounded hover:shadow-2xl font-lexend relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isExpired && (
        <div className="absolute top-1 right-2 flex items-center gap-1 bg-red-200 text-red-800 px-2 py-1 text-xs rounded-full font-semibold shadow-sm">
          <MdWarningAmber size={16} />
          <span>Expired</span>
        </div>
      )}
      <motion.img
        className="w-72 h-60 py-8 mx-auto"
        src={foodImageUrl}
        alt={title}
        animate={
          hovered
            ? {
                y: [0, -6, 0],
                transition: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
            : { y: 0 }
        }
      />

      <h1 className="text-xl font-semibold">{title}</h1>
      <p className="text-base font-semibold text-gray-600">
        Food Category: {foodCategory}
      </p>

      <div className="flex justify-between items-center pb-6">
        <Link to={`/home/foodDetails/${foodItem._id}`}>
          <button className="bg-[#4e852646] border border-green-900 text-green-950 hover:bg-[#4d8526] hover:text-white px-4 py-2 rounded-full">
            See Details
          </button>
        </Link>
        <div className="flex items-center gap-6">
          <div className="bg-[#4e852646] rounded-full px-1 py-1">
            <RiShoppingBasket2Fill size={25} />
          </div>
          <p className="bg-[#4e852646] rounded-full px-2 text-lg">{quantity}</p>
        </div>
      </div>
    </div>
  );
};

export default FoodItemCard;
