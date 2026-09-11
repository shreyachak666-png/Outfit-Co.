"use client";

import { CARD_COLOR_PRESETS } from "@/lib/types";

export default function ColorPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (hex: string) => void;
}) {
  const isPreset = CARD_COLOR_PRESETS.some(
    (p) => p.value.toLowerCase() === value.toLowerCase()
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        {CARD_COLOR_PRESETS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            title={preset.name}
            onClick={() => onChange(preset.value)}
            className={`h-9 w-9 rounded-full border transition-all ${
              value.toLowerCase() === preset.value.toLowerCase()
                ? "ring-2 ring-burgundy ring-offset-2"
                : "border-chocolate/15 hover:scale-105"
            }`}
            style={{ backgroundColor: preset.value }}
          />
        ))}

        <label
          title="Custom colour"
          className={`relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border text-xs text-chocolate/50 transition-all ${
            !isPreset
              ? "ring-2 ring-burgundy ring-offset-2"
              : "border-dashed border-chocolate/30 hover:scale-105"
          }`}
          style={!isPreset ? { backgroundColor: value } : undefined}
        >
          {isPreset && "+"}
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </label>
      </div>
      <p className="mt-2 text-xs text-chocolate/45">
        Chosen colour: <span className="font-mono">{value}</span>
      </p>
    </div>
  );
}
