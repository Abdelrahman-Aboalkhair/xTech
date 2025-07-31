"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import UserMenu from "../molecules/UserMenu";
import { Menu, X, CircleUserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/app/store/hooks";

const Navbar = () => {
  const pathname = usePathname();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  return (
    <>
      <header
        className={`w-full z-50 transition-all duration-300 bg-white bg-opacity-95 backdrop-blur-sm py-4 `}
      >
        <nav className="max-w-[80%] mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="font-semibold text-xl whitespace-nowrap text-gray-900"
          >
            SS-Ecommerce
          </Link>

          {/* Right section - Search, Cart, User */}
          <div className="flex items-center w-full justify-end">
            {/* <SearchBar /> */}

            {/* User Menu */}
            {isAuthenticated && user ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center focus:outline-none"
                  aria-label="User menu"
                >
                  {/* <div className="rounded-full overflow-hidden flex items-center justify-center bg-gray-200/70 p-3"> */}
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt="User Profile"
                      width={30}
                      height={30}
                      className="rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <CircleUserRound size={25} className="text-gray-800" />
                  )}
                  {/* </div> */}
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
                  className="text-md font-medium text-gray-800 whitespace-nowrap pl-4"
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
      </header>
    </>
  );
};

export default Navbar;
