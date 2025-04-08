"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  User,
  LogOut,
  ShoppingCart,
  Users,
  Settings,
  ShieldCheck,
} from "lucide-react";
import Button from "../atoms/Button";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { clearUser } from "@/app/store/slices/AuthSlice";
import { useSignOutMutation } from "@/app/store/apis/AuthApi";

const UserMenu = ({ menuOpen, closeMenu }: any) => {
  const [signout] = useSignOutMutation();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const res = await signout().unwrap();
      console.log("res: ", res);
      dispatch(clearUser());
      router.push("/sign-in");
    } catch (error) {
      console.log("error signing out: ", error);
    }
  };

  // Define routes based on role
  const getRoutesForRole = () => {
    switch (user?.role) {
      case "SUPERADMIN":
        return [
          {
            href: "/superadmin-dashboard",
            label: "Dashboard",
            icon: <LayoutDashboard size={18} />,
          },
          {
            href: "/manage-users",
            label: "Manage Users",
            icon: <Users size={18} />,
          },
          {
            href: "/manage-admins",
            label: "Manage Admins",
            icon: <ShieldCheck size={18} />,
          },
          {
            href: "/orders",
            label: "Orders",
            icon: <ShoppingCart size={18} />,
          },
          {
            href: "/settings",
            label: "Settings",
            icon: <Settings size={18} />,
          },
        ];
      case "ADMIN":
        return [
          {
            href: "/admin-dashboard",
            label: "Dashboard",
            icon: <LayoutDashboard size={18} />,
          },
          {
            href: "/manage-users",
            label: "Manage Users",
            icon: <Users size={18} />,
          },
          {
            href: "/orders",
            label: "Orders",
            icon: <ShoppingCart size={18} />,
          },
        ];
      case "USER":
        return [
          {
            href: "/orders",
            label: "My Orders",
            icon: <ShoppingCart size={18} />,
          },
          { href: "/me", label: "Profile", icon: <User size={18} /> },
        ];
      default:
        return [];
    }
  };

  const roleBasedRoutes = getRoutesForRole();

  return (
    menuOpen && (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute right-0 top-[3rem] w-56 bg-white shadow-lg rounded-lg z-[2200] border border-gray-200 overflow-hidden"
      >
        <div className="absolute top-[-10px] right-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-white"></div>

        <div className="flex flex-col text-gray-700">
          <Link
            href="/"
            className="flex items-center px-4 py-3 gap-2 hover:bg-gray-100 transition"
            onClick={closeMenu}
          >
            <Home size={18} />
            <span>Home</span>
          </Link>

          {roleBasedRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="flex items-center px-4 py-3 gap-2 hover:bg-gray-100 transition"
              onClick={closeMenu}
            >
              {route.icon}
              <span>{route.label}</span>
            </Link>
          ))}

          <Button
            onClick={() => {
              handleSignOut();
              closeMenu();
            }}
            className="flex items-center text-left w-full px-4 py-3 gap-2 hover:bg-red-50 text-red-600 transition"
          >
            <LogOut size={18} />
            <span>Sign out</span>
          </Button>
        </div>
      </motion.div>
    )
  );
};

export default UserMenu;
