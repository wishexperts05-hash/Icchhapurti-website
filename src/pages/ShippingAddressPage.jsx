import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <Loader2 className="w-12 h-12 animate-spin text-[#C8AC5B]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen  flex flex-col items-center justify-start py-10">

      <h2 className="text-white text-lg font-semibold mb-6">Shipping Address</h2>

      {addresses.length === 0 ? (
        <p className="text-gray-300 mb-6">No addresses found. Please add one.</p>
      ) : (
        <div className="w-full max-w-4xl flex flex-col gap-4">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className="relative bg-transparent border border-gray-300 rounded-lg p-4 flex items-start justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-4 mb-1">
                  <span className="text-white font-medium">{addr.fullName}</span>
                  <span className="text-white text-sm">{addr.phoneNumber}</span>
                </div>

                <div className="text-gray-300 text-sm mb-2">
                  {addr.street}, {addr.city}, {addr.state}, {addr.country}, {addr.pinCode}
                </div>

                <Link
                  to={`/address-form/${addr._id}`}
                  className="text-yellow-400 text-sm mr-4 hover:underline"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(addr._id)}
                  className="text-red-400 text-sm hover:underline"
                  disabled={deleteLoading === addr._id}
                >
                  {deleteLoading === addr._id ? "Removing..." : "Remove"}
                </button>
              </div>

              <input
                type="radio"
                className="accent-[#C8AC5B] w-5 h-5 mt-2"
                checked={selected === addr._id}
                onChange={() => setSelected(addr._id)}
                name="selectedAddress"
              />
            </div>
          ))}
        </div>
      )}

      <Link
        to="/address-form"
        className="mt-8 px-10 py-3 rounded-md bg-[#C8AC5B] text-white text-lg font-semibold transition hover:bg-yellow-600"
      >
        Add New Address
      </Link>
    </div>
  );
};

export default ShippingAddressPage;
