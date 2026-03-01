import { useState, useEffect } from "react";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";

export default function StickyImages() {
  const [foregroundOpacity, setForegroundOpacity] = useState(1);

  const navigate = useNavigate();
  const handleclick = () => {
    navigate('/collection');
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const fadeStart = 0;
      const fadeEnd = window.innerHeight * 0.5;

      if (scrollPosition <= fadeStart) {
        setForegroundOpacity(1);
      } else if (scrollPosition >= fadeEnd) {
        setForegroundOpacity(0);
      } else {
        const opacity =
          1 - (scrollPosition - fadeStart) / (fadeEnd - fadeStart);
        setForegroundOpacity(opacity);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-zinc-900 text-zinc-100">
      <Navbar />

      {/* Sticky Images Hero Section */}
      <section className="relative h-[300vh]">
        <div className="flex flex-col">
          <img
            src="bg1.jpg"
            alt=""
            className="h-screen w-full object-cover z-0 sticky top-0"
          />
          <img
            src="bg2.jpg"
            alt=""
            className="h-screen w-full object-cover z-0 sticky top-0"
          />
          <img
            src="bg3.jpg"
            alt=""
            className="h-screen w-full object-cover z-0 sticky top-0"
          />
        </div>

        <div
          className="absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-300 pointer-events-none"
        // style={{ opacity: foregroundOpacity }}
        >
          <h1 className="text-6xl md:text-8xl font-serif tracking-wide text-center text-white">
            Crafted for the Bold.
          </h1>
        </div>
      </section>

      {/* Quote Section */}
      <section className="h-screen flex items-center justify-center bg-red-600 text-zinc-100 px-8">
        <h2 className="text-4xl md:text-6xl text-center font-serif leading-tight opacity-0 animate-fadeIn">
          "Luxury isn't bought — it's felt."
        </h2>
      </section>

      {/* Featured Collection */}
      <section className="min-h-screen bg-zinc-900 py-24 px-6 md:px-16">
        <h3 className="text-3xl md:text-5xl font-serif text-center mb-16 opacity-0 animate-fadeIn">
          Featured Collection
        </h3>
        <div className="grid md:grid-cols-3 gap-10">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="relative group cursor-pointer transform transition-transform duration-300 hover:scale-105"
            >
              <img
                src={`/product${item}.jpg`}
                alt={`Product ${item}`}
                className="w-full h-[450px] object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all rounded-2xl flex items-center justify-center">
                <p onClick={handleclick} className="text-accent text-lg font-medium">Explore &gt;</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="h-screen flex flex-col items-center justify-center bg-zinc-100 text-zinc-900">
        <h4 className="text-5xl font-serif mb-8 opacity-0 justify-center text-center animate-fadeIn">
          Join the Neighborhood
        </h4>
        <button onClick={handleclick} className="px-8 py-4 bg-red-600 text-zinc-100 text-lg rounded-full font-semibold transform transition-transform duration-300 hover:scale-105">
          Explore Collection
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-800 py-20 px-8 md:px-20">
        <div className="grid md:grid-cols-4 gap-12 text-zinc-400">
          {/* Brand */}
          <div>
            <img
              src="/logo.png"
              alt="Logo"
              className="h-10 mb-6 opacity-90"
            />
            <p className="text-sm leading-relaxed">
              Redefining modern luxury — curated collections crafted with
              precision and soul. Experience the bold.
            </p>
          </div>

          {/* Links */}
          <div>
            <h5 className="text-lg text-zinc-100 font-serif mb-4">Explore</h5>
            <ul className="space-y-2">
              {[
                { label: "Home", path: "/" },
                { label: "Collection", path: "/collection" },
                { label: "Cart", path: "/cart" },
                { label: "Liked", path: "/likes" },
            
              ].map((link) => (
                <li
                  key={link.label}
                  onClick={() => navigate(link.path)} // ✅ navigation added
                  className="hover:text-[#d4af37] cursor-pointer transition"
                >
                  {link.label}
                </li>
              ))}
            </ul>
          </div>


          {/* Support */}
          <div>
            <h5 className="text-lg text-zinc-100 font-serif mb-4">Support</h5>
            <ul className="space-y-2">
              {["Contact Us", "Shipping", "Returns", "Privacy Policy", "Terms"].map(
                (link) => (
                  <li
                    key={link}
                    className="hover:text-accent cursor-pointer transition"
                  >
                    {link}
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-lg text-zinc-100 font-serif mb-4">Stay Updated</h5>
            <p className="text-sm mb-4">
              Be first to know about exclusive drops & limited collections.
            </p>
            <div className="flex border-b border-zinc-700 pb-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent w-full outline-none text-zinc-100 placeholder-zinc-500"
              />
              <button className="text-accent font-medium hover:opacity-80 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-12 pt-8 text-center text-sm text-zinc-600">
          © {new Date().getFullYear()} Bold Luxury. All rights reserved.
        </div>
      </footer>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn {
            animation: fadeIn 1s ease-out forwards;
          }
          .text-accent {
            color: #d4af37;
          }
        `}
      </style>
    </div>
  );
}
