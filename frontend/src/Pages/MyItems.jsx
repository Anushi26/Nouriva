import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import Loading from "./Loading";
import { TiStopwatch } from "react-icons/ti";
import { GrUpdate } from "react-icons/gr";
import { MdDeleteForever, MdOutlineAssignmentTurnedIn } from "react-icons/md";
import { MdAddShoppingCart } from "react-icons/md";
import Swal from "sweetalert2";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import UpdateItemModal from "../Components/UpdateItemModal";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const MyItems = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [myItems, setMyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [updateitem, setUpdateitem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    if (user?.email) {
      setLoading(true);
      axiosSecure
        .get(`/my-food-items?email=${user.email}`)
        .then((res) => {
          setMyItems(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user, axiosSecure]);
  const totalPages = Math.ceil(myItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = myItems.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleUpdate = async (updatedData) => {
    try {
      const res = await axiosSecure.put(
        `/update-item/${updateitem._id}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = res.data;
      if (data.modifiedCount > 0) {
        Swal.fire("Success!", "Food Item updated successfully.", "success");
        setMyItems((prev) =>
          prev.map((t) =>
            t._id === updateitem._id ? { ...t, ...updatedData } : t
          )
        );
      } else {
        Swal.fire("Oops!", "Failed to update food item.", "error");
      }
    } catch {
      Swal.fire("Error", "Something went wrong.", "error");
    } finally {
      setShowModal(false);
    }
  };

  const handleDelete = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete the food item!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(`/food-items/${_id}`)
          .then((res) => {
            if (res.data.deletedCount) {
              Swal.fire({
                title: "Deleted!",
                text: "Your Food Item has been deleted.",
                icon: "success",
              });
              const remainingFoodItems = myItems.filter(
                (item) => item._id !== _id
              );
              setMyItems(remainingFoodItems);
            }
          })
          .catch((error) => {
            console.error("Delete failed:", error);
          });
      }
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="w-11/12 mx-auto py-24 font-roboto">
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl font-bold pb-2">
          My Created Items
        </h1>
        <p className="md:w-3/5 mx-auto pt-6 text-gray-700 pb-6">
          View and manage all the food items you've added. <br /> Keep track of
          expiry dates and reduce waste with timely updates.
        </p>
      </div>

      {myItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-lg shadow-sm">
          <MdOutlineAssignmentTurnedIn className="text-5xl text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            No Food Items Added Yet
          </h2>
          <p className="text-sm text-gray-500">
            Start by posting a food item to connect with Nouriva!
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto w-full">
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Food Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Item Quantity</th>
                  <th>Expire Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedItems.map((item, index) => {
                  return (
                    <tr key={item._id}>
                      <td>{startIndex + index + 1}</td>
                      <td>
                        <div className="bg-base-300 h-20 w-20 rounded-2xl">
                          <img
                            className="h-20 w-20 p-3"
                            src={item.foodImageUrl}
                            alt={item.title}
                          />
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-semibold text-lg">
                            {item.title}
                          </div>
                        </div>
                      </td>
                      <td>{item.foodCategory}</td>
                      <td>
                        <div className="flex gap-2 text-green-900 relative">
                          <MdAddShoppingCart size={20} />
                          <span className="font-semibold">{item.quantity}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2 items-center">
                          <TiStopwatch size={20} />
                          {item.expiryDate
                            ? new Date(item.expiryDate).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )
                            : "Date not available"}
                        </div>
                      </td>
                      <td className="space-y-3">
                        <button
                          onClick={() => {
                            setUpdateitem(item);
                            setShowModal(true);
                          }}
                          className="flex items-center gap-1 text-white text-xs px-4 py-1 rounded-full bg-gradient-to-r from-green-500 to-lime-600 hover:from-lime-600 hover:to-green-500 shadow-md transition-all"
                        >
                          <GrUpdate className="text-sm" />
                          Update
                        </button>

                        <button
                          onClick={() => handleDelete(item._id)}
                          className="flex items-center gap-1 text-white text-xs px-4 py-1 rounded-full bg-gradient-to-r from-rose-500 to-red-600 hover:from-red-600 hover:to-rose-500 shadow-md transition-all"
                        >
                          <MdDeleteForever className="text-sm" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center items-center gap-2 mt-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-full border ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-200"
              }`}
            >
              <FaArrowLeft />
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`w-10 h-10 rounded-full flex items-center justify-center border font-semibold transition-colors duration-300
                  ${
                    currentPage === index + 1
                      ? "bg-green-900 text-white"
                      : "bg-white hover:bg-green-200"
                  }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full border ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-200"
              }`}
            >
              <FaArrowRight />
            </button>
          </div>
        </>
      )}
      <UpdateItemModal
        show={showModal}
        onClose={() => setShowModal(false)}
        item={updateitem}
        user={user}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default MyItems;
