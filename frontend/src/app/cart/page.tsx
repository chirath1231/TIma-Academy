
"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";

type CartItem = {
  _id: string;
  coursename: string;
  price: number;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const email =
    typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;

  // ---------------- FETCH CART ITEMS ----------------
  useEffect(() => {
    if (!email) return;

    fetch(`http://localhost:3001/getCart?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setItems(data.items);
        }
      })
      .finally(() => setLoading(false));
  }, [email]);

  const total = items.reduce((sum, i) => sum + i.price, 0);

  // ---------------- REMOVE ITEM ----------------
  const removeItem = async (id: string) => {
    const res = await fetch(`http://localhost:3001/removeCartItem/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (!data.success) {
      alert("Failed to remove item.");
      return;
    }

    // Remove item from UI
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  // ---------------- PAY NOW ----------------
  const payNow = async () => {
    if (!email) {
      alert("Login required");
      return;
    }

    const res = await fetch("http://localhost:3001/createCartPayment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!data.success) {
      alert("Payment error");
      return;
    }

    // AUTO SUBMIT FORM TO PAYHERE
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://sandbox.payhere.lk/pay/checkout";

    Object.entries(data.paymentData).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Your Cart</h1>

        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul className="divide-y border rounded">
              {items.map((item) => (
                <li
                  key={item._id}
                  className="p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{item.coursename}</p>
                    <p className="text-sm text-gray-600">
                      LKR {item.price}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item._id)}
                    className="px-3 py-1 bg-red-500 text-black rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between text-lg">
              <span className="opacity-80">Total</span>
              <span className="font-semibold">LKR {total}</span>
            </div>

            <button
              onClick={payNow}
              className="px-4 py-2 border rounded bg-blue-600 text-black hover:bg-blue-700"
            >
              Pay Now
            </button>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
