export default function CheckoutPage() {
  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-xl font-semibold">Checkout</h1>
      <form className="space-y-4">
        <fieldset className="border rounded p-4">
          <legend className="text-sm px-1">Billing details</legend>
          <div className="grid sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm">First name</span>
              <input className="mt-1 input" />
            </label>
            <label className="block">
              <span className="text-sm">Last name</span>
              <input className="mt-1 input" />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm">Email</span>
              <input type="email" className="mt-1 input" />
            </label>
          </div>
        </fieldset>

        <fieldset className="border rounded p-4">
          <legend className="text-sm px-1">Payment</legend>
          <div className="grid sm:grid-cols-3 gap-4">
            <label className="block sm:col-span-2">
              <span className="text-sm">Card number</span>
              <input className="mt-1 input" placeholder="4242 4242 4242 4242" />
            </label>
            <label className="block">
              <span className="text-sm">CVC</span>
              <input className="mt-1 input" placeholder="123" />
            </label>
            <label className="block">
              <span className="text-sm">Expiry</span>
              <input className="mt-1 input" placeholder="MM/YY" />
            </label>
          </div>
        </fieldset>

        <button type="submit" className="btn btn-primary">Pay now</button>
      </form>
    </div>
  );
}


