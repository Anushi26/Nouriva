import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read image."));
    reader.readAsDataURL(file);
  });

const UpdateItemModal = ({ show, onClose, item, user, onUpdate }) => {
  const [formData, setFormData] = useState({
    foodImageUrl: "",
    title: "",
    foodCategory: "",
    quantity: "",
    expiryDate: "",
    description: "",
  });
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    if (item && user && show) {
      const formatDate = (isoString) => (isoString ? isoString.split("T")[0] : "");
      setFormData({
        foodImageUrl: item.foodImageUrl || "",
        title: item.title || "",
        foodCategory: item.foodCategory || "",
        description: item.description || "",
        quantity: item.quantity || "",
        expiryDate: formatDate(item.expiryDate),
      });
      setImagePreview(item.foodImageUrl || "");
    }
  }, [item, user, show]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image must be 2 MB or smaller.");
      return;
    }
    try {
      const encoded = await fileToBase64(file);
      setFormData((prev) => ({ ...prev, foodImageUrl: encoded }));
      setImagePreview(URL.createObjectURL(file));
    } catch {
      toast.error("Unable to read image.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="font-roboto">
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/10 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <h2 className="text-2xl font-semibold mb-4 text-center">UPDATE FOOD ITEM</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium" htmlFor="foodImageFile">Food Image</label>
              <input id="foodImageFile" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="w-full border border-gray-300 rounded px-3 py-2" />
              {imagePreview && <img src={imagePreview} alt="Food preview" className="mt-3 h-36 w-36 object-cover rounded-xl border" />}
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="title">Title</label>
              <input id="title" name="title" type="text" value={formData.title} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="foodCategory">Category</label>
              <select id="foodCategory" name="foodCategory" value={formData.foodCategory} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="Grain">Grains</option><option value="Dairy">Dairy</option><option value="Meat">Meat</option><option value="Fruit">Fruit</option><option value="Vegetables">Vegetables</option><option value="Snacks">Snacks</option><option value="Cooked Food">Cooked Food</option><option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="description">Description</label>
              <textarea id="description" name="description" value={formData.description} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" rows={4} />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="quantity">Quantity</label>
              <input id="quantity" name="quantity" type="number" min="0" value={formData.quantity} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block mb-1 font-medium" htmlFor="expiryDate">Expiry date</label>
              <input id="expiryDate" name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100">Cancel</button>
              <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateItemModal;
