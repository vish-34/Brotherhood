import Navbar from "../components/Navbar.jsx";
import { useLike } from "../context/LikeContext.jsx";

export default function Likes() {
  const { likes } = useLike();

  return (
    <div className="bg-zinc-900 min-h-screen text-zinc-100">
      <Navbar />

      <section className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
        <h1 className="text-5xl font-serif mb-12">Your Likes</h1>

        {likes.length === 0 ? (
          <p className="text-zinc-400">You haven’t liked any products yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {likes.map((item) => (
              <div key={item.id}>
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-[420px] object-cover rounded-2xl"
                />
                <h3 className="mt-4 text-xl font-serif">{item.name}</h3>
                <p className="text-[#d4af37] mt-1">₹{item.price}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
