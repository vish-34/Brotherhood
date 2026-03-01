import { useState, useEffect, useRef } from "react";
import {
  Search,
  Heart,
  User,
  ShoppingBag,
  Menu,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getToken, logout } from "../utils/auth";
import { useLike } from "../context/LikeContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const accountRef = useRef(null);
  const isLoggedIn = !!getToken();

  const { clearLikes } = useLike();
  const { cart, clearCart } = useCart();

  /* Total cart quantity */
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  /* Scroll effect */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Close account dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Logout */
  const handleLogout = () => {
    logout();
    clearLikes();
    clearCart();
    setAccountOpen(false);
    navigate("/");
  };

  const homePage = () => {
    navigate("/");
  }

  return (
    <>
      {/* Overlay for search */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"></div>
      )}

      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled || searchOpen
            ? "bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-800"
            : "bg-transparent"
          }`}
      >
        <div className="flex items-center justify-between px-4 md:px-12 py-4 text-zinc-100">

          {/* Menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hover:text-accent transition"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 ">
            <img src="/logo.png" onClick={homePage} className="h-[4em] -mt-1 opacity-90" alt="Logo" />
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-6 ml-auto relative">

            <button onClick={() => setSearchOpen(true)}>
              <Search size={20} />
            </button>

            <button onClick={() => navigate("/likes")} className="hidden sm:block">
              <Heart size={20} />
            </button>

            {/* Account Dropdown */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="hover:text-accent transition"
              >
                <User size={20} />
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-3 w-40 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-xl animate-fadeDown">
                  {isLoggedIn ? (
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 text-left hover:bg-zinc-800 transition text-sm"
                    >
                      Logout
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setAccountOpen(false);
                        navigate("/auth");
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-zinc-800 transition text-sm"
                    >
                      Login
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Cart */}
            <button onClick={() => navigate("/cart")} className="relative">
              <ShoppingBag size={20} />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-accent text-zinc-900 text-[10px] font-semibold min-w-[16px] h-4 px-[3px] rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="bg-zinc-950 border-t border-zinc-800 py-8 animate-fadeDown">
            <ul className="flex flex-col items-center gap-6 font-serif text-lg">

              {[
                { label: "Home", path: "/" },
                { label: "Collection", path: "/collection" },
                { label: "Cart", path: "/cart" },
                { label: "Likes", path: "/likes" },
              ].map((item) => (
                <li
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);  // ✔ redirect to page
                    setMenuOpen(false);   // ✔ close menu after click
                  }}
                  className="hover:text-[#d4af37] cursor-pointer transition"
                >
                  {item.label}
                </li>
              ))}

            </ul>
          </div>
        )}

      </nav>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeDown {
            animation: fadeDown 0.3s ease-out forwards;
          }
          .text-accent, .bg-accent {
            color: #d4af37;
          }
          .bg-accent {
            background-color: #d4af37;
          }
        `}
      </style>
    </>
  );
}
