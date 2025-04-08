"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const SuccessPage = () => {
  const router = useRouter();
  const { session_id } = router.query;
  console.log("session_id => ", session_id);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (session_id) {
      // Make an API call to your backend to get order details using the session_id
      fetch(`/api/v1/checkout/verify-session?session_id=${session_id}`)
        .then((response) => response.json())
        .then((data) => {
          // Handle the response with order details, e.g., display the order confirmation
          setOrderDetails(data);
        })
        .catch((error) => {
          console.error("Error verifying session:", error);
        });
    }
  }, [session_id]);

  return (
    <div>
      {orderDetails ? (
        <div>
          <h1>Payment Successful!</h1>
          <p>Order ID: {orderDetails.id}</p>
          <p>Total: ${orderDetails.total}</p>
          <p>Thank you for your purchase!</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default SuccessPage;
