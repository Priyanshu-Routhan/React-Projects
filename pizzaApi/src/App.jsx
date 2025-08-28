
import React, { useEffect, useState } from "react";
import axios from "axios";
import Cart from "./MyComponent/Cart";

function PizzaMenuApp() {
  const [pizzas, setPizzas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);

  // Fetch pizzas from API
  useEffect(() => {
    const fetchPizzas = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://private-anon-489d534363-pizzaapp.apiary-mock.com/restaurants/2/menu");
        setPizzas(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pizzas:", error);
        setLoading(false);
      }
    };
    fetchPizzas();
  }, []);

  

  // Add pizza to cart
  const addToCart = (pizza) => {
    setCart([...cart, pizza]);
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-blue-500">
      {/* Pizza Menu */}
      <div className="col-span-2">
        <h1 className="text-2xl font-bold mb-4">🍕 Pizza Menu</h1>
        {loading ? (
          <p>Loading pizzas...</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {pizzas.map((pizza) => (
              <div
                key={pizza.id}
                className="bg-white shadow-md rounded-xl p-4 border"
              >
                <img
                  src={pizza.image  || "https://plus.unsplash.com/premium_photo-1673439304183-8840bd0dc1bf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGl6emF8ZW58MHx8MHx8fDA%3D"}
                  alt={pizza.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h2 className="text-lg font-semibold">{pizza.name}</h2>
                <p className="text-sm text-gray-600">{pizza.description}</p>
                <p className="mt-2 font-bold">${pizza.price || "9.99"}</p>
                <button
                  className="mt-3 w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
                  onClick={() => addToCart(pizza)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cart Section */}
      <Cart cart={cart}/>
    </div>
  );
}
 export default PizzaMenuApp;


// import { useState } from 'react'
// import './App.css'
// import PizzaList from './pizzaList'

// function App() {

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <h1 className="text-3xl font-bold text-center p-6">🍕 Pizza Menu</h1>
//       <PizzaList />
//     </div>
//   )
// }

// export default App