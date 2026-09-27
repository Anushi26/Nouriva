import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { RiShoppingBasket2Fill } from "react-icons/ri";
import { MdWarningAmber } from "react-icons/md";
import expireIcon from "/expireDate.png";

const ExpiredFoodItemCard = ({ food }) => {
  const { foodImageUrl, title, foodCategory, quantity, expiryDate } = food;

  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: false });

  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
      });
    } else {
      controls.start({ opacity: 0, y: 50 });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      className="group bg-base-200 px-6 space-y-4 rounded hover:shadow-2xl font-lexend relative overflow-hidden"
    >
      <motion.img
        className="w-72 h-60 py-8 mx-auto"
        src={foodImageUrl}
        alt={title}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      <h1 className="text-xl font-semibold">{title}</h1>

      <div className="flex justify-between">
        <p className="text-base font-semibold text-gray-600">
          Category: {foodCategory}
        </p>
        <div className="flex items-center gap-6">
          <div className="bg-[#4e852646] rounded-full px-1 py-1">
            <RiShoppingBasket2Fill size={25} />
          </div>
          <p className="bg-[#4e852646] rounded-full px-2 text-lg">{quantity}</p>
        </div>
      </div>

      <div className="flex justify-between items-center pb-6">
        <div className="flex gap-2 items-center">
          <img className="w-6 h-6" src={expireIcon} alt="expire_icon" />
          {expiryDate
            ? new Date(expiryDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Date not available"}
        </div>
        <div className="flex items-center gap-1 bg-red-200 text-red-800 px-4 py-1 text-xs rounded-full font-semibold shadow-sm">
          <MdWarningAmber size={16} />
          <span>Expired</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpiredFoodItemCard;
