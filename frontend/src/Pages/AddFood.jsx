import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read image."));
    reader.readAsDataURL(file);
  });

const AddFood = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => () => imagePreview && URL.revokeObjectURL(imagePreview), [imagePreview]);

  const handleImageChange = (e) => {
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
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleAddFood = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    if (!image) {
      toast.error("Please upload a food image.");
      return;
    }

    try {
      data.foodImageUrl = await fileToBase64(image);
      const response = await axiosSecure.post("/added-food", data);
      if (response.data.insertedId) {
        Swal.fire("Food Added!", "Your item is now being tracked.", "success");
        e.currentTarget.reset();
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImage(null);
        setImagePreview("");
        navigate("/home/myItems");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add food.");
    }
  };

  return <div className="w-11/12 max-w-5xl mx-auto py-12">
    <div className="text-center mb-8"><p className="text-green-700 font-semibold">PERSONAL FOOD INVENTORY</p><h1 className="text-4xl md:text-5xl font-bold text-[#0a472e]">Track food before it becomes waste.</h1><p className="text-gray-600 mt-3">Record purchase, storage and expiry details to keep your kitchen organized.</p></div>
    <form onSubmit={handleAddFood} className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 md:p-8 grid md:grid-cols-2 gap-5">
      <div className="md:col-span-2">
        <label className="font-semibold block">Food image *</label>
        <input required type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="w-full border rounded-lg mt-2 p-2" />
        <p className="text-sm text-gray-500 mt-1">JPG, PNG or WEBP, maximum 2 MB.</p>
        {imagePreview && <div className="mt-3"><img src={imagePreview} alt="Selected food" className="h-40 w-40 object-cover rounded-xl border" /></div>}
      </div>
      <div><label className="font-semibold">Food name *</label><input required name="title" className="input w-full border rounded-lg mt-2"/></div>
      <div><label className="font-semibold">Category *</label><select required name="foodCategory" className="select w-full border mt-2"><option value="">Select</option><option>Grain</option><option>Dairy</option><option>Meat</option><option>Fruit</option><option>Vegetables</option><option>Snacks</option><option>Cooked Food</option><option>Other</option></select></div>
      <div><label className="font-semibold">Quantity *</label><input required type="number" min="1" name="quantity" className="input w-full border rounded-lg mt-2"/></div>
      <div><label className="font-semibold">Purchase date</label><input type="date" name="purchaseDate" className="input w-full border rounded-lg mt-2"/></div>
      <div><label className="font-semibold">Expiry date *</label><input required type="date" name="expiryDate" className="input w-full border rounded-lg mt-2"/></div>
      <div><label className="font-semibold">Storage location</label><select name="storageLocation" className="select w-full border mt-2"><option>Refrigerator</option><option>Freezer</option><option>Pantry</option><option>Kitchen shelf</option><option>Other</option></select></div>
      <div><label className="font-semibold">Dietary type</label><select name="dietaryType" className="select w-full border mt-2"><option>Vegetarian</option><option>Non-vegetarian</option><option>Vegan</option><option>Not specified</option></select></div>
      <div className="md:col-span-2"><label className="font-semibold">Owner email</label><input value={user?.email||""} readOnly className="input w-full border rounded-lg mt-2 bg-gray-50"/></div>
      <div className="md:col-span-2"><label className="font-semibold">Notes</label><textarea name="description" rows="4" className="textarea w-full border rounded-lg mt-2" placeholder="Brand, quantity details, storage tips..."/></div>
      <button className="md:col-span-2 py-3 bg-[#0a472e] text-white rounded-xl font-semibold">Add to My Food</button>
    </form>
  </div>;
};
export default AddFood;
