"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export type EditableProduct = {
  key: string; // stable client-side id for dnd/react keys (not the DB id)
  name: string;
  url: string;
};

export function makeEmptyProduct(): EditableProduct {
  return {
    key:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2),
    name: "",
    url: "",
  };
}

function ProductRow({
  product,
  index,
  onChange,
  onRemove,
}: {
  product: EditableProduct;
  index: number;
  onChange: (key: string, field: "name" | "url", value: string) => void;
  onRemove: (key: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: product.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-3 rounded-xl border border-beige bg-soft-white p-3 sm:p-4"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="mt-2 shrink-0 cursor-grab touch-none select-none text-chocolate/30 active:cursor-grabbing"
        aria-label="Drag to reorder"
        title="Drag to reorder"
      >
        ⠿
      </button>
      <div className="grid flex-1 gap-2 sm:grid-cols-2">
        <div>
          <label className="text-[11px] uppercase tracking-wide text-chocolate/45">
            Product name
          </label>
          <input
            type="text"
            required
            value={product.name}
            onChange={(e) => onChange(product.key, "name", e.target.value)}
            placeholder={`e.g. Kurti`}
            className="mt-1 w-full rounded-lg border border-beige bg-white px-3 py-2 text-sm text-chocolate outline-none focus:border-burgundy"
          />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-wide text-chocolate/45">
            Affiliate / shop URL
          </label>
          <input
            type="url"
            required
            value={product.url}
            onChange={(e) => onChange(product.key, "url", e.target.value)}
            placeholder="https://..."
            className="mt-1 w-full rounded-lg border border-beige bg-white px-3 py-2 text-sm text-chocolate outline-none focus:border-burgundy"
          />
        </div>
      </div>
      <button
        type="button"
        onClick={() => onRemove(product.key)}
        aria-label={`Remove product ${index + 1}`}
        className="mt-1 shrink-0 rounded-full px-2 py-1 text-chocolate/40 transition-colors hover:bg-blush/60 hover:text-burgundy"
      >
        ✕
      </button>
    </div>
  );
}

export default function ProductsEditor({
  products,
  onChangeProducts,
}: {
  products: EditableProduct[];
  onChangeProducts: (products: EditableProduct[]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 8 },
    })
  );

  function handleFieldChange(
    key: string,
    field: "name" | "url",
    value: string
  ) {
    onChangeProducts(
      products.map((p) => (p.key === key ? { ...p, [field]: value } : p))
    );
  }

  function handleRemove(key: string) {
    onChangeProducts(products.filter((p) => p.key !== key));
  }

  function handleAdd() {
    onChangeProducts([...products, makeEmptyProduct()]);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = products.findIndex((p) => p.key === active.id);
    const newIndex = products.findIndex((p) => p.key === over.id);
    onChangeProducts(arrayMove(products, oldIndex, newIndex));
  }

  return (
    <div>
      {products.length === 0 && (
        <p className="rounded-xl border border-dashed border-beige px-4 py-6 text-center text-sm text-chocolate/45">
          No products yet — add as many (or as few) as this look needs.
        </p>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={products.map((p) => p.key)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-col gap-3">
            {products.map((product, index) => (
              <ProductRow
                key={product.key}
                product={product}
                index={index}
                onChange={handleFieldChange}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={handleAdd}
        className="mt-4 w-full rounded-xl border border-dashed border-burgundy/50 py-3 text-sm font-medium tracking-wide text-burgundy transition-colors hover:bg-blush/40"
      >
        + ADD PRODUCT
      </button>
    </div>
  );
}
