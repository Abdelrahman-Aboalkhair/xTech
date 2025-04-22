"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import UserMenu from "../molecules/UserMenu";
import { User, ShoppingCart, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import SearchBar from "../molecules/SearchBar";
import useQueryParams from "@/app/hooks/network/useQueryParams";
import { useGetCartCountQuery } from "@/app/store/apis/CartApi";
import Topbar from "./Topbar";
import { useGetMeQuery } from "@/app/store/apis/UserApi";

const publicRoutes = ["/sign-in", "/sign-up", "/about", "/contact"];

const Navbar = () => {
  const { updateQuery } = useQueryParams();
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.includes(pathname);
  const isLoggedOut = localStorage.getItem("isLoggedOut") === "true";
  const { data } = useGetMeQuery(undefined, {
    skip: isPublicRoute || isLoggedOut,
  });
  const user = data?.user;

  const { data: cartData, error: cartError } = useGetCartCountQuery(undefined);
  console.log("cartError => ", cartError);
  console.log("cartData => ", cartData);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onSearch = (data) => {
    const query = new URLSearchParams();
    query.set("searchQuery", data.searchQuery);
    if (pathname !== "/shop") {
      window.location.href = `/shop?${query.toString()}`;
    } else {
      updateQuery({ searchQuery: data.searchQuery });
    }
    setShowSearch(false);
  };

  return (
    <>
      <Topbar />
      <header
        className={`w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-md py-2"
            : "bg-white bg-opacity-95 backdrop-blur-sm py-4"
        }`}
      >
        <nav className="max-w-[80%] mx-auto flex items-center justify-between">
          <div className="flex justify-between items-center gap-8">
            <Link href="/" className="flex items-center">
              <span className="font-bold text-2xl text-gray-900 hover:text-indigo-600 transition-colors duration-200">
                Kgkraft
              </span>
            </Link>

            <Link
              href="/"
              className={`relative text-gray-700 hover:text-indigo-600 font-medium text-sm transition-colors duration-200 py-2 ${
                pathname === "/"
                  ? "after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-indigo-600"
                  : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`relative text-gray-700 hover:text-indigo-600 font-medium text-sm transition-colors duration-200 py-2 ${
                pathname === "/about"
                  ? "after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-indigo-600"
                  : ""
              }`}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className={`relative text-gray-700 hover:text-indigo-600 font-medium text-sm transition-colors duration-200 py-2 ${
                pathname === "/contact"
                  ? "after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:bg-indigo-600"
                  : ""
              }`}
            >
              Contact Us
            </Link>
          </div>

          {/* Right section - Search, Cart, User */}
          <div className="flex items-center space-x-4 md:space-x-6">
            <SearchBar onSearch={onSearch} />

            <Link
              href="/cart"
              className="relative text-gray-700 hover:text-indigo-600 transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={25} />
              {cartData?.cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {cartData?.cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {!isLoggedOut && user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center focus:outline-none"
                  aria-label="User menu"
                >
                  <div className="rounded-full overflow-hidden flex items-center justify-center bg-gray-100">
                    {user?.avatar ? (
                      <Image
                        src={user.avatar}
                        alt="User Profile"
                        width={50}
                        height={50}
                        className="rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <User size={20} className="text-gray-800" />
                    )}
                  </div>
                </button>

                {menuOpen && (
                  <UserMenu
                    user={user}
                    menuOpen={menuOpen}
                    closeMenu={() => setMenuOpen(false)}
                  />
                )}
              </div>
            ) : (
              pathname !== "/sign-up" &&
              pathname !== "/sign-in" && (
                <Link
                  href="/sign-in"
                  className="hidden sm:inline-flex whitespace-nowrap items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition-all duration-200"
                >
                  Sign in
                </Link>
              )
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-indigo-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        {/* Mobile Navigation Menu */}
        <div
          className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        />

        <div
          className={`fixed right-0 top-0 h-full w-64 bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out md:hidden ${
            mobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <span className="font-bold text-lg">Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="py-4 px-4 space-y-4">
            <Link
              href="/"
              className={`block py-2 px-4 rounded-md ${
                pathname === "/"
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-gray-800"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`block py-2 px-4 rounded-md ${
                pathname === "/about"
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-gray-800"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className={`block py-2 px-4 rounded-md ${
                pathname === "/contact"
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-gray-800"
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Us
            </Link>

            <div className="pt-4 mt-4 border-t border-gray-200">
              {!user && (
                <Link
                  href="/sign-in"
                  className="block w-full py-2 px-4 bg-indigo-600 text-white text-center rounded-md hover:bg-indigo-700 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
