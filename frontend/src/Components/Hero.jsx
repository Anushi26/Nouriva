import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "motion/react";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router";

const slides = [
  {
    id: 1,
    image: "/banner1.jpeg",
    title: "Built for a Greener Tomorrow",
    text: "Join the mission to reduce food waste and promote sustainable living.",
    align: "right",
  },
  {
    id: 2,
    image: "/banner2.jpeg",
    title: "Make Every Bite Count",
    text: "Start small. Use Nouriva to build better habits and reduce food waste, one item at a time.",
    align: "left",
  },
  {
    id: 3,
    image: "/banner1.jpeg",
    title: "Track Expiry Dates with Ease",
    text: "Stay on top of your food inventory and receive timely alerts before anything goes to waste.",
    align: "right",
  },
  {
    id: 4,
    image: "/banner2.jpeg",
    title: "Never Forget What’s in Your Fridge",
    text: "Keep track of your food items so you always know what you have—and what’s about to expire.",
    align: "left",
  },
];

const Hero = () => {
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div
      className="w-full"
      onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
      onMouseLeave={() => swiperRef.current?.autoplay?.start()}
    >
      <Swiper
        modules={[Autoplay]}
        spaceBetween={4}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        slidesPerView={1}
        speed={1000}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="w-full relative overflow-hidden">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-[200px] lg:h-[70vh] object-cover"
              />
              <div
                className={`absolute inset-0 z-20 flex items-center px-4 md:px-16 ${
                  slide.align === "left"
                    ? "justify-start text-left"
                    : "justify-end text-right"
                }`}
              >
                {activeIndex === index && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
                    className="space-y-1 md:space-y-4 max-w-[60%] lg:max-w-[41%]"
                  >
                    <h1 className="text-3xl lg:text-6xl text-[#0a472e] font-vibe md:text-5xl font-bold">
                      {slide.title}
                    </h1>
                    <div className="flex flex-col space-y-3">
                      <p className="text-lg text-center hidden lg:inline-block text-gray-700 font-roboto md:text-xl drop-shadow">
                        {slide.text}
                      </p>
                      <Link
                        to="/auth/register"
                        className="bg-[#0a472e] hidden lg:inline-block px-6 py-2 w-1/4 mx-auto text-center font-roboto rounded-full text-white hover:bg-white hover:text-[#0a472e] transition"
                      >
                        Get Started
                      </Link>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;
