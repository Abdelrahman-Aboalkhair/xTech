"use client";
import React, { useMemo } from "react";
import useStorage from "@/app/hooks/state/useStorage";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  CreditCard,
  Layers,
  MapPin,
  LocateIcon,
  Users,
  BarChart3,
  ServerCog,
  LogOut,
  PanelsRightBottom,
} from "lucide-react";
import Link from "next/link";
import { useSignOutMutation } from "@/app/store/apis/AuthApi";
import { useAppDispatch } from "@/app/store/hooks";
import { clearUser } from "@/app/store/slices/AuthSlice";

const Sidebar = () => {
  const [signout] = useSignOutMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useStorage<boolean>("sidebarOpen", true, "local");

  const sidebarLinks = useMemo(
    () => [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Products", href: "/products", icon: Package },
      { name: "Orders", href: "/orders", icon: ShoppingCart },
      { name: "Payments", href: "/payments", icon: CreditCard },
      { name: "Categories", href: "/categories", icon: Layers },
      { name: "Addresses", href: "/addresses", icon: MapPin },
      { name: "Tracking Detail", href: "/tracking-detail", icon: LocateIcon },
      { name: "Users", href: "/users", icon: Users },
      { name: "Analytics", href: "/analytics", icon: BarChart3 },
      { name: "Webhook logs", href: "/webhook-logs", icon: ServerCog },
    ],
    []
  );
  // Function to prepend '/dashboard' if not present in the href
  const prependDashboard = (href: string) => {
    if (!href.startsWith("/dashboard")) {
      return `/dashboard${href}`;
    }
    return href;
  };

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

  return (
    <>
      {/* Sidebar */}
      <motion.aside
        initial={{ width: 80 }}
        animate={{
          width: isOpen ? 260 : 80,
          transition: { duration: 0.3, ease: "easeInOut" },
        }}
        className="bg-white border-r border-gray-200 shadow-lg h-full flex flex-col p-4 justify-between"
      >
        <div>
          {/* Toggle button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="mb-6 flex items-center justify-end p-2 rounded-lg transition"
          >
            <PanelsRightBottom size={24} className="text-gray-700" />
          </button>

          {/* Sidebar links */}
          <nav className="flex flex-col space-y-1">
            {sidebarLinks.slice(0, 3).map(({ name, href, icon: Icon }) => {
              const isActive = pathname === prependDashboard(href);
              return (
                <Link
                  key={name}
                  href={prependDashboard(href)}
                  prefetch={true}
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
            })}

            {/* Section divider */}
            <hr className="my-3 border-t border-gray-200" />

            {sidebarLinks.slice(3, 7).map(({ name, href, icon: Icon }) => {
              const isActive = pathname === prependDashboard(href);
              return (
                <Link
                  key={name}
                  href={prependDashboard(href)}
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
            })}

            {/* Another divider */}
            <hr className="my-3 border-t border-gray-200" />

            {sidebarLinks.slice(7).map(({ name, href, icon: Icon }) => {
              const isActive = pathname === prependDashboard(href);
              return (
                <Link
                  key={name}
                  href={prependDashboard(href)}
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
            })}
          </nav>
        </div>

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
    </>
  );
};

export default Sidebar;
