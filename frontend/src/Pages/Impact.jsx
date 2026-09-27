import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaLeaf,
  FaMedal,
  FaShareAlt,
  FaBoxOpen,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { Link } from "react-router";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Impact = () => {
  const [data, setData] = useState(null);
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchImpactData = async () => {
      const token = localStorage.getItem("nouriva_token");

      if (!token) {
        setError("Please log in to view your Nouriva impact.");
        setLoading(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      try {
        setLoading(true);
        setError("");

        const [dashboardResponse, leaderboardResponse] =
          await Promise.all([
            axios.get(`${API}/dashboard`, { headers }),
            axios.get(`${API}/leaderboard`, { headers }),
          ]);

        setData(dashboardResponse.data);

        setLeaders(
          Array.isArray(leaderboardResponse.data)
            ? leaderboardResponse.data
            : []
        );
      } catch (err) {
        console.error("Error loading impact data:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load your impact information."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchImpactData();
  }, []);

  const earningActions = [
    {
      title: "Add food",
      points: 5,
      icon: FaBoxOpen,
      description: "Track food items in your inventory.",
    },
    {
      title: "Share surplus",
      points: 20,
      icon: FaShareAlt,
      description: "Share extra food with someone nearby.",
    },
    {
      title: "Complete pickup",
      points: 15,
      icon: FaCheckCircle,
      description: "Complete a successful food pickup.",
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-roboto">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-[#0a472e] rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-600">
            Loading your impact...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4 font-roboto">
      <div className="w-11/12 max-w-7xl mx-auto">

        {/* Back to Home */}
        <Link
          to="/home"
          className="inline-flex items-center gap-2 text-[#0a472e] font-semibold mb-6 hover:underline"
        >
          <FaArrowLeft />
          Back to Home
        </Link>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-5 text-red-700">
            {error}
          </div>
        )}

        {/* Main Impact Header */}
        <div className="bg-[#0a472e] text-white rounded-3xl p-8 md:p-12">

          <p className="text-lime-300 font-semibold tracking-wide">
            YOUR IMPACT
          </p>

          <h1 className="text-4xl md:text-6xl font-bold mt-2">
            Small actions. Real change.
          </h1>

          <p className="text-green-100 mt-4 max-w-2xl text-lg">
            Every food item you track, every surplus you share, and
            every successful pickup helps reduce food waste.
          </p>

          {/* Main Stats */}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-10">

            {/* Points */}
            <div className="bg-white/10 rounded-2xl p-6">
              <FaLeaf className="text-3xl text-lime-300" />

              <b className="block text-4xl mt-4">
                {data?.points || 0}
              </b>

              <span className="text-green-100">
                Impact points
              </span>
            </div>

            {/* Shared */}
            <div className="bg-white/10 rounded-2xl p-6">
              <FaShareAlt className="text-3xl text-lime-300" />

              <b className="block text-4xl mt-4">
                {data?.shared || 0}
              </b>

              <span className="text-green-100">
                Surplus listings
              </span>
            </div>

            {/* Pickups */}
            <div className="bg-white/10 rounded-2xl p-6">
              <FaCheckCircle className="text-3xl text-lime-300" />

              <b className="block text-4xl mt-4">
                {data?.acceptedRequests || 0}
              </b>

              <span className="text-green-100">
                Food pickups
              </span>
            </div>

          </div>
        </div>

        {/* How You Earn + Leaderboard */}
        <div className="grid lg:grid-cols-2 gap-7 mt-8">

          {/* How You Earn */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">

            <h2 className="text-2xl font-bold text-[#0a472e] mb-2">
              How you earn
            </h2>

            <p className="text-gray-500 mb-4">
              Take useful actions on Nouriva and build your impact
              points.
            </p>

            <div>
              {earningActions.map(
                ({
                  title,
                  points,
                  icon: Icon,
                  description,
                }) => (
                  <div
                    key={title}
                    className="flex items-center justify-between gap-4 border-b last:border-b-0 py-5"
                  >
                    <div className="flex items-center gap-4">

                      <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">
                        <Icon className="text-green-700 text-lg" />
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          {description}
                        </p>
                      </div>

                    </div>

                    <span className="font-bold text-green-700 whitespace-nowrap">
                      +{points} pts
                    </span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">

            <h2 className="text-2xl font-bold text-[#0a472e]">
              <FaMedal className="inline mr-2 text-yellow-500" />
              Leaderboard
            </h2>

            <p className="text-gray-500 mt-2 mb-4">
              See how your impact compares with other Nouriva users.
            </p>

            {leaders.length === 0 ? (
              <div className="py-10 text-center text-gray-500">
                No leaderboard data available yet.
              </div>
            ) : (
              <div>
                {leaders.map((leader, index) => {
                  const position = index + 1;

                  return (
                    <div
                      key={leader.id || leader._id || index}
                      className="flex items-center justify-between py-4 border-b last:border-b-0"
                    >
                      <div className="flex items-center gap-4">

                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            position === 1
                              ? "bg-yellow-100 text-yellow-700"
                              : position === 2
                              ? "bg-gray-100 text-gray-700"
                              : position === 3
                              ? "bg-orange-100 text-orange-700"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          {position}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800">
                            {leader.name || "Nouriva User"}
                          </p>

                          {leader.email && (
                            <p className="text-sm text-gray-500">
                              {leader.email}
                            </p>
                          )}
                        </div>

                      </div>

                      <span className="font-bold text-[#0a472e]">
                        {leader.points || 0} pts
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Impact Message */}
        <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm border border-green-100 text-center">

          <FaLeaf className="mx-auto text-4xl text-green-600" />

          <h2 className="text-2xl font-bold text-[#0a472e] mt-4">
            Keep making a difference
          </h2>

          <p className="text-gray-600 max-w-2xl mx-auto mt-2">
            Track your food, share what you do not need, and help
            prevent good food from becoming waste.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">

            <Link
              to="/home/track-food"
              className="px-6 py-3 rounded-lg bg-[#0a472e] text-white hover:bg-[#083c26] transition"
            >
              Track Your Food
            </Link>

            <Link
              to="/home/share-food"
              className="px-6 py-3 rounded-lg border border-[#0a472e] text-[#0a472e] hover:bg-green-50 transition"
            >
              Share Surplus
            </Link>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Impact;