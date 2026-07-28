import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/primitives/Button";

export function EmptyCart() {
  return (
    <div className="mx-auto max-w-lg py-20 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[color:var(--color-surface-muted)]">
        <ShoppingBag className="h-10 w-10 text-[color:var(--color-text-tertiary)]" />
      </div>
      <h1 className="mt-6 font-display text-3xl text-[color:var(--color-text-primary)] md:text-4xl">Your cart is empty</h1>
      <p className="mt-3 text-sm text-[color:var(--color-text-secondary)]">
        Looks like you have not added anything yet. Start exploring our premium collection.
      </p>
      <Link to="/shop">
        <Button variant="cta-lg" className="mt-8">Explore Collection</Button>
      </Link>
      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { title: "Free Shipping", desc: "On orders over Rs. 3,000" },
          { title: "Easy Returns", desc: "14-day satisfaction guarantee" },
          { title: "Premium Quality", desc: "Italian & Japanese materials" },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-4">
            <p className="text-xs font-semibold text-[color:var(--color-text-primary)]">{item.title}</p>
            <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
