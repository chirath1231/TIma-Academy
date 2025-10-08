export default function CartPage() {
  const items = [
    { id: 1, title: "Math Foundations", price: 19 },
    { id: 2, title: "Science Essentials", price: 39 },
  ];
  const total = items.reduce((sum, i) => sum + i.price, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Cart</h1>
      <ul className="divide-y border rounded">
        {items.map((item) => (
          <li key={item.id} className="p-4 flex items-center justify-between">
            <span>{item.title}</span>
            <span className="font-medium">${item.price}</span>
          </li>
        ))}
      </ul>
      <div className="flex items-center justify-between">
        <span className="opacity-80">Total</span>
        <span className="font-semibold">${total}</span>
      </div>
      <a href="/checkout" className="inline-block px-4 py-2 border rounded text-sm">Proceed to checkout</a>
    </div>
  );
}


