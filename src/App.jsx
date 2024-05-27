import Guitar from "./components/Guitar";
import Header from "./components/Header";
import { db } from "./data/db";
import { useEffect, useState } from "react";

function App() {
  const initialCart = () => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  const [data, setData] = useState(db);
  const [cart, setCart] = useState(initialCart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const MIN_ITEMS = 1;
  const MAX_ITEMS = 5;

  function addToCart(item) {
    const itemIndex = cart.findIndex((guitar) => guitar.id === item.id);
    if (itemIndex >= 0) {
      if (cart[itemIndex].amount >= MAX_ITEMS) return;
      const updatedCart = [...cart];
      updatedCart[itemIndex].amount += 1;
      setCart(updatedCart);
    } else {
      item.amount = 1;
      setCart([...cart, item]);
    }
  }

  function removeFromCart(id) {
    setCart(cart.filter((guitar) => guitar.id !== id));
  }

  function changeAmount(id, _amount) {
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

  return (
    <>
      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        changeAmount={changeAmount}
        clearCart={clearCart}
      />
      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitar) => (
            <Guitar key={guitar.id} guitar={guitar} addToCart={addToCart} />
          ))}
        </div>
      </main>

      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">
            GuitarLA - Todos los derechos Reservados
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;
