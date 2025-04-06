"use client";
import React, { useState, useRef, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import UserMenu from "../molecules/UserMenu";
import { User, Search, ShoppingCart } from "lucide-react";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";
import { useGetUserCartQuery } from "@/app/store/apis/CartApi";
import { useAuth } from "@/app/context/AuthContext";
import AppLogo from "@/app/assets/images/kgKraftLogo.png";

type SearchFormValues = {
  searchQuery: string;
};

const Navbar = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data } = useGetUserCartQuery({});
  console.log("data: ", data);
  const cartItemCount = useMemo(() => {
    return data?.cart?.cartItems?.length || 0;
  }, [data]);
  console.log("cartItemCount: ", cartItemCount);
  const pathname = usePathname();

  const { register, handleSubmit, reset } = useForm<SearchFormValues>({
    defaultValues: {
      searchQuery: "",
    },
  });

  const onSearch = (data: SearchFormValues) => {
    console.log("Search query:", data.searchQuery);

    reset();
  };

  return (
    <nav className="flex justify-between items-center px-[10%] pt-6 pb-[2rem]">
      <Link className="font-semibold text-2xl" href="/">
        <Image
          className="rounded-full"
          src={AppLogo}
          alt="App Logo"
          width={70}
        />
      </Link>

      <div className="flex items-center justify-center gap-12 text-[16px]">
        <Link
          className={
            pathname === "/" ? "border-b-2 border-[var(--primary)]" : ""
          }
          href="/"
        >
          Home
        </Link>
        <Link
          className={
            pathname === "/about" ? "border-b-2 border-[var(--primary)]" : ""
          }
          href="/about"
        >
          About
        </Link>
        <Link
          className={
            pathname === "/contact" ? "border-b-2 border-[var(--primary)]" : ""
          }
          href="/contact"
        >
          Contact
        </Link>
      </div>

      <div className="flex items-center gap-10">
        <form onSubmit={handleSubmit(onSearch)} className="relative">
          <input
            type="text"
            placeholder="What're you looking for?"
            className="py-[15px] pl-6 pr-16 rounded-md bg-[#F5F5F5] focus:outline-none focus:border-transparent"
            {...register("searchQuery")}
          />
          <button
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <Search size={25} />
          </button>
        </form>

        <Link href="/cart" className="relative">
          <ShoppingCart size={32} />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </Link>

        {user ? (
          <div className="relative flex items-center gap-8" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
            >
              {user?.avatar ? (
                <Image
                  src={user?.avatar}
                  alt="User Profile"
                  className="rounded-full cursor-pointer"
                  width={40}
                  height={40}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ) : (
                <User
                  size={40}
                  className="rounded-full cursor-pointer bg-gray-200 p-2"
                />
              )}
            </button>

            {menuOpen && (
              <UserMenu
                menuOpen={menuOpen}
                closeMenu={() => setMenuOpen(false)}
              />
            )}
          </div>
        ) : (
          pathname !== "/sign-up" &&
          pathname !== "/sign-in" && (
            <Link
              className="bg-gray-800 text-white 
          px-[1.5rem] font-medium py-[9px] text-[16px] rounded hover:opacity-90"
              href="/sign-in"
            >
              Sign in
            </Link>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;
