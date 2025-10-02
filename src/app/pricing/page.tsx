export default function PricingPage() {
  const tiers = [
    { name: "Starter", price: "$19/mo", features: ["1 course", "Email support"] },
    { name: "Pro", price: "$39/mo", features: ["3 courses", "Priority support", "Practice sheets"] },
    { name: "Ultimate", price: "$79/mo", features: ["All courses", "1:1 mentorship", "Mock tests"] },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Pricing</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiers.map((tier, i) => (
          <div key={tier.name} className="card">
            <div className="text-lg font-medium gradient-text">{tier.name}</div>
            <div className="text-2xl font-semibold mt-1 gradient-text">{tier.price}</div>
            <ul className="mt-3 text-sm muted space-y-1">
              {tier.features.map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            <a href="/checkout" className="btn btn-secondary mt-4">Choose</a>
          </div>
        ))}
      </div>
    </div>
  );
}


