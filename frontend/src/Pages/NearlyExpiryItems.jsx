import { useEffect, useState } from "react";
import axios from "axios";
import NearlyExpiryItemCards from "../Components/NearlyExpiryItemCards";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export default function NearlyExpiryItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNearlyExpiryItems = async () => {
    const token = localStorage.getItem("nouriva_token");

    if (!token) {
      setError("Please login to view nearly expiring food.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API}/nearly-expired-foods`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setItems(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (err) {
      console.error(
        "Nearly expiry error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load nearly expiring food."
      );

      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNearlyExpiryItems();
  }, []);

  return (
    <div className="w-11/12 mx-auto py-12">

      {/* HEADER */}

      <div className="text-center mb-10">

        <p className="text-green-700 font-semibold uppercase tracking-wide">
          Food Inventory
        </p>

        <h1 className="text-4xl md:text-5xl font-bold text-[#0a472e] mt-2">
          Nearly Expiring Items
        </h1>

        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          These food items are approaching their expiry
          date. Use them soon to reduce food waste.
        </p>

      </div>

      {/* LOADING */}

      {loading && (
        <div className="text-center py-16">

          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0a472e] mx-auto"></div>

          <p className="mt-4 text-gray-500">
            Loading nearly expiring food...
          </p>

        </div>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div className="max-w-xl mx-auto text-center bg-red-50 border border-red-200 rounded-2xl p-6">

          <p className="text-red-700 font-semibold">
            {error}
          </p>

          <button
            onClick={loadNearlyExpiryItems}
            className="mt-4 px-5 py-2 bg-[#0a472e] text-white rounded-full hover:bg-green-900 transition"
          >
            Try Again
          </button>

        </div>
      )}

      {/* EMPTY */}

      {!loading &&
        !error &&
        items.length === 0 && (
          <div className="text-center py-20">

            <div className="text-6xl mb-5">
              🥳
            </div>

            <h2 className="text-2xl font-bold text-[#0a472e]">
              No nearly expiring items
            </h2>

            <p className="text-gray-500 mt-2">
              Great! You don't have any food
              expiring within the next 3 days.
            </p>

          </div>
        )}

      {/* CARDS */}

      {!loading &&
        !error &&
        items.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {items.map((item) => (
              <NearlyExpiryItemCards
                key={item.id || item._id}
                item={item}
              />
            ))}

          </div>
        )}

    </div>
  );
}