import { useEffect } from "react";
import Navbar from "../components/Navbar.jsx";

export default function PaymentSuccess() {

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);

    const blockBack = () => {
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", blockBack);

    return () => {
      window.removeEventListener("popstate", blockBack);
    };
  }, []);

  return (
    <div className="bg-zinc-900 min-h-screen text-center text-white pt-32">
      <Navbar />
      <h1 className="text-4xl text-[#d4af37] font-serif mb-4">Payment Successful!</h1>
      <p className="text-zinc-400">Order stored in database ✔</p>
    </div>
  );
}
