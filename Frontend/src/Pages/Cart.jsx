import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "../context/CartContext.jsx";
import Navbar from "../components/Navbar.jsx";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function Cart() {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;

      // Call your backend API
     const res = await fetch(`${import.meta.env.VITE_API_URL}/api/create-checkout-session`, {

        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }),
      });

      const { url } = await res.json();

      // Redirect to Stripe
      window.location = url;
    } catch (err) {
      console.error("Stripe error:", err);
    }
  };

  return (
    <div className="bg-zinc-900 min-h-screen text-zinc-100">
      <Navbar />

      <section className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
        <h1 className="text-5xl font-serif mb-12">Your Cart</h1>

        {cart.length === 0 ? (
          <p className="text-zinc-400">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-8">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex gap-6 border-b border-zinc-800 pb-6"
                >
                  <img
                    src={item.image}
                    className="w-32 h-40 object-cover rounded-xl"
                    alt={item.name}
                  />

                  <div className="flex-1">
                    <h3 className="text-xl font-serif">{item.name}</h3>
                    <p className="text-zinc-400 text-sm">Size: {item.size}</p>
                    <p className="text-[#d4af37] mt-2">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="text-zinc-400 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-16 flex justify-between items-center">
              <p className="text-2xl font-serif">
                Total: <span className="text-[#d4af37]">₹{total}</span>
              </p>

              <button
                onClick={handleCheckout}
                className="px-10 py-4 bg-[#d4af37] text-black rounded-full font-semibold"
              >
                Checkout
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
