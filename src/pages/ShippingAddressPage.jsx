import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const ShippingAddressPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null); // track delete button state
    useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/address/getAllAddress`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        setAddresses(data.data);
        if (data.data?.length > 0) setSelected(data.data[0]._id);
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this address?");
    if (!confirmDelete) return;

    try {
      setDeleteLoading(id);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/address/deleteAddress/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const result = await res.json();
      if (result.success) {
        fetchAddresses(); // refresh list
      } else {
        alert(result.message || "Failed to delete address!");
      }
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <Loader2 className="w-12 h-12 animate-spin text-[#C8AC5B]" />
      </div>
    );
  }




  return (
    <div className=" bg-white max-w-4xl mx-auto flex flex-col items-center justify-start py-10 px-4">
      <div className="w-full flex justify-start">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center my-2 gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>
      {/* Title */}
      <h2 className="text-slate-900 text-lg font-semibold mb-6">
        {"Shipping Address"}
      </h2>

      {/* Empty State */}
      {addresses.length === 0 ? (
        <p className="text-slate-500 mb-6">
          {"No Shipping Address"}
        </p>
      ) : (
        <div className="w-full flex flex-col gap-4">

          {addresses.map((addr) => (
            <div
              key={addr._id}
              className="relative bg-white border border-slate-200 rounded-lg p-4 flex items-start justify-between gap-4 hover:border-amber-300 transition"
            >
              <div>
                <div className="flex items-center gap-4 mb-1">
                  <span className="text-slate-800 font-medium">
                    {addr.fullName}
                  </span>
                  <span className="text-slate-600 text-sm">
                    {addr.phoneNumber}
                  </span>
                </div>

                <div className="text-slate-600 text-sm mb-2">
                  {addr.street}, {addr.city}, {addr.state}, {addr.country},{" "}
                  {addr.pinCode}
                </div>

                <Link
                  to={`/address-form/${addr._id}`}
                  className="text-amber-600 text-sm mr-4 hover:underline"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(addr._id)}
                  className="text-red-500 text-sm hover:underline disabled:opacity-50"
                  disabled={deleteLoading === addr._id}
                >
                  {deleteLoading === addr._id ? "Removing..." : "Remove"}
                </button>
              </div>

              <input
                type="radio"
                className="accent-amber-500 w-5 h-5 mt-2"
                checked={selected === addr._id}
                onChange={() => setSelected(addr._id)}
                name="selectedAddress"
              />
            </div>
          ))}
        </div>
      )}

      {/* Add Address Button */}
      <Link
        to="/address-form"
        className="mt-8 px-10 py-3 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg font-semibold transition hover:opacity-90"
      >
        {"Add New Address"}
      </Link>
    </div>

  );
};

export default ShippingAddressPage;
