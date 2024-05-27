import { db } from "../data/db";
import { useEffect, useState, useMemo } from "react";
import type { Guitar, CardItem } from "../types";

export const useCart = () => {
  const initialCart = (): CardItem[] => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const MIN_ITEMS = 1;
  const MAX_ITEMS = 5;

  function addToCart(item: Guitar) {
    const itemIndex = cart.findIndex((guitar) => guitar.id === item.id);
    if (itemIndex >= 0) {
      if (cart[itemIndex].amount >= MAX_ITEMS) return;
      const updatedCart = [...cart];
      updatedCart[itemIndex].amount += 1;
      setCart(updatedCart);
    } else {
      const newItem: CardItem = { ...item, amount: 1 };
      setCart([...cart, newItem]);
    }
  }

  function removeFromCart(id: Guitar["id"]) {
    setCart(cart.filter((guitar) => guitar.id !== id));
  }

  function changeAmount(id: Guitar["id"], _amount: CardItem["amount"]) {
    const updatedCart = cart.map((item) => {
      let newAmount = item.amount + _amount;
      if (item.id === id && newAmount >= MIN_ITEMS && newAmount <= MAX_ITEMS) {
        return {
          ...item,
          amount: newAmount,
        };
      } else {
        return item;
      }
    });

    setCart(updatedCart);
  }

  function clearCart() {
    setCart([]);
  }

  const isEmpty = useMemo(() => cart.length === 0, [cart]);

  const cardTotal = useMemo(
    () => cart.reduce((total, item) => total + item.amount * item.price, 0),
    [cart]
  );

  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    changeAmount,
    clearCart,
    isEmpty,
    cardTotal,
  };
};
