import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12 px-8 mt-[2rem]">
      <div className="max-w-[98%] mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between mb-8 border-b border-gray-700 pb-8">
          <h2 className="text-3xl font-bold text-white px-6">kgkraft</h2>
          <p className="text-gray-300 max-w-lg text-center md:text-left mt-4 md:mt-0 px-6">
            Discover high-quality, handcrafted products at kgkraft. Shop with
            confidence and enjoy premium selections tailored just for you.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              title: "Shop",
              links: [
                "New Arrivals",
                "Best Sellers",
                "Categories",
                "Gift Cards",
              ],
            },
            {
              title: "Company",
              links: ["About Us", "Careers", "Blog", "Contact"],
            },
            {
              title: "Help",
              links: [
                "FAQs",
                "Shipping & Returns",
                "Order Tracking",
                "Support",
              ],
            },
          ].map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-lg text-white mb-3">
                {section.title}
              </h3>
              <ul className="text-gray-400 space-y-2">
                {section.links.map((link, idx) => (
                  <li key={idx}>
                    <a href="#" className="hover:text-white transition">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-semibold text-lg text-white mb-3">
              Stay Updated
            </h3>
            <p className="text-gray-400 mb-3">
              Subscribe to get exclusive offers and updates on new arrivals.
            </p>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="p-3 bg-gray-800 border border-gray-700 rounded-md text-white"
              />
              <button className="bg-primary hover:bg-primary-dark transition text-white py-3 rounded-md">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} kgkraft. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            {["Facebook", "Twitter", "Instagram"].map((social, index) => (
              <a key={index} href="#" className="hover:text-white transition">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
