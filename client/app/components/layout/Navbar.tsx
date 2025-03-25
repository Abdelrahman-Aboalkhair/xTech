"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAppSelector } from "@/app/store/hooks";
import Image from "next/image";
import UserMenu from "../molecules/UserMenu";
import { User, Search, ShoppingCart } from "lucide-react";
import { useForm } from "react-hook-form";
import { usePathname } from "next/navigation";

type SearchFormValues = {
  searchQuery: string;
};

const Navbar = () => {
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);
  console.log("isLoggedIn: ", isLoggedIn);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const pathname = usePathname();

  // React Hook Form setup
  const { register, handleSubmit, reset } = useForm<SearchFormValues>({
    defaultValues: {
      searchQuery: "",
    },
  });

  // Handle search submission
  const onSearch = (data: SearchFormValues) => {
    console.log("Search query:", data.searchQuery);
    // Here you would typically implement search functionality
    // e.g., redirect to search results page or filter content
    reset();
  };

  // For demonstration purposes - listening for clicks outside menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    setCartItemCount(3);
  }, []);

  return (
    <nav className="flex justify-between items-center px-[10%] pt-6">
      <Link className="font-semibold text-2xl" href="/">
        KgKraft
      </Link>

      <div className="flex items-center justify-center gap-12 text-[16px]">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
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

        {isLoggedIn ? (
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
              href="/sign-up"
            >
              Sign up
            </Link>
          )
        )}
      </div>
    </nav>
  );
};

export default Navbar;
