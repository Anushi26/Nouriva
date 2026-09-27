import { useEffect, useState } from "react";
import axios from "axios";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

import expiredIcon from "/expired_Icon.png";
import nearlyExpiredIcon from "/nearly_Expired.png";

const CountUpFood = () => {
  const [expiredCount, setExpiredCount] = useState(0);
  const [nearlyExpiredCount, setNearlyExpiredCount] =
    useState(0);

  const [ref1, inView1] = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });

  const [ref2, inView2] = useInView({
    triggerOnce: false,
    threshold: 0.3,
  });

  useEffect(() => {
    const fetchFoodCounts = async () => {
      const token =
        localStorage.getItem("nouriva_token");

      if (!token) return;

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // ==========================================
      // EXPIRED FOOD
      // ==========================================

      try {
        const expiredResponse =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/expired-food-items`,
            { headers }
          );

        setExpiredCount(
          Array.isArray(
            expiredResponse.data
          )
            ? expiredResponse.data.length
            : 0
        );
      } catch (error) {
        console.error(
          "Error fetching expired food:",
          error
        );

        setExpiredCount(0);
      }

      // ==========================================
      // NEARLY EXPIRED FOOD
      // ==========================================

      try {
        const nearlyExpiredResponse =
          await axios.get(
            `${import.meta.env.VITE_API_URL}/nearly-expired-foods`,
            { headers }
          );

        setNearlyExpiredCount(
          Array.isArray(
            nearlyExpiredResponse.data
          )
            ? nearlyExpiredResponse.data.length
            : 0
        );
      } catch (error) {
        console.error(
          "Error fetching nearly expired food:",
          error
        );

        setNearlyExpiredCount(0);
      }
    };

    fetchFoodCounts();
  }, []);

  return (
    <div className="w-11/12 mx-auto pb-24 font-roboto">

      {/* ==========================================
          HEADING
      ========================================== */}

      <h2 className="text-3xl md:text-5xl font-bold pb-2 text-center">
        Food Expiry Overview
      </h2>

      <p className="md:w-3/5 mx-auto pt-6 text-gray-700 pb-6 text-center">
        Keep track of your food inventory with
        real-time insights into items nearing
        expiry and those already expired. This
        helps minimize waste, improve efficiency,
        and ensure timely consumption or disposal.
      </p>

      {/* ==========================================
          CARDS
      ========================================== */}

      <div className="grid md:grid-cols-2 gap-6">

        {/* ========================================
            NEARLY EXPIRED
        ======================================== */}

        <div
          ref={ref2}
          className="p-8 bg-gradient-to-tr from-green-200 via-green-50 to-green-100 hover:shadow-xl rounded-2xl space-y-6 text-center"
        >

          <img
            className="mx-auto w-20 h-20 object-contain"
            src={nearlyExpiredIcon}
            alt="Nearly Expiring"
          />

          {inView2 && (
            <span className="text-5xl font-extrabold">
              <CountUp
                start={0}
                end={nearlyExpiredCount}
                duration={2}
              />
            </span>
          )}

          <p className="pt-4 text-green-700">
            Nearly Expiring Items
          </p>

        </div>

        {/* ========================================
            EXPIRED
        ======================================== */}

        <div
          ref={ref1}
          className="p-8 bg-gradient-to-tr from-red-200 via-red-50 to-red-100 hover:shadow-xl rounded-2xl space-y-6 text-center"
        >

          <img
            className="mx-auto w-20 h-20 object-contain"
            src={expiredIcon}
            alt="Expired Items"
          />

          {inView1 && (
            <span className="text-5xl font-extrabold">
              <CountUp
                start={0}
                end={expiredCount}
                duration={2}
              />
            </span>
          )}

          <p className="pt-4 text-red-700">
            Expired Items
          </p>

        </div>

      </div>

    </div>
  );
};

export default CountUpFood;