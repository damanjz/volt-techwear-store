"use client";

import { upsertConfig } from "@/lib/admin-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save, RotateCcw } from "lucide-react";

interface ThemeValue {
  key: string;
  label: string;
  defaultValue: string;
  currentValue: string;
}

export default function ThemeEditor({ themeValues }: { themeValues: ThemeValue[] }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(themeValues.map((tv) => [tv.key, tv.currentValue]))
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(values)) {
        await upsertConfig(key, value);
      }
      router.refresh();
    } catch {
      alert("Failed to save theme");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setValues(Object.fromEntries(themeValues.map((tv) => [tv.key, tv.defaultValue])));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {themeValues.map((tv) => (
          <div key={tv.key} className="bg-white/5 border border-white/10 rounded-xl p-5">
            <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-3">
              {tv.label}
            </label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="color"
                  value={values[tv.key]}
                  onChange={(e) => setValues({ ...values, [tv.key]: e.target.value })}
                  className="w-16 h-16 rounded-lg border-2 border-white/20 cursor-pointer bg-transparent"
                />
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={values[tv.key]}
                  onChange={(e) => setValues({ ...values, [tv.key]: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-white focus:border-volt focus:outline-none"
                />
                <p className="font-mono text-[10px] text-white/20 mt-1">
                  Default: {tv.defaultValue}
                </p>
              </div>
            </div>
            {/* Preview swatch */}
            <div
              className="mt-3 h-8 rounded-lg border border-white/10"
              style={{ backgroundColor: values[tv.key] }}
            />
          </div>
        ))}
      </div>

      {/* Live Preview */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="font-mono text-[10px] text-white/40 uppercase tracking-widest mb-4">
          Live Preview
        </h3>
        <div
          className="rounded-xl p-6 space-y-3"
          style={{ backgroundColor: values["theme.background"], color: values["theme.foreground"] }}
        >
          <h2 className="font-display font-black text-2xl uppercase">
            VOLT <span style={{ color: values["theme.volt"] }}>.</span>
          </h2>
          <p className="font-mono text-sm opacity-60">Preview of the storefront with your selected colors.</p>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 rounded font-mono text-xs uppercase font-bold"
              style={{ backgroundColor: values["theme.volt"], color: values["theme.background"] }}
            >
              Primary Button
            </button>
            <button
              className="px-4 py-2 rounded font-mono text-xs uppercase font-bold"
              style={{ backgroundColor: values["theme.cyber-red"], color: "#fff" }}
            >
              Alert Button
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-volt text-black font-mono text-xs uppercase tracking-widest px-6 py-3 rounded-lg hover:bg-volt/80 font-bold disabled:opacity-50"
        >
          <Save size={14} />
          {saving ? "Saving..." : "Apply Theme"}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 border border-white/20 text-white/50 font-mono text-xs uppercase tracking-widest px-6 py-3 rounded-lg hover:text-white hover:border-white/40 transition-colors"
        >
          <RotateCcw size={14} />
          Reset Defaults
        </button>
      </div>
    </div>
  );
}
