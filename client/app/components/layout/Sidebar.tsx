"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import useStorage from "@/app/hooks/state/useStorage";
import { useSignOutMutation } from "@/app/store/apis/AuthApi";
import { useAppDispatch } from "@/app/store/hooks";
import { clearUser } from "@/app/store/slices/AuthSlice";

import {
  LayoutDashboard,
  ShoppingCart,
  CreditCard,
  Layers,
  Users,
  LogOut,
  PanelsRightBottom,
  FileText,
  LayoutGrid,
  Boxes,
  Paintbrush,
  ShieldCheck,
  Image,
} from "lucide-react";
import DashboardSearchBar from "../molecules/DashboardSearchbar";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useStorage<boolean>("sidebarOpen", true, "local");
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [signout] = useSignOutMutation();

  const sections = useMemo(
    () => [
      {
        title: "Main",
        links: [
          { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { name: "Orders", href: "/orders", icon: ShoppingCart },
          { name: "Payments", href: "/payments", icon: CreditCard },
        ],
      },
      {
        title: "Content",
        links: [
          { name: "Pages", href: "/pages", icon: FileText },
          { name: "Banners", href: "/banners", icon: Image },
          { name: "Sections", href: "/sections", icon: LayoutGrid },
          { name: "Widgets", href: "/widgets", icon: Boxes },
          { name: "Themes", href: "/themes", icon: Paintbrush },
        ],
      },
      {
        title: "Organization",
        links: [
          { name: "Products", href: "/products", icon: Layers },
          { name: "Categories", href: "/categories", icon: Layers },
          { name: "Users", href: "/users", icon: Users },
          { name: "Admins", href: "/admins", icon: ShieldCheck },
        ],
      },
    ],
    []
  );

  const prependDashboard = (href: string) =>
    href.startsWith("/dashboard") ? href : `/dashboard${href}`;

  const handleSignOut = async () => {
    try {
      await signout().unwrap();
      dispatch(clearUser());
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const SidebarLink = ({
    name,
    href,
    Icon,
  }: {
    name: string;
    href: string;
    Icon: React.ElementType;
  }) => {
    const fullHref = prependDashboard(href);
    const isActive = pathname === fullHref;

    return (
      <Link
        href={fullHref}
        className={`relative group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
          isActive
            ? "bg-blue-100 text-blue-700 font-medium shadow-sm"
            : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        <motion.div whileHover={{ scale: 1.1 }}>
          <Icon
            className={`h-5 w-5 transition ${
              isActive ? "text-blue-700" : "group-hover:text-black"
            }`}
          />
        </motion.div>
        {isOpen && <span className="text-sm">{name}</span>}
      </Link>
    );
  };

  return (
    <motion.aside
      initial={{ width: 80 }}
      animate={{
        width: isOpen ? 260 : 80,
        transition: { duration: 0.3, ease: "easeInOut" },
      }}
      className="bg-white border-r border-gray-200 shadow-lg h-full flex flex-col p-4 justify-between"
    >
      <div>
        <div className="flex items-center justify-between my-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 flex items-center justify-end rounded-lg transition"
          >
            <PanelsRightBottom size={24} className="text-gray-700" />
          </button>
          <DashboardSearchBar />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-3">
          {sections.map((section, idx) => (
            <div key={section.title}>
              {section.links.map((link) => (
                <SidebarLink
                  key={link.name}
                  name={link.name}
                  href={link.href}
                  Icon={link.icon}
                />
              ))}
              {idx < sections.length - 1 && (
                <hr className="my-3 border-t border-gray-200" />
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Sign out */}
      <div className="mt-6">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
        >
          <LogOut className="h-5 w-5 text-gray-500" />
          {isOpen && <span className="text-sm">Sign Out</span>}
        </button>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
