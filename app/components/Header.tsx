// "use client";

// import Link from "next/link";
// import { useSession, signOut } from "next-auth/react";
// import { Home, User, Sun, Moon, LogOut, ShoppingCart, Menu, X, ImagePlus } from "lucide-react";
// import { useNotification } from "./NotificationPopup";
// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function Header() {
//   const { data: session } = useSession();
//   const { showNotification } = useNotification();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const router = useRouter();

//   const handleSignOut = async () => {
//     try {
//       await signOut();
//       router.push("/");
//       showNotification("Signed out successfully", "success");
//     } catch {
//       showNotification("Failed to sign out", "error");
//     }
//   };

//   const toggleDarkMode = () => {
//     setIsDarkMode(!isDarkMode);
//     document.documentElement.classList.toggle("dark", isDarkMode);
//   };

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <>
//       <nav className="navbar bg-gray-500 shadow-md w-2/3 mx-auto mt-10 p-4 rounded-xl flex flex-row justify-between items-center sticky top-0 z-50">
//         <div className="navbar-start">
//           <Link href="/" className="link text-xl font-semibold no-underline flex items-center gap-2">
//             <Home size={24} />
//             🛍️ ImaCon
//           </Link>
//         </div>

//         {/* Mobile Menu Toggle */}
//         <div className="md:hidden">
//           <button
//             type="button"
//             className="btn btn-ghost btn-square"
//             onClick={toggleMenu}
//             aria-label="Toggle navigation"
//           >
//             {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
//           </button>
//         </div>

//         {/* Navigation Links */}
//         <div
//           className={`absolute top-16 left-1/2 transform -translate-x-1/2 w-2/3 bg-gray-500 md:bg-transparent md:static md:flex md:items-center md:gap-4 transition-all duration-300 ease-in-out ${
//             isMenuOpen ? "flex flex-col items-center p-4 overflow-auto" : "hidden md:flex"
//           }`}
//         >
//           <ul className="flex flex-row gap-4 p-0 text-base">
//             {session ? (
//               <>
//                 {session.user.role === "Admin" && <li>
//                   <Link href="/admin" className="flex items-center gap-2">
//                     <ImagePlus size={20} />
//                     Add Product
//                   </Link>
//                 </li>}
                
//                 <li>
//                   <Link href="/orders" className="flex items-center gap-2">
//                     <ShoppingCart size={20} />
//                     Orders
//                   </Link>
//                 </li>
//                 <li>
//                   <button onClick={handleSignOut} className="flex items-center gap-2">
//                     <LogOut size={20} />
//                     Logout
//                   </button>
//                 </li>
//               </>
//             ) : (
//               <>
//                 <li>
//                   <Link href="/login" className="flex items-center gap-2">
//                     <User size={20} />
//                     Login
//                   </Link>
//                 </li>
//                 <li>
//                   <Link href="/register" className="flex items-center gap-2">
//                     <User size={20} />
//                     Register
//                   </Link>
//                 </li>
//               </>
//             )}
//             <li>
//               <button
//                 onClick={toggleDarkMode}
//                 className="btn btn-ghost btn-square"
//                 aria-label="Toggle dark mode"
//               >
//                 {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
//               </button>
//             </li>
//           </ul>
//         </div>
//       </nav>
//     </>
//   );
// }

"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User, Sun, Moon, LogOut, ShoppingCart, Menu, X, ImagePlus } from "lucide-react";
import { useNotification } from "./NotificationPopup";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
      showNotification("Signed out successfully", "success");
      setIsMenuOpen(false); 
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
      <nav className="bg-gray-500 shadow-md w-2/3 mx-auto mt-4 p-4 rounded-xl flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-semibold no-underline flex items-center gap-2">
            <Home size={24} />
            🛍️ ImaCon
          </Link>
        </div>

        {/* Mobile Menu Toggle Button */}
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

        {/* Desktop Menu */}
        <div className="hidden md:flex md:items-center md:gap-4">
          <ul className="flex flex-row gap-4 p-0 text-base text-white">
            {session ? (
              <>
                {session.user.role === "Admin" && (
                  <li>
                    <Link href="/admin" className="flex items-center gap-2">
                      <ImagePlus size={20} />
                      Add Product
                    </Link>
                  </li>
                )}
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

        {/* Mobile Dropdown (Auto-Closes on Click) */}
        {isMenuOpen && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-2/3 bg-gray-600 rounded-xl shadow-lg md:hidden p-4 transition-all duration-300 ease-in-out">
            <ul className="flex flex-col gap-4 text-white">
              {session ? (
                <>
                  {session.user.role === "Admin" && (
                    <li>
                      <Link href="/admin" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                        <ImagePlus size={20} />
                        Add Product
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link href="/orders" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
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
                    <Link href="/login" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                      <User size={20} />
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link href="/register" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                      <User size={20} />
                      Register
                    </Link>
                  </li>
                </>
              )}
              <li>
                <button
                  onClick={() => {
                    toggleDarkMode();
                    setIsMenuOpen(false);
                  }}
                  className="btn btn-ghost btn-square"
                  aria-label="Toggle dark mode"
                >
                  {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
}
