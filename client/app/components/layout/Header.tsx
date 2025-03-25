"use client";
import Navbar from "./Navbar";
import Topbar from "./Topbar";

const Header = () => {
  return (
    <header>
      <Topbar />
      <Navbar />
      <div className="h-px w-full bg-gray-200 mt-6" />
    </header>
  );
};

export default Header;
