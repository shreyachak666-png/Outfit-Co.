import type { Product } from "@/lib/types";

export default function ProductList({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <div className="mt-10">
      <h2 className="font-serif text-xl text-chocolate">Shop This Look</h2>
      <ul className="mt-4 divide-y divide-beige/70 border-y border-beige/70">
        {products.map((product) => (
          <li
            key={product.id}
            className="flex items-center justify-between gap-4 py-4"
          >
            <span className="text-[15px] text-chocolate/90">
              {product.name}
            </span>
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="shrink-0 rounded-full border border-burgundy px-5 py-2 text-xs font-medium tracking-[0.15em] text-burgundy transition-colors hover:bg-burgundy hover:text-ivory active:scale-[0.98]"
            >
              SHOP
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
