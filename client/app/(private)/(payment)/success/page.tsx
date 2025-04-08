"use client";

const PaymentSucceded = () => {
  // const router = useRouter();
  // const { session_id } = router.query;
  // console.log("session_id => ", session_id);
  // const [orderDetails, setOrderDetails] = useState(null);

  // useEffect(() => {
  //   if (session_id) {
  //     fetch(`/api/v1/checkout/verify-session?session_id=${session_id}`)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setOrderDetails(data);
  //       })
  //       .catch((error) => {
  //         console.error("Error verifying session:", error);
  //       });
  //   }
  // }, [session_id]);

  return (
    <div>
      <h1 className="text-center text-2xl font-semibold">
        Your payment was successful
      </h1>
    </div>
  );
};

export default PaymentSucceded;
