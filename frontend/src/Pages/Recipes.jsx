import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaSearch,
  FaUtensils,
  FaClock,
  FaLeaf,
  FaTimes,
  FaLightbulb,
} from "react-icons/fa";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [inventory, setInventory] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [loading, setLoading] = useState(true);
  const [inventoryLoading, setInventoryLoading] =
    useState(true);

  // =====================================================
  // FETCH RECIPES
  // =====================================================

  const fetchRecipes = async (ingredients = "") => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("nouriva_token");

      if (!token) {
        toast.error("Please login first.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/recipes`,
        {
          params: {
            ingredients,
          },

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setRecipes(
        Array.isArray(response.data)
          ? response.data
          : []
      );

    } catch (error) {
      console.error(
        "Recipe loading error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load recipes."
      );

      setRecipes([]);

    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // FETCH USER INVENTORY
  // =====================================================

  const fetchInventory = async () => {
    try {
      setInventoryLoading(true);

      const token =
        localStorage.getItem(
          "nouriva_token"
        );

      if (!token) {
        return;
      }

      const response = await axios.get(
        `${API_URL}/allFoodsItems`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        Array.isArray(response.data)
          ? response.data
          : [];

      setInventory(data);

      // Initially show all recipes
      fetchRecipes("");

    } catch (error) {
      console.error(
        "Inventory loading error:",
        error
      );

      setInventory([]);

      // Still load recipes
      fetchRecipes("");

    } finally {
      setInventoryLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchInventory();
  }, []);

  // =====================================================
  // INVENTORY INGREDIENTS
  // =====================================================

  const inventoryIngredients = useMemo(() => {
    return inventory
      .map((item) => {
        return `${item.title || ""} ${
          item.foodCategory || ""
        } ${item.description || ""}`;
      })
      .join(" ")
      .toLowerCase();
  }, [inventory]);

  // =====================================================
  // FIND RECIPES FROM MY FOOD
  // =====================================================

  const handleUseMyIngredients = () => {
    if (!inventory.length) {
      toast.info(
        "Your inventory is empty. Add some food first."
      );

      return;
    }

    fetchRecipes(
      inventoryIngredients
    );

    setSearch("");

    toast.success(
      "Recipes matched with your inventory."
    );
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = (e) => {
    e.preventDefault();

    fetchRecipes(
      search.trim().toLowerCase()
    );
  };

  // =====================================================
  // CLEAR SEARCH
  // =====================================================

  const clearSearch = () => {
    setSearch("");
    fetchRecipes("");
  };

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = [
    "All",
    "Quick",
    "Healthy",
    "No Cook",
    "Dinner",
  ];

  // =====================================================
  // FILTER RECIPES
  // =====================================================

  const displayedRecipes =
    recipes.filter((recipe) => {

      if (
        selectedCategory !== "All" &&
        recipe.category !==
          selectedCategory
      ) {
        return false;
      }

      if (!search.trim()) {
        return true;
      }

      const query =
        search.toLowerCase();

      const searchableText = `
        ${recipe.name || ""}
        ${(recipe.items || []).join(" ")}
        ${recipe.category || ""}
      `.toLowerCase();

      return searchableText.includes(
        query
      );
    });

  // =====================================================
  // RECIPE CARD
  // =====================================================

  const RecipeCard = ({ recipe }) => {

    return (
      <article className="bg-white rounded-2xl border border-green-100 shadow-sm hover:shadow-xl transition overflow-hidden">

        {/* TOP */}

        <div className="h-36 bg-gradient-to-br from-green-100 via-lime-50 to-yellow-50 flex items-center justify-center">

          <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center">

            <FaUtensils
              size={32}
              className="text-[#0a472e]"
            />

          </div>

        </div>

        {/* CONTENT */}

        <div className="p-6">

          {/* CATEGORY */}

          <div className="flex justify-between items-start gap-3">

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-semibold">

              <FaLeaf />

              {recipe.category ||
                "Recipe"}

            </span>

            <span className="inline-flex items-center gap-1 text-sm text-gray-500">

              <FaClock />

              {recipe.time ||
                "Time not specified"}

            </span>

          </div>

          {/* NAME */}

          <h2 className="text-xl font-bold text-[#0a472e] mt-4">

            {recipe.name}

          </h2>

          {/* INGREDIENTS */}

          <div className="mt-4">

            <p className="text-sm font-semibold text-gray-700 mb-2">

              Ingredients

            </p>

            <div className="flex flex-wrap gap-2">

              {(recipe.items || []).map(
                (item, index) => (

                  <span
                    key={`${item}-${index}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                  >
                    {item}
                  </span>

                )
              )}

            </div>

          </div>

          {/* COOKING IDEA */}

          <div className="mt-5 p-3 bg-green-50 rounded-xl border border-green-100">

            <div className="flex gap-2">

              <FaLightbulb className="text-[#a8b324] mt-1 flex-shrink-0" />

              <p className="text-sm text-green-800">

                A simple way to use ingredients
                already available in your
                kitchen.

              </p>

            </div>

          </div>

        </div>

      </article>
    );
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f7faf7] py-10 px-4">

      <div className="w-11/12 max-w-7xl mx-auto">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="text-center max-w-3xl mx-auto">

          <p className="text-green-700 font-semibold tracking-widest text-sm">

            NOURIVA RECIPES

          </p>

          <h1 className="text-4xl md:text-5xl font-bold text-[#0a472e] mt-2">

            Turn your food into something delicious

          </h1>

          <p className="text-gray-600 mt-4">

            Discover simple recipes based on
            ingredients you already have and
            use food before it goes to waste.

          </p>

        </div>

        {/* =================================================
            SEARCH
        ================================================= */}

        <form
          onSubmit={handleSearch}
          className="max-w-3xl mx-auto mt-8"
        >

          <div className="flex flex-col sm:flex-row gap-3">

            <div className="relative flex-1">

              <FaSearch className="absolute left-4 top-4 text-gray-400" />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search ingredients, e.g. tomato, bread, cheese..."
                className="w-full pl-11 pr-11 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
              />

              {search && (

                <button
                  type="button"
                  onClick={
                    clearSearch
                  }
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
                >

                  <FaTimes />

                </button>

              )}

            </div>

            <button
              type="submit"
              className="px-7 py-3 rounded-xl bg-[#0a472e] text-white font-semibold hover:bg-green-900 transition"
            >

              Search Recipes

            </button>

          </div>

        </form>

        {/* =================================================
            MY INVENTORY BUTTON
        ================================================= */}

        <div className="flex justify-center mt-5">

          <button
            onClick={
              handleUseMyIngredients
            }
            disabled={
              inventoryLoading
            }
            className="px-6 py-3 rounded-xl bg-[#a8b324] text-[#0a472e] font-semibold hover:bg-[#96a21f] transition disabled:opacity-60"
          >

            🌱

            {inventoryLoading
              ? "Loading Inventory..."
              : "Use My Inventory"}

          </button>

        </div>

        {/* =================================================
            INVENTORY SUMMARY
        ================================================= */}

        <div className="mt-8 bg-white border border-green-100 rounded-2xl p-5 shadow-sm">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>

              <p className="text-sm text-gray-500">

                Your inventory

              </p>

              <h3 className="text-xl font-bold text-[#0a472e]">

                {inventory.length} food item
                {inventory.length !== 1
                  ? "s"
                  : ""}

              </h3>

            </div>

            <div className="flex flex-wrap gap-2">

              {inventory.length > 0 ? (

                inventory
                  .slice(0, 8)
                  .map(
                    (item, index) => (

                      <span
                        key={
                          item.id ||
                          item._id ||
                          index
                        }
                        className="px-3 py-1 bg-green-50 text-green-800 rounded-full text-xs font-medium"
                      >

                        {item.title}

                      </span>

                    )
                  )

              ) : (

                <span className="text-sm text-gray-500">

                  No food added yet.

                </span>

              )}

              {inventory.length > 8 && (

                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">

                  +{inventory.length - 8} more

                </span>

              )}

            </div>

          </div>

        </div>

        {/* =================================================
            CATEGORY FILTER
        ================================================= */}

        <div className="flex flex-wrap justify-center gap-3 mt-8">

          {categories.map(
            (category) => (

              <button
                key={category}
                onClick={() =>
                  setSelectedCategory(
                    category
                  )
                }
                className={`px-5 py-2 rounded-full font-medium transition ${
                  selectedCategory ===
                  category
                    ? "bg-[#0a472e] text-white"
                    : "bg-white text-gray-700 border border-gray-200 hover:border-green-500"
                }`}
              >

                {category}

              </button>

            )
          )}

        </div>

        {/* =================================================
            RESULTS HEADER
        ================================================= */}

        <div className="flex justify-between items-center mt-10 mb-5">

          <div>

            <h2 className="text-2xl font-bold text-[#0a472e]">

              Recipe Ideas

            </h2>

            <p className="text-gray-500 text-sm mt-1">

              {displayedRecipes.length} recipe
              {displayedRecipes.length !== 1
                ? "s"
                : ""}{" "}
              found

            </p>

          </div>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {[1, 2, 3].map(
              (item) => (

                <div
                  key={item}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
                >

                  <div className="h-36 bg-gray-200"></div>

                  <div className="p-6 space-y-4">

                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>

                    <div className="h-7 bg-gray-200 rounded w-3/4"></div>

                    <div className="h-4 bg-gray-200 rounded w-full"></div>

                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

        {/* =================================================
            EMPTY
        ================================================= */}

        {!loading &&
          displayedRecipes.length ===
            0 && (

            <div className="bg-white rounded-2xl border border-green-100 p-12 text-center">

              <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto">

                <FaUtensils
                  size={30}
                  className="text-[#0a472e]"
                />

              </div>

              <h3 className="text-2xl font-bold text-[#0a472e] mt-5">

                No matching recipes

              </h3>

              <p className="text-gray-500 mt-2">

                Try another ingredient or
                use fewer search terms.

              </p>

              <button
                onClick={
                  clearSearch
                }
                className="mt-5 px-6 py-2 rounded-lg bg-[#0a472e] text-white font-semibold"
              >

                Show All Recipes

              </button>

            </div>

          )}

        {/* =================================================
            RECIPES
        ================================================= */}

        {!loading &&
          displayedRecipes.length >
            0 && (

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

              {displayedRecipes.map(
                (recipe, index) => (

                  <RecipeCard
                    key={`${recipe.name}-${index}`}
                    recipe={recipe}
                  />

                )
              )}

            </div>

          )}

        {/* =================================================
            FOOTER MESSAGE
        ================================================= */}

        <div className="mt-12 bg-gradient-to-r from-green-100 to-lime-50 rounded-2xl p-7 text-center border border-green-100">

          <FaLeaf
            className="mx-auto text-[#0a472e]"
            size={28}
          />

          <h3 className="text-xl font-bold text-[#0a472e] mt-3">

            Cook what you already have

          </h3>

          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">

            Nouriva helps you discover ways to
            use your existing food so that less
            of it ends up as waste.

          </p>

        </div>

      </div>

    </div>
  );
};

export default Recipes;