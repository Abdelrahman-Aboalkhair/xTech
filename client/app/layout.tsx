"use client"; // Mark as a client-side component

import { useTheme } from "./context/ThemeContext"; // Adjust the import path
import { Poppins } from "next/font/google"; // Google font integration
import "./globals.css"; // Global styles
import StoreProvider from "./StoreProvider";
import SessionWrapper from "./SessionWrapper";
import { useEffect } from "react";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useTheme();

  useEffect(() => {
    if (theme) {
      // Apply the dynamic theme values from context to CSS variables
      document.documentElement.style.setProperty(
        "--primary",
        theme.primaryColor
      );
      document.documentElement.style.setProperty(
        "--secondary",
        theme.secondaryColor
      );
      document.documentElement.style.setProperty(
        "--font-poppins",
        theme.fontFamily
      );
    }
  }, [theme]);

  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        <StoreProvider>
          <SessionWrapper>{children}</SessionWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
