"use client";
import React, { useState } from "react";
import Header from "./_components/Header";
import { Toaster } from "@/components/ui/sonner";

import { UpdateCartContext } from "./_components/_context/UpdateCartContext";

export const Provider = ({ children }) => {
  const [cartItems, setCartItems] = useState();

  return (
    <UpdateCartContext.Provider value={{ cartItems, setCartItems }}>
      <Header />
      <Toaster />
      {children}
    </UpdateCartContext.Provider>
  );
};

export default Provider;
