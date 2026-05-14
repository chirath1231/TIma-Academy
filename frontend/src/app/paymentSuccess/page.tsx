"use client";

import { useEffect } from "react";
import axios from "axios";

export default function PaymentSuccess() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id");

    if (!orderId) return;

    // Send confirmation request to backend
    axios.post("http://localhost:3001/confirmPayment", {
      order_id: orderId
    })
    .then((res) => {
      console.log("Payment confirmed:", res.data);
    })
    .catch((err) => {
      console.error("Error confirming payment:", err);
    });
  }, []);

  return (
    <div style={{ padding: "50px" }}>
      <h1>Payment Successful</h1>
      <p>Your payment was processed successfully.</p>
      <p>We are updating your course access...</p>
    </div>
  );
}
