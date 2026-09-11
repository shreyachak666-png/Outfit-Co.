"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
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
import type { Outfit } from "@/lib/types";
import {
  deleteOutfitAction,
  reorderOutfitsAction,
  togglePublishedAction,
} from "@/app/admin/actions";
import CopyLinkButton from "./CopyLinkButton";

function Row({
  outfit,
  siteUrl,
  onDelete,
  onTogglePublished,
}: {
  outfit: Outfit;
  siteUrl: string;
  onDelete: (outfit: Outfit) => void;
  onTogglePublished: (outfit: Outfit) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: outfit.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  const outfitUrl = `${siteUrl}/look/${outfit.slug}`;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex flex-col gap-4 rounded-xl2 border border-beige bg-soft-white p-4 sm:flex-row sm:items-center sm:p-5"
    >
      <button
        {...attributes}
        {...listeners}
        className="hidden shrink-0 cursor-grab touch-none select-none px-1 text-chocolate/30 active:cursor-grabbing sm:block"
        aria-label="Drag to reorder"
        title="Drag to reorder"
      >
        ⠿
      </button>

      <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-beige/60 sm:h-16 sm:w-14">
        {outfit.image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={outfit.image_url}
            alt={outfit.title}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-serif text-base text-chocolate">
            {outfit.title}
          </p>
          {!outfit.published && (
            <span className="shrink-0 rounded-full bg-beige px-2 py-0.5 text-[10px] uppercase tracking-wide text-chocolate/60">
              Hidden
            </span>
          )}
        </div>
        <p className="truncate text-xs text-chocolate/45">/look/{outfit.slug}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <CopyLinkButton url={outfitUrl} />
        <Link
          href={`/admin/edit/${outfit.id}`}
          className="rounded-full border border-chocolate/25 px-4 py-2 text-xs font-medium tracking-wide text-chocolate transition-colors hover:border-burgundy hover:text-burgundy"
        >
          Edit
        </Link>
        <button
          type="button"
          onClick={() => onTogglePublished(outfit)}
          className="rounded-full border border-chocolate/25 px-4 py-2 text-xs font-medium tracking-wide text-chocolate transition-colors hover:border-burgundy hover:text-burgundy"
        >
          {outfit.published ? "Hide" : "Show"}
        </button>
        <button
          type="button"
          onClick={() => onDelete(outfit)}
          className="rounded-full border border-burgundy/40 px-4 py-2 text-xs font-medium tracking-wide text-burgundy transition-colors hover:bg-burgundy hover:text-ivory"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default function OutfitDashboardList({
  initialOutfits,
  siteUrl,
}: {
  initialOutfits: Outfit[];
  siteUrl: string;
}) {
  const [outfits, setOutfits] = useState(initialOutfits);
  const [, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 8 },
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = outfits.findIndex((o) => o.id === active.id);
    const newIndex = outfits.findIndex((o) => o.id === over.id);
    const reordered = arrayMove(outfits, oldIndex, newIndex);
    setOutfits(reordered);

    startTransition(() => {
      reorderOutfitsAction(reordered.map((o) => o.id));
    });
  }

  function handleDelete(outfit: Outfit) {
    const confirmed = window.confirm(
      `Delete "${outfit.title}"? This can't be undone.`
    );
    if (!confirmed) return;

    setOutfits((prev) => prev.filter((o) => o.id !== outfit.id));
    startTransition(() => {
      deleteOutfitAction(outfit.id, outfit.slug);
    });
  }

  function handleTogglePublished(outfit: Outfit) {
    setOutfits((prev) =>
      prev.map((o) =>
        o.id === outfit.id ? { ...o, published: !o.published } : o
      )
    );
    startTransition(() => {
      togglePublishedAction(outfit.id, !outfit.published);
    });
  }

  if (outfits.length === 0) {
    return (
      <div className="rounded-xl2 border border-dashed border-beige px-6 py-16 text-center">
        <p className="font-serif text-xl text-chocolate">No looks yet</p>
        <p className="mt-2 text-sm text-chocolate/55">
          Click &ldquo;+ Add New Look&rdquo; above to publish your first
          outfit.
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={outfits.map((o) => o.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3">
          {outfits.map((outfit) => (
            <Row
              key={outfit.id}
              outfit={outfit}
              siteUrl={siteUrl}
              onDelete={handleDelete}
              onTogglePublished={handleTogglePublished}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
