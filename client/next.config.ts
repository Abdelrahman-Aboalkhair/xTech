import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "m.media-amazon.com", // Amazon images
      "www.bestbuy.com", // Best Buy images
      "www.dyson.com", // Dyson images
      "store.hp.com", // HP images
      "i1.adis.ws", // Canon images
      "i5.walmartimages.com", // Walmart images,
      "lh3.googleusercontent.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "www.bestbuy.com",
        pathname: "/site/**",
      },
      {
        protocol: "https",
        hostname: "www.dyson.com",
        pathname: "/content/dam/dyson/**",
      },
      {
        protocol: "https",
        hostname: "store.hp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i1.adis.ws",
        pathname: "/i/canon/**",
      },
      {
        protocol: "https",
        hostname: "i5.walmartimages.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
