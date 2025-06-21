"use client";
import { ChevronDown, User } from "lucide-react";
// import { useAppSelector } from "@/app/store/hooks";
import BreadCrumb from "@/app/components/feedback/BreadCrumb";
// import Image from "next/image";
import Sidebar from "../../components/layout/Sidebar";
import DashboardSearchBar from "@/app/components/molecules/DashboardSearchbar";
// import { useGetMeQuery } from "@/app/store/apis/UserApi";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { data } = useGetMeQuery(undefined)

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <BreadCrumb />
          <div className="flex items-center gap-6">
            <DashboardSearchBar />
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-100">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </header>

        <div className="px-4"></div>

        <main className="flex-1 p-2 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
