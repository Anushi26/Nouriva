import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUtensils, FaBoxes, FaLeaf } from "react-icons/fa";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const InventoryFoodItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const token =
          localStorage.getItem("nouriva_token");

        const response = await axios.get(
          `${API_URL}/added-food`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        setItems(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (error) {
        console.error(
          "Error fetching inventory:",
          error
        );

        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  // Total inventory items
  const totalItems = items.length;

  // Total quantity
  const totalQuantity = items.reduce(
    (total, item) => {
      const quantity =
        Number(item.quantity) || 0;

      return total + quantity;
    },
    0
  );

  // Categories
  const categories = new Set(
    items.map(
      (item) => item.foodCategory
    )
  ).size;

  if (loading) {
    return (
      <div className="w-11/12 mx-auto py-10">

        <div className="animate-pulse">

          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="h-32 bg-gray-200 rounded-2xl"></div>
            <div className="h-32 bg-gray-200 rounded-2xl"></div>
            <div className="h-32 bg-gray-200 rounded-2xl"></div>

          </div>

        </div>

      </div>
    );
  }

  return (
    <section className="w-11/12 mx-auto py-10">

      {/* HEADER */}

      <div className="text-center mb-8">

        <p className="text-green-700 font-semibold tracking-widest text-sm">
          NOURIVA INVENTORY
        </p>

        <h2 className="text-3xl md:text-4xl font-bold text-[#0a472e] mt-2">
          Inventory Food Items Tracked
        </h2>

        <p className="text-gray-600 mt-2">
          Keep track of the food stored in your
          inventory and reduce unnecessary waste.
        </p>

      </div>

      {/* STAT CARDS */}

      <div className="grid md:grid-cols-3 gap-6">

        {/* TOTAL ITEMS */}

        <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-2xl p-6 shadow-sm border border-green-100">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-600 font-medium">
                Food Items
              </p>

              <h3 className="text-4xl font-bold text-[#0a472e] mt-2">
                {totalItems}
              </h3>

              <p className="text-sm text-green-700 mt-2">
                Items tracked
              </p>

            </div>

            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
              <FaUtensils
                className="text-[#0a472e]"
                size={24}
              />
            </div>

          </div>

        </div>

        {/* TOTAL QUANTITY */}

        <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 rounded-2xl p-6 shadow-sm border border-yellow-100">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-600 font-medium">
                Total Quantity
              </p>

              <h3 className="text-4xl font-bold text-[#0a472e] mt-2">
                {totalQuantity}
              </h3>

              <p className="text-sm text-yellow-700 mt-2">
                Units in inventory
              </p>

            </div>

            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
              <FaBoxes
                className="text-[#0a472e]"
                size={24}
              />
            </div>

          </div>

        </div>

        {/* CATEGORIES */}

        <div className="bg-gradient-to-br from-lime-100 to-lime-50 rounded-2xl p-6 shadow-sm border border-lime-100">

          <div className="flex items-center justify-between">

            <div>

              <p className="text-gray-600 font-medium">
                Categories
              </p>

              <h3 className="text-4xl font-bold text-[#0a472e] mt-2">
                {categories}
              </h3>

              <p className="text-sm text-lime-700 mt-2">
                Food categories tracked
              </p>

            </div>

            <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
              <FaLeaf
                className="text-[#0a472e]"
                size={24}
              />
            </div>

          </div>

        </div>

      </div>

      {/* EMPTY INVENTORY */}

      {totalItems === 0 && (

        <div className="mt-8 text-center p-8 bg-gray-50 rounded-2xl border border-gray-200">

          <FaUtensils
            className="mx-auto text-gray-300"
            size={45}
          />

          <h3 className="text-xl font-semibold text-gray-700 mt-4">
            No food items tracked yet
          </h3>

          <p className="text-gray-500 mt-2">
            Add food to your Nouriva inventory
            to start tracking it.
          </p>

        </div>

      )}

    </section>
  );
};

export default InventoryFoodItems;