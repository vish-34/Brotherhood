import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL, saveAuth, getToken } from "../utils/auth";
import { useLike } from "../context/LikeContext";
import { useCart } from "../context/CartContext";
import Navbar from "../components/Navbar";

export default function Auth() {
  const navigate = useNavigate();
  const { toggleLike, hydrateLikes } = useLike();
  const { addToCart, hydrateCart } = useCart();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (getToken()) navigate("/");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? "login" : "signup";

    try {
      const res = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isLogin ? form : form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      saveAuth(data);
      

      /* 🔁 RESTORE USER DATA */
      const userRes = await fetch(`${API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const userData = await userRes.json();
      hydrateLikes(userData.likedProducts);
      hydrateCart(userData.cart);

      /* 🔁 REPLAY PREVIOUS ACTION */
      const pending = sessionStorage.getItem("postAuthAction");
      if (pending) {
        const { action, payload } = JSON.parse(pending);
        if (action === "LIKE") toggleLike(payload);
        if (action === "CART")
          addToCart(payload.product, payload.size);
        sessionStorage.removeItem("postAuthAction");
      }

      navigate("/");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex items-center flex-col bg-zinc-900 text-white">
    <img src="/logo.png" className="h-[4em] w-[7em]" alt="" />

    {/* Centered Auth Box */}
    <main className="flex flex-1 items-center justify-center px-6 pt-28">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-10 shadow-[0_0_25px_rgba(212,175,55,0.08)]"
      >
        <h1 className="text-4xl font-serif mb-8 text-center">
          {isLogin ? "Welcome Back" : "Create Premium Account"}
        </h1>

        {!isLogin && (
          <input
            placeholder="Name"
            className="w-full mb-4 p-3 bg-zinc-800 rounded-lg focus:ring-1 focus:ring-[#d4af37] outline-none transition"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        )}

        <input
          placeholder="Email"
          className="w-full mb-4 p-3 bg-zinc-800 rounded-lg focus:ring-1 focus:ring-[#d4af37] outline-none transition"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 bg-zinc-800 rounded-lg focus:ring-1 focus:ring-[#d4af37] outline-none transition"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full py-3 bg-[#d4af37] text-black font-semibold rounded-full hover:opacity-90 transition shadow-[0_0_15px_rgba(212,175,55,0.3)]">
          {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
        </button>

        <p className="text-center mt-6 text-zinc-400">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#d4af37] font-semibold"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </form>
    </main>

    {/* Premium Brand Logos Section */}
    <footer className="py-10 border-t">
      <h2 className="text-center font-serif text-xl mb-6 text-[#d4af37]">
        Trusted by Premium Brands
      </h2>

    </footer>
  </div>
);
}