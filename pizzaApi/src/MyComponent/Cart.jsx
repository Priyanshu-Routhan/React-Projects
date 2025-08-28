
function Cart({cart}) {
    
    return (
        
        <div className="bg-gray-100 p-4 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-3">🛒 Cart</h2>
            {cart.length === 0 ? (
                <p>No items in cart</p>
            ) : (
                <ul>
                    {cart.map((item, index) => (
                        <li
                            key={index}
                            className="flex justify-between border-b py-2 text-sm"
                        >
                            <span>{item.name}</span>
                            <span>${item.price || "9.99"}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div> 
        
    )
}
export default Cart;