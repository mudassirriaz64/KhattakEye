import { motion } from "framer-motion";
import { ShoppingBag, Plus } from "lucide-react";
import { Button } from "@/components/primitives/Button";

type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
};

type Props = {
  products: Product[];
  mainProductName: string;
  mainProductPrice: string;
  mainProductImage: string;
};

export function FrequentlyBoughtTogether({ products, mainProductName, mainProductPrice, mainProductImage }: Props) {
  const totalPrice = products.reduce((sum, p) => sum + parseFloat(p.price.replace("$", "")), parseFloat(mainProductPrice.replace("$", ""))).toFixed(2);

  return (
    <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-panel)] p-6">
      <h3 className="font-display text-xl text-[color:var(--color-text-primary)]">Frequently Bought Together</h3>
      <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">Complete your look with these items</p>

      <div className="mt-6 flex items-center gap-4">
        <div className="flex-shrink-0">
          <img src={mainProductImage} alt={mainProductName} className="h-20 w-20 rounded-xl object-cover" />
        </div>
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4">
            <Plus className="h-4 w-4 text-[color:var(--color-text-tertiary)]" />
            <motion.img
              src={product.image}
              alt={product.name}
              whileHover={{ scale: 1.05 }}
              className="h-20 w-20 rounded-xl object-cover"
            />
          </div>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-[color:var(--color-text-primary)]">{mainProductName}</span>
          <span className="font-medium text-[color:var(--color-text-primary)]">{mainProductPrice}</span>
        </div>
        {products.map((product) => (
          <div key={product.id} className="flex items-center justify-between text-sm">
            <span className="text-[color:var(--color-text-secondary)]">{product.name}</span>
            <span className="text-[color:var(--color-text-secondary)]">{product.price}</span>
          </div>
        ))}
        <div className="border-t border-[color:var(--color-border)] pt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[color:var(--color-text-primary)]">Total:</span>
            <span className="font-display text-lg font-semibold text-[color:var(--color-text-primary)]">${totalPrice}</span>
          </div>
        </div>
      </div>

      <Button className="mt-4 w-full" iconLeft={<ShoppingBag className="h-4 w-4" />}>
        Add All to Cart
      </Button>
    </div>
  );
}
