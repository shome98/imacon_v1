"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User, Sun, Moon, LogOut, ShoppingCart, Menu, X, ImagePlus } from "lucide-react";
import { useNotification } from "./NotificationPopup";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <nav className="navbar bg-gray-500 shadow-md w-2/3 mx-auto mt-10 p-4 rounded-xl flex flex-row justify-between items-center">
        {/* Site Name */}
        <div className="navbar-start">
          <Link href="/" className="link text-xl font-semibold no-underline flex items-center gap-2">
            <Home size={24} />
            🛍️ ImaCon
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            type="button"
            className="btn btn-ghost btn-square"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`md:navbar-end md:flex md:items-center md:gap-4 ${
            isMenuOpen ? "block" : "hidden"
          } max-md:w-full max-md:mt-4`}
        >
          <ul className="flex flex-row gap-4 p-0 text-base">
            {session ? (
              <>
                <li>
                  <Link href="/check" className="flex items-center gap-2">
                    <ImagePlus size={20} />
                    Add Product
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="flex items-center gap-2">
                    <ShoppingCart size={20} />
                    Orders
                  </Link>
                </li>
                <li>
                  <button onClick={handleSignOut} className="flex items-center gap-2">
                    <LogOut size={20} />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login" className="flex items-center gap-2">
                    <User size={20} />
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="flex items-center gap-2">
                    <User size={20} />
                    Register
                  </Link>
                </li>
              </>
            )}
            <li>
              <button
                onClick={toggleDarkMode}
                className="btn btn-ghost btn-square"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}