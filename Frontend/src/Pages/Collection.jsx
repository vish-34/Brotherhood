import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useLike } from "../context/LikeContext.jsx";
import { getToken, authFetch } from "../utils/auth";

const productsData = [
  { id: 1, name: "Midnight Jacket", category: "Jackets", price: 8999, image: "/product1.jpg" },
  { id: 2, name: "Velvet Shirt", category: "Shirts", price: 4999, image: "/product2.jpg" },
  { id: 3, name: "Obsidian Pants", category: "Pants", price: 6999, image: "/product3.jpg" },
  { id: 4, name: "Noir Hoodie", category: "Hoodies", price: 5999, image: "/product4.jpg" },
  { id: 5, name: "Signature Coat", category: "Jackets", price: 12999, image: "/product5.jpg" },
  { id: 6, name: "Essential Tee", category: "Shirts", price: 2999, image: "/product6.jpg" },
];

const sizes = ["S", "M", "L", "XL"];

export default function Collection() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleLike, isLiked } = useLike();

  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState(15000);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  /* =========================
     AUTH GUARD
  ========================= */
  const requireAuth = (action, payload) => {
    if (!getToken()) {
      sessionStorage.setItem(
        "postAuthAction",
        JSON.stringify({ action, payload })
      );
      navigate("/auth");
      return false;
    }
    return true;
  };

  /* =========================
     RESUME ACTION AFTER LOGIN
  ========================= */
  useEffect(() => {
    const pending = sessionStorage.getItem("postAuthAction");
    if (!pending || !getToken()) return;

    const { action, payload } = JSON.parse(pending);

    if (action === "LIKE") {
      handleLike(payload, true);
    }

    if (action === "CART") {
      setSelectedProduct(payload.product);
      setSelectedSize(payload.size);
      handleAddToCart(true);
    }

    sessionStorage.removeItem("postAuthAction");
  }, []);

  /* =========================
     HANDLERS
  ========================= */
  const handleLike = async (product, skipAuth = false) => {
    if (!skipAuth && !requireAuth("LIKE", product)) return;

    await authFetch("/user/like", {
      method: "POST",
      body: JSON.stringify({ product }),
    });

    toggleLike(product);
  };

  const handleAddToCart = async (skipAuth = false) => {
    if (
      !skipAuth &&
      !requireAuth("CART", { product: selectedProduct, size: selectedSize })
    )
      return;

    await authFetch("/user/cart", {
      method: "POST",
      body: JSON.stringify({
        product: selectedProduct,
        size: selectedSize,
      }),
    });

    addToCart(selectedProduct, selectedSize);
    setSelectedProduct(null);
  };

  const filteredProducts = productsData.filter(
    (item) =>
      (category === "All" || item.category === category) &&
      item.price <= priceRange
  );

  return (
    <div className="bg-zinc-900 text-zinc-100 min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="py-24 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-serif mb-4">The Collection</h1>
        <p className="text-zinc-400 max-w-xl mx-auto">
          Curated pieces crafted for bold expression and timeless presence.
        </p>
      </section>

      {/* Main */}
      <section className="px-6 md:px-16 pb-32 grid md:grid-cols-[280px_1fr] gap-16">

        {/* Filters */}
        <aside className="sticky top-28 h-fit border border-zinc-800 rounded-2xl p-8">
          <h2 className="text-2xl font-serif mb-8">Filters</h2>

          {["All", "Jackets", "Shirts", "Pants", "Hoodies"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`w-full text-left px-4 py-2 rounded-lg mb-2 ${
                category === cat
                  ? "bg-[#d4af37] text-black"
                  : "hover:bg-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </aside>

        {/* Products */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredProducts.map((item) => (
            <div key={item.id} className="group hover:scale-105 transition">

              <div className="relative rounded-2xl overflow-hidden">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(item);
                  }}
                  className="absolute top-4 right-4 z-10"
                >
                  <span
                    className={`text-2xl ${
                      isLiked(item.id) ? "text-red-500" : "text-transparent"
                    }`}
                    style={{
                      WebkitTextStroke: isLiked(item.id) ? "0" : "1.5px white",
                    }}
                  >
                    ♥
                  </span>
                </button>

                <img src={item.image} className="h-[420px] w-full object-cover" />

                <div
                  onClick={() => {
                    setSelectedProduct(item);
                    setSelectedSize(null);
                  }}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer"
                >
                  <span className="text-[#d4af37]">View Details →</span>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-serif text-xl">{item.name}</h4>
                <p className="text-zinc-400 text-sm">{item.category}</p>
                <p className="text-[#d4af37] mt-1">₹{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-6">
          <div className="bg-zinc-900 max-w-6xl w-full rounded-2xl p-12 relative">

            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-6 text-2xl"
            >
              ✕
            </button>

            <div className="grid md:grid-cols-2 gap-14">
              <img src={selectedProduct.image} className="max-h-[650px] object-contain" />

              <div className="flex flex-col">
                <h2 className="text-4xl font-serif">{selectedProduct.name}</h2>
                <p className="text-[#d4af37] text-xl mb-6">₹{selectedProduct.price}</p>

                <div className="flex gap-3 mb-12">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-2 border rounded ${
                        selectedSize === size
                          ? "border-[#d4af37] text-[#d4af37]"
                          : "border-zinc-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <button
                  disabled={!selectedSize}
                  onClick={handleAddToCart}
                  className="mt-auto py-4 bg-[#d4af37] text-black rounded-full"
                >
                  Add to Cart
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
