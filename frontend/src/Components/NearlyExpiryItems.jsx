import { useEffect, useState } from "react";
import axios from "axios";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export default function NearlyExpiryItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadItems = async () => {
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
    } catch (error) {
      console.error(
        "Nearly expiry error:",
        error
      );

      setItems([]);

      setError(
        error.response?.data?.message ||
          "Unable to load nearly expiring food."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  return (
    <div className="w-11/12 mx-auto py-10">

      {/* HEADER */}

      <div className="text-center mb-8">

        <p className="text-green-700 font-semibold">
          FOOD INVENTORY
        </p>

        <h1 className="text-4xl md:text-5xl font-bold text-[#0a472e] mt-2">
          Nearly Expiring Items
        </h1>

        <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
          These food items are approaching their
          expiry date. Use them soon to reduce
          food waste.
        </p>

      </div>

      {/* LOADING */}

      {loading && (
        <div className="text-center py-16">

          <div className="w-10 h-10 border-4 border-green-200 border-t-[#0a472e] rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-gray-500">
            Loading nearly expiring items...
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
            onClick={loadItems}
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
          <div className="text-center py-16">

            <div className="text-6xl mb-4">
              🥳
            </div>

            <h2 className="text-2xl font-bold text-[#0a472e]">
              No Nearly Expiring Items
            </h2>

            <p className="text-gray-500 mt-2">
              Great! You don't have any food
              expiring within the next 3 days.
            </p>

          </div>
        )}

      {/* FOOD CARDS */}

      {!loading &&
        !error &&
        items.length > 0 && (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {items.map((item) => (
              <NearlyExpiryItemCard
                key={item.id || item._id}
                item={item}
              />
            ))}

          </div>

        )}

    </div>
  );
}


/* =========================================================
   NEARLY EXPIRING FOOD CARD
========================================================= */

function NearlyExpiryItemCard({ item }) {

  // Safety check
  if (!item) {
    return null;
  }

  const expiryDate =
    item.expiryDate ||
    item.expiry_date ||
    null;

  const image =
    item.foodImageUrl ||
    item.food_image_url ||
    "/banner2.jpeg";

  const category =
    item.foodCategory ||
    item.food_category ||
    "Food";

  const calculateDaysLeft = () => {

    if (!expiryDate) {
      return null;
    }

    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    const expiry = new Date(
      expiryDate
    );

    expiry.setHours(
      0,
      0,
      0,
      0
    );

    const difference =
      expiry.getTime() -
      today.getTime();

    return Math.ceil(
      difference /
        (1000 * 60 * 60 * 24)
    );
  };

  const daysLeft =
    calculateDaysLeft();

  return (
    <article className="bg-white rounded-2xl overflow-hidden border border-green-100 shadow-sm hover:shadow-xl transition">

      {/* IMAGE */}

      <img
        src={image}
        alt={item.title || "Food"}
        className="w-full h-48 object-cover"
        onError={(event) => {
          event.currentTarget.src =
            "/banner2.jpeg";
        }}
      />

      {/* CONTENT */}

      <div className="p-5">

        {/* TITLE */}

        <div className="flex justify-between items-start gap-3">

          <h2 className="text-xl font-bold text-[#0a472e]">
            {item.title ||
              "Unnamed Food"}
          </h2>

          <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full whitespace-nowrap">
            Near Expiry
          </span>

        </div>

        {/* CATEGORY */}

        <p className="text-gray-600 mt-3">
          {category}
        </p>

        {/* QUANTITY */}

        <p className="text-sm text-gray-500 mt-2">

          Quantity:

          <span className="font-medium text-gray-700 ml-1">
            {item.quantity ||
              "Not specified"}
          </span>

        </p>

        {/* EXPIRY DATE */}

        <p className="text-sm text-gray-500 mt-2">

          Expiry date:

          <span className="font-medium text-gray-700 ml-1">

            {expiryDate
              ? new Date(
                  expiryDate
                ).toLocaleDateString(
                  "en-IN"
                )
              : "Not specified"}

          </span>

        </p>

        {/* DAYS LEFT */}

        {daysLeft !== null && (

          <div className="mt-4">

            <span
              className={`inline-block px-3 py-2 rounded-lg text-sm font-semibold ${
                daysLeft <= 1
                  ? "bg-red-100 text-red-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >

              {daysLeft === 0
                ? "Expires today"
                : daysLeft === 1
                ? "Expires tomorrow"
                : `${daysLeft} days left`}

            </span>

          </div>

        )}

        {/* STORAGE */}

        {(item.storageLocation ||
          item.storage_location) && (

          <p className="text-sm text-gray-500 mt-3">

            📦

            <span className="ml-1">
              {item.storageLocation ||
                item.storage_location}
            </span>

          </p>

        )}

      </div>

    </article>
  );
}