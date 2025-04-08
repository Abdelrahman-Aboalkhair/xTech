"use client";
import Table from "@/app/components/layout/Table";
import { useGetAllUsersQuery } from "@/app/store/apis/UserApi";
import Image from "next/image";
import React from "react";

const Users = () => {
  const { data, isLoading, error } = useGetAllUsersQuery({});
  if (error) {
    console.log("error: ", error);
  }
  const users = data?.users || [];
  console.log("users => ", users);

  const columns = [
    {
      key: "id",
      label: "User ID",
      sortable: true,
    },
    {
      key: "name",
      label: "Name",
      render: (row: any) => {
        return (
          <div className="flex items-center space-x-2">
            <Image
              src={row.avatar}
              alt={row.name}
              width={40}
              height={40}
              className="object-cover rounded-full"
            />
            <span>{row.name}</span>
          </div>
        );
      },
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      sortable: true,
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
    },
    {
      key: "emailVerified",
      label: "Email Verified",
      render: (row: any) => (row.emailVerified ? "Yes" : "No"),
    },
    {
      key: "createdAt",
      label: "Created At",
      sortable: true,
      render: (row: any) => new Date(row.createdAt).toLocaleString(),
    },
    {
      key: "updatedAt",
      label: "Updated At",
      sortable: true,
      render: (row: any) => new Date(row.updatedAt).toLocaleString(),
    },
  ];

  return (
    <>
      <Table data={users} columns={columns} isLoading={isLoading} />
    </>
  );
};

export default Users;
