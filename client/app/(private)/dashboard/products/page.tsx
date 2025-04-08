"use client";
import Table from "@/app/components/layout/Table";
import useQueryParams from "@/app/hooks/network/useQueryParams";
import { useGetAllProductsQuery } from "@/app/store/apis/ProductApi";
import Image from "next/image";

const Products = () => {
  const { query } = useQueryParams();
  const { data, isLoading } = useGetAllProductsQuery(query);
  const products = data?.products || [];

  const columns = [
    {
      key: "name",
      label: "Product Name",
      sortable: true,
      render: (row: any) => (
        <div className="flex items-center space-x-2">
          <Image
            src={row.images[0]}
            alt={row.name}
            width={40}
            height={40}
            className="object-cover"
          />
          <span>{row.name}</span>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (row: any) => `$${row.price.toFixed(2)}`,
    },
    {
      key: "discount",
      label: "Discount",
      sortable: true,
      render: (row: any) => `${row.discount}%`,
    },
    {
      key: "stock",
      label: "Stock",
      sortable: true,
      render: (row: any) => row.stock,
    },
    {
      key: "salesCount",
      label: "Sales Count",
      sortable: true,
      render: (row: any) => row.salesCount,
    },
    {
      key: "actions",
      label: "Actions",
      render: () => (
        <button className="text-blue-600 hover:text-blue-800">Edit</button>
      ),
    },
  ];

  return (
    <>
      <Table
        data={products}
        columns={columns}
        isLoading={isLoading}
        emptyMessage="No products available"
        title="Product List"
        subtitle="Manage and view your products"
      />
    </>
  );
};

export default Products;
