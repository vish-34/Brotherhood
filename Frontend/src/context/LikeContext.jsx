import { createContext, useContext, useState } from "react";

const LikeContext = createContext();

export const LikeProvider = ({ children }) => {
  const [likes, setLikes] = useState([]);

  const toggleLike = (product) => {
    setLikes((prev) => {
      const exists = prev.find((p) => p.id === product.id);
      return exists
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product];
    });
  };

  const isLiked = (id) => likes.some((p) => p.id === id);

  const hydrateLikes = (likesFromDB) => setLikes(likesFromDB || []);
  const clearLikes = () => setLikes([]);

  return (
    <LikeContext.Provider
      value={{ likes, toggleLike, isLiked, hydrateLikes, clearLikes }}
    >
      {children}
    </LikeContext.Provider>
  );
};

export const useLike = () => useContext(LikeContext);
