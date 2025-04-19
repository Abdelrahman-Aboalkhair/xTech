import { useGetTransactionQuery } from "@/app/store/apis/TransactionApi";
import { useParams } from "next/navigation";
import React from "react";

const TransactionDetailPage = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetTransactionQuery(id);
  console.log("transaction found =>  ", data);

  if (isLoading) {
    return <div>Loading....</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  /**
   * Each Transaction is linked to a specific order (Tied to payment, shipment details,customer address,amount, order items )
   *  and the status of the transaction,
   *  cause basically a bunch of operations are tied to a transaction whether it fails or succeeds
   */
  return <div>TransactionDetailPage</div>;
};

export default TransactionDetailPage;
