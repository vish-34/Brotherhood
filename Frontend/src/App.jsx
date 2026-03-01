import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

import Home from './Pages/Home.jsx'
import Collection from './Pages/Collection.jsx'
import Cart from "./Pages/Cart.jsx";
import Likes from "./Pages/Likes.jsx";
import Auth from "./Pages/Auth.jsx";
import PaymentSuccess from "./pages/PaymentSuccess";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); 
  }, [pathname]);

  return null;
}

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/likes" element={<Likes />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
