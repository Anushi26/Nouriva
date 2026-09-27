import React from "react";
import aboutBg from "/aboutbg.jpeg";
import { FcAlarmClock } from "react-icons/fc";
import { FaBoxOpen } from "react-icons/fa";
const AboutUs = () => {
  return (
    <div className="w-11/12 mx-auto pb-24 grid grid-cols-1 lg:grid-cols-2 font-roboto">
      <div>
        <img src={aboutBg} alt="Fresh_Organic_Banner" />
      </div>
      <div className="space-y-4">
        <h1 className="font-vibe text-3xl text-green-900 font-semibold">
          ~ About Us ~
        </h1>
        <h2 className="text-2xl md:text-5xl font-extrabold">
          Helping You Waste Less, Live More
        </h2>
        <p className="text-lg md:text-xl text-gray-800 font-medium">
          Food Expiry Tracker helps reduce waste by tracking expiry dates,
          sending alerts, and encouraging smarter food consumption habits.
        </p>
        <p className="text-gray-500 text-sm md:text-lg">
          We believe in mindful eating and responsible consumption. Our system
          helps users keep their kitchens organized and food safe, without the
          guesswork. No more forgotten leftovers or expired groceries—just a
          smarter way to store, plan, and eat.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3 bg-base-200 px-3 rounded-lg">
            <FcAlarmClock className="my-auto" size={50} />
            <div className="space-y-1 ">
              <h1 className="font-semibold text-lg">Why Track Expiry Dates?</h1>
              <p className="text-gray-500">
                Track expiry dates, reduce food waste, save money and
                environment
              </p>
            </div>
          </div>

          <div className="flex gap-3 bg-base-200 px-3 rounded-lg">
            <FaBoxOpen className="my-auto text-green-600" size={50} />
            <div>
              <h1 className="font-semibold text-lg">Smart Food Management</h1>
              <p className="text-gray-500">
                Log food items, monitor expiry, and plan meals smarter.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
