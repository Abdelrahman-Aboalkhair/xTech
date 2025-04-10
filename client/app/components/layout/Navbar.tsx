import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import UserMenu from "../molecules/UserMenu";
import { User, ShoppingCart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import SearchBar from "../atoms/SearchBar";
import useQueryParams from "@/app/hooks/network/useQueryParams";
import { useGetCartQuery } from "@/app/store/apis/CartApi";
import { useAppSelector } from "@/app/store/hooks";
import { useGetAllPagesQuery } from "@/app/store/apis/PageApi";

const Navbar = () => {
  const { data: pagesData, isLoading } = useGetAllPagesQuery({});
  const { updateQuery } = useQueryParams();
  const { user } = useAppSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { data } = useGetCartQuery({});
  const cartItemCount = data?.cart?.cartItems?.length || 0;

  const onSearch = (data: { searchQuery: string }) => {
    const query = new URLSearchParams();
    query.set("searchQuery", data.searchQuery);
    if (pathname !== "/shop") {
      router.push(`/shop?${query.toString()}`);
    } else {
      updateQuery({ searchQuery: data.searchQuery });
    }
  };

  const navbarPages =
    pagesData?.pages?.filter(
      (page: any) => page.showInNavbar && page.isPublished
    ) || [];

  return (
    <nav className="flex justify-between items-center px-[3.5%] pt-6">
      <Link className="font-semibold text-2xl" href="/">
        Kgkraft
      </Link>

      <div className="flex items-center justify-center gap-12 text-[16px]">
        {isLoading ? (
          <span>Loading pages...</span>
        ) : navbarPages.length > 0 ? (
          navbarPages.map((page: any) => (
            <Link
              key={page.id}
              className={
                pathname === `/${page.slug}`
                  ? "border-b-2 border-[var(--primary)]"
                  : ""
              }
              href={`/${page.slug}`}
            >
              {page.slug === "landing" ? "Home" : page.title}{" "}
              {/* Replace landing with Home */}
            </Link>
          ))
        ) : (
          <span>No pages available</span>
        )}
      </div>

      <div className="flex items-center gap-10">
        <SearchBar onSearch={onSearch} />
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
              className="bg-gray-800 text-white px-[1.5rem] font-medium py-[9px] text-[16px] rounded hover:opacity-90"
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
