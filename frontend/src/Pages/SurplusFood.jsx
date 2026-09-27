import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

export default function SurplusFood() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const headers = {
    Authorization: `Bearer ${localStorage.getItem(
      "nouriva_token"
    )}`,
  };

  // ==========================================
  // LOAD SHARED FOOD
  // ==========================================

  const load = () => {
    axios
      .get(`${API}/surplus`, {
        headers,
      })
      .then((response) => {
        setItems(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      })
      .catch((error) => {
        console.error(
          "Failed to load surplus food:",
          error
        );

        toast.error(
          "Unable to load shared food."
        );
      });
  };

  useEffect(() => {
    load();
  }, []);

  // ==========================================
  // REQUEST FOOD
  // ==========================================

  const request = async (id) => {
    try {
      await axios.post(
        `${API}/surplus/${id}/request`,
        {},
        {
          headers,
        }
      );

      toast.success(
        "Request sent to the donor."
      );

      load();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Request failed."
      );
    }
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const shown = items.filter((item) =>
    `${item.title || ""} ${
      item.category || ""
    } ${item.location || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ==========================================
  // OPEN DETAILS
  // ==========================================

  const openDetails = (id) => {
    navigate(
      `/home/shared-food/${id}`
    );
  };

  return (
    <div className="w-11/12 mx-auto py-12">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="flex flex-wrap justify-between gap-4 items-end">

        <div>

          <p className="text-green-700 font-semibold">
            FOOD RESCUE MARKETPLACE
          </p>

          <h1 className="text-4xl font-bold text-[#0a472e]">
            Available surplus food
          </h1>

          <p className="text-gray-600 mt-2">
            Find food that would otherwise
            go to waste.
          </p>

        </div>

        <Link
          to="/home/share-food"
          className="px-5 py-3 bg-[#0a472e] text-white rounded-full hover:bg-green-900 transition"
        >
          + Share food
        </Link>

      </div>

      {/* ======================================
          SEARCH
      ====================================== */}

      <input
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="input w-full border rounded-xl mt-7 px-4 py-3"
        placeholder="Search food, category or location..."
      />

      {/* ======================================
          EMPTY STATE
      ====================================== */}

      {shown.length === 0 ? (

        <div className="py-20 text-center text-gray-500">

          <p className="text-xl font-semibold">
            No surplus food is available
            right now.
          </p>

          <p className="mt-2">
            Try another search or share
            some surplus food.
          </p>

        </div>

      ) : (

        /* ====================================
           FOOD CARDS
        ==================================== */

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-7">

          {shown.map((item) => (

            <article
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-green-100 hover:shadow-xl transition"
            >

              {/* FOOD IMAGE */}

              <img
                src={
                  item.image_url ||
                  "/banner2.jpeg"
                }
                className="w-full h-44 object-cover"
                alt={item.title || "Food"}
              />

              {/* CONTENT */}

              <div className="p-5">

                {/* TITLE + DIET */}

                <div className="flex justify-between gap-3">

                  <h2 className="font-bold text-xl text-[#0a472e]">
                    {item.title ||
                      "Unnamed Food"}
                  </h2>

                  {item.dietary_type && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full h-fit whitespace-nowrap">
                      {item.dietary_type}
                    </span>
                  )}

                </div>

                {/* QUANTITY + CATEGORY */}

                <p className="text-gray-600 mt-2">
                  {item.quantity ||
                    "Quantity not specified"}{" "}
                  ·{" "}
                  {item.category ||
                    "Food"}
                </p>

                {/* LOCATION */}

                <p className="text-sm text-gray-500 mt-1">
                  📍{" "}
                  {item.location ||
                    "Location not specified"}
                </p>

                {/* AVAILABLE UNTIL */}

                <p className="text-sm text-gray-500">
                  Available until{" "}
                  {item.available_until
                    ? new Date(
                        item.available_until
                      ).toLocaleString()
                    : "Not specified"}
                </p>

                {/* OWNER */}

                <p className="text-sm mt-3">
                  Shared by{" "}
                  <b>
                    {item.owner_name ||
                      "Nouriva User"}
                  </b>
                </p>

                {/* =================================
                    VIEW DETAILS
                ================================= */}

                <button
                  onClick={() =>
                    openDetails(item.id)
                  }
                  className="w-full mt-4 py-2 rounded-lg border-2 border-[#0a472e] text-[#0a472e] font-semibold hover:bg-[#0a472e] hover:text-white transition"
                >
                  View Food Details
                </button>

                {/* =================================
                    REQUEST FOOD
                ================================= */}

                <button
                  onClick={() =>
                    request(item.id)
                  }
                  className="w-full mt-3 py-2 rounded-lg bg-[#a8b324] text-[#0a472e] font-semibold hover:bg-[#96a21f] transition"
                >
                  Request Food
                </button>

              </div>

            </article>

          ))}

        </div>

      )}

    </div>
  );
}