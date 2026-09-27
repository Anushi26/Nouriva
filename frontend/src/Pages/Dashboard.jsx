import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router";
import {
  FaBoxOpen,
  FaShareAlt,
  FaBell,
  FaLeaf,
  FaUtensils,
} from "react-icons/fa";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Dashboard = () => {
 const [data, setData] = useState(null);
const [foodItems, setFoodItems] = useState([]);
const [notifications, setNotifications] = useState([]);
const [recipes, setRecipes] = useState([]);
  const token = localStorage.getItem("nouriva_token");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
   Promise.all([
  axios.get(`${API}/dashboard`, { headers }),
  axios.get(`${API}/allFoodsItems`, { headers }),
  axios.get(`${API}/notifications`, { headers }),
  axios.get(`${API}/recipes`, { headers }),
])
  .then(
    ([
      dashboardResponse,
      foodResponse,
      notificationsResponse,
      recipesResponse,
    ]) => {
      setData(dashboardResponse.data);

      setFoodItems(
        Array.isArray(foodResponse.data)
          ? foodResponse.data
          : []
      );

        setRecipes(
          Array.isArray(recipesResponse.data)
            ? recipesResponse.data.slice(0, 3)
            : []
        );
      })
      .catch((error) => {
        console.error("Dashboard error:", error);
      });
  }, []);

  const cards = [
    [
      "Food Inventory",
      data?.inventory?.total || 0,
      "Items tracked",
      FaBoxOpen,
      "/home/fridge",
    ],
    [
      "Near Expiry",
      data?.inventory?.near_expiry || 0,
      "Need attention",
      FaBell,
"/home/near-expiry",],
    [
      "Food Shared",
      data?.shared || 0,
      "Surplus listings",
      FaShareAlt,
      "/home/share-food",
    ],
    [
      "Nouriva Points",
      data?.points || 0,
      "Impact points",
      FaLeaf,
      "/home/impact",
    ],
  ];

  return (
    <div className="w-11/12 mx-auto py-12 space-y-10">

      {/* Dashboard Header */}
      <div>
        <p className="text-green-700 font-semibold">
          YOUR NOURIVA DASHBOARD
        </p>

        <h1 className="text-4xl md:text-5xl font-bold text-[#0a472e] mt-2">
          Make every meal count.
        </h1>

        <p className="text-gray-600 mt-3 max-w-2xl">
          Track your food, prevent expiry, share surplus and see the
          difference you make.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(([title, value, subtitle, Icon, to]) => (
          <Link
            to={to}
            key={title}
            className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 hover:-translate-y-1 transition"
          >
            <Icon className="text-2xl text-green-700" />

            <div className="text-4xl font-bold text-[#0a472e] mt-4">
              {value}
            </div>

            <div className="font-semibold">
              {title}
            </div>

            <p className="text-sm text-gray-500">
              {subtitle}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Actions + Notifications */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-green-100">

          <h2 className="text-2xl font-bold text-[#0a472e]">
            Quick actions
          </h2>

          <div className="grid sm:grid-cols-3 gap-4 mt-5">

            {/* Track Food */}
            <Link
              to="/home/track-food"
              className="p-5 rounded-xl bg-green-50 hover:bg-green-100 transition"
            >
              <FaBoxOpen className="text-green-700 text-2xl" />

              <b className="block mt-3">
                Track food
              </b>

              <span className="text-sm text-gray-600">
                Monitor food and expiry dates.
              </span>
            </Link>

            {/* Share Surplus */}
            <Link
              to="/home/share-food"
              className="p-5 rounded-xl bg-lime-50 hover:bg-lime-100 transition"
            >
              <FaShareAlt className="text-green-700 text-2xl" />

              <b className="block mt-3">
                Share surplus
              </b>

              <span className="text-sm text-gray-600">
                Help someone nearby.
              </span>
            </Link>

            {/* Find Recipes */}
            <Link
              to="/home/recipes"
              className="p-5 rounded-xl bg-amber-50 hover:bg-amber-100 transition"
            >
              <FaUtensils className="text-amber-700 text-2xl" />

              <b className="block mt-3">
                Find recipes
              </b>

              <span className="text-sm text-gray-600">
                Use ingredients before they expire.
              </span>
            </Link>

          </div>
        </div>

        {/* Notifications */}
        <div className="bg-[#0a472e] text-white rounded-2xl p-6">

          <h2 className="text-xl font-bold">
            Recent notifications
          </h2>

          {notifications.length === 0 ? (
            <p className="text-green-100 mt-4">
              You're all caught up.
            </p>
          ) : (
            notifications.slice(0, 4).map((notification) => (
              <div
                key={notification.id || notification._id}
                className="mt-4 border-b border-green-700 pb-3"
              >
                <b>{notification.title}</b>

                <p className="text-sm text-green-100">
                  {notification.message}
                </p>
              </div>
            ))
          )}

        </div>
      </div>

      {/* Recipe Ideas */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-100">

        <div className="flex justify-between items-center">

          <h2 className="text-2xl font-bold text-[#0a472e]">
            Recipe ideas
          </h2>

          <Link
            to="/home/recipes"
            className="text-green-700 font-semibold"
          >
            See all →
          </Link>

        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-5">

          {recipes.length === 0 ? (
            <p className="text-gray-500">
              No recipe ideas available.
            </p>
          ) : (
            recipes.map((recipe) => (
              <div
                key={recipe.name}
                className="rounded-xl bg-gray-50 p-5"
              >
                <FaUtensils className="text-green-700" />

                <h3 className="font-bold mt-3">
                  {recipe.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {recipe.category} · {recipe.time}
                </p>
              </div>
            ))
          )}

        </div>
      </div>

    </div>
  );
};

export default Dashboard;