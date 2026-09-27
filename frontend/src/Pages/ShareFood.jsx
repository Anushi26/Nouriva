import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { toast } from "react-toastify";
import {
  FaShareAlt,
  FaMapMarkerAlt,
  FaClock,
  FaArrowLeft,
  FaUtensils,
  FaCamera,
  FaTimes,
} from "react-icons/fa";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const MAX_IMAGES = 5;

const ShareFood = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  const food = location.state?.food || null;

  const [form, setForm] = useState({
    title: food?.title || "",
    category: food?.foodCategory || "",
    quantity: food?.quantity || "",
    description: food?.description || "",
    location: "",
    availableUntil: "",
    dietaryType: food?.dietaryType || "Not specified",
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // CLEAN UP OBJECT URLS
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [imagePreviews]);

  // --------------------------------------------------
  // INPUT CHANGE
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // IMAGE SELECTION
  // --------------------------------------------------
const handleImageChange = (e) => {
  const selectedFiles = Array.from(e.target.files || []);

  if (selectedFiles.length === 0) {
    return;
  }

  const remainingSlots = MAX_IMAGES - images.length;

  if (remainingSlots <= 0) {
    toast.error(`You can add maximum ${MAX_IMAGES} images.`);
    return;
  }

  const filesToAdd = selectedFiles.slice(0, remainingSlots);

  const validFiles = filesToAdd.filter((file) => {
    if (!file.type.startsWith("image/")) {
      toast.error(`${file.name} is not a valid image.`);
      return false;
    }

    return true;
  });

  if (validFiles.length === 0) {
    e.target.value = "";
    return;
  }

  // Store files
  setImages((prev) => [...prev, ...validFiles]);

  // Create image previews immediately
  const newPreviews = validFiles.map((file) => ({
    url: URL.createObjectURL(file),
    name: file.name,
  }));

  setImagePreviews((prev) => [...prev, ...newPreviews]);

  e.target.value = "";
};

  // --------------------------------------------------
  // REMOVE IMAGE
  // --------------------------------------------------

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));

    setImagePreviews((prev) => {
      const removedUrl = prev[index];

      if (removedUrl) {
        URL.revokeObjectURL(removedUrl);
      }

      return prev.filter((_, i) => i !== index);
    });
  };

  // --------------------------------------------------
  // CONVERT IMAGE TO BASE64
  // --------------------------------------------------

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const maxDimension = 1400;
          const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.72));
        };
        img.onerror = () => reject(new Error("Unable to process image."));
        img.src = reader.result;
      };
      reader.onerror = () => reject(new Error("Unable to read image."));
      reader.readAsDataURL(file);
    });
  };

  // --------------------------------------------------
  // SUBMIT
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required fields
    if (
      !form.title.trim() ||
      !form.category ||
      !form.quantity.trim() ||
      !form.location.trim() ||
      !form.availableUntil
    ) {
      toast.error("Please fill all required fields.");
      return;
    }

    // IMAGE IS MANDATORY
    if (images.length === 0) {
      toast.error(
        "Please add at least one image of the surplus food."
      );
      return;
    }

    if (images.length > MAX_IMAGES) {
      toast.error(`You can add maximum ${MAX_IMAGES} images.`);
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem("nouriva_token") ||
        localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first.");
        navigate("/auth/login");
        return;
      }

      // Convert selected images to Base64
      const encodedImages = await Promise.all(
        images.map((file) => fileToBase64(file))
      );

      const response = await fetch(`${API_URL}/surplus`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          title: form.title.trim(),
          category: form.category,
          quantity: form.quantity.trim(),
          description: form.description.trim(),

          // Multiple images
          images: encodedImages,

          location: form.location.trim(),
          availableUntil: form.availableUntil,
          dietaryType: form.dietaryType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to share food."
        );
      }

      toast.success(
        "Food shared successfully! +20 Nouriva Points"
      );

      navigate("/home/shared-food", {
        replace: true,
      });
    } catch (error) {
      console.error("Share food error:", error);

      toast.error(
        error.message || "Unable to share food."
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // CURRENT MINIMUM DATETIME
  // --------------------------------------------------

  const getMinDateTime = () => {
    const now = new Date();

    const local = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000
    );

    return local.toISOString().slice(0, 16);
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-[#f7faf7] py-10 px-4">
      <div className="max-w-3xl mx-auto">

        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#0a472e] font-semibold mb-6 hover:underline"
        >
          <FaArrowLeft />
          Back
        </button>

        {/* HEADER */}

        <div className="bg-[#0a472e] text-white rounded-2xl p-8 mb-6 shadow-lg">
          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
              <FaShareAlt size={25} />
            </div>

            <div>
              <h1 className="text-3xl font-bold">
                Share Surplus Food
              </h1>

              <p className="text-green-100 mt-1">
                Give your extra food a second chance instead of wasting it.
              </p>
            </div>

          </div>
        </div>

        {/* FORM */}

        <div className="bg-white rounded-2xl shadow-md border border-green-100 p-6 md:p-8">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* ==========================================
                FOOD IMAGES
            ========================================== */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Food Images <span className="text-red-500">*</span>
              </label>

              <p className="text-sm text-gray-500 mb-3">
                Add clear photos of the surplus food.
                You can add up to {MAX_IMAGES} images.
              </p>

              {/* IMAGE UPLOAD BOX */}

              <div
                onClick={() =>
                  !loading &&
                  fileInputRef.current?.click()
                }
                className="border-2 border-dashed border-green-300 rounded-2xl p-6 text-center cursor-pointer hover:border-[#0a472e] hover:bg-green-50 transition"
              >

                <div className="w-14 h-14 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-3">
                  <FaCamera
                    size={24}
                    className="text-[#0a472e]"
                  />
                </div>

                <p className="font-semibold text-[#0a472e]">
                  Add Food Images
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Click to select one or multiple images
                </p>

                <p className="text-xs text-gray-400 mt-2">
JPG, JPEG, PNG, WEBP • No image size restriction                </p>

                <p className="text-xs text-gray-400">
                  {images.length}/{MAX_IMAGES} images selected
                </p>

              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />

              {/* IMAGE PREVIEWS */}

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-5">

                  {imagePreviews.map((preview, index) => (
                    <div
                      key={`${preview}-${index}`}
                      className="relative group"
                    >

                      <img
                        src={preview}
                        alt={`Food preview ${index + 1}`}
                        className="w-full h-36 object-cover rounded-xl border border-gray-200 shadow-sm"
                      />

                      {/* REMOVE BUTTON */}

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        disabled={loading}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md hover:bg-red-700 transition disabled:opacity-50"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <FaTimes size={14} />
                      </button>

                      {/* IMAGE NUMBER */}

                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                        Image {index + 1}
                      </div>

                    </div>
                  ))}

                </div>
              )}

              {/* REQUIRED MESSAGE */}

              {images.length === 0 && (
                <p className="text-sm text-red-500 mt-2">
                  At least one food image is required.
                </p>
              )}

              {images.length > 0 && (
                <p className="text-sm text-green-700 mt-2">
                  ✓ {images.length} image
                  {images.length > 1 ? "s" : ""} selected
                </p>
              )}

            </div>

            {/* FOOD NAME */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Food Name *
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Fresh Apples"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
              />

            </div>

            {/* CATEGORY + QUANTITY */}

            <div className="grid md:grid-cols-2 gap-5">

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Food Category *
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
                >

                  <option value="">
                    Select category
                  </option>

                  <option value="Fruits">
                    Fruits
                  </option>

                  <option value="Vegetables">
                    Vegetables
                  </option>

                  <option value="Dairy">
                    Dairy
                  </option>

                  <option value="Grains">
                    Grains
                  </option>

                  <option value="Cooked Food">
                    Cooked Food
                  </option>

                  <option value="Bakery">
                    Bakery
                  </option>

                  <option value="Packaged Food">
                    Packaged Food
                  </option>

                  <option value="Other">
                    Other
                  </option>

                </select>

              </div>

              <div>

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Quantity *
                </label>

                <input
                  type="text"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 5 kg / 3 packets"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
                />

              </div>

            </div>

            {/* DIETARY TYPE */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Dietary Type
              </label>

              <select
                name="dietaryType"
                value={form.dietaryType}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-600"
              >

                <option value="Not specified">
                  Not specified
                </option>

                <option value="Vegetarian">
                  Vegetarian
                </option>

                <option value="Vegan">
                  Vegan
                </option>

                <option value="Non-Vegetarian">
                  Non-Vegetarian
                </option>

                <option value="Jain">
                  Jain
                </option>

              </select>

            </div>

            {/* DESCRIPTION */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="Tell others about the food..."
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 resize-none"
              />

            </div>

            {/* LOCATION */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pickup Location *
              </label>

              <div className="relative">

                <FaMapMarkerAlt className="absolute left-4 top-4 text-gray-400" />

                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Chandigarh Sector 17"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
                />

              </div>

            </div>

            {/* AVAILABLE UNTIL */}

            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Available Until *
              </label>

              <div className="relative">

                <FaClock className="absolute left-4 top-4 text-gray-400" />

                <input
                  type="datetime-local"
                  name="availableUntil"
                  value={form.availableUntil}
                  onChange={handleChange}
                  required
                  min={getMinDateTime()}
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
                />

              </div>

            </div>

            {/* BUTTONS */}

            <div className="flex flex-col sm:flex-row gap-4 pt-4">

              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={loading}
                className="w-full sm:w-1/2 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-1/2 py-3 rounded-xl bg-gradient-to-r from-[#a8b324] to-[#0a472e] text-white font-semibold flex items-center justify-center gap-2 shadow-md hover:opacity-95 transition disabled:opacity-60"
              >

                <FaShareAlt />

                {loading
                  ? "Sharing Food..."
                  : "Share Food"}

              </button>

            </div>

          </form>

        </div>

        {/* INFO */}

        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-5">

          <div className="flex gap-3">

            <FaUtensils className="text-green-700 mt-1" />

            <div>

              <h3 className="font-semibold text-green-900">
                Make an impact
              </h3>

              <p className="text-sm text-green-800 mt-1">
                Every successful food sharing action helps
                reduce food waste and earns you Nouriva points.
              </p>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ShareFood;