"use client";

import { upsertConfig } from "@/lib/admin-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Save, Plus, Trash2 } from "lucide-react";

interface Config {
  id: string;
  key: string;
  value: string;
}

const PRESET_KEYS = [
  { key: "feature.blacksite", description: "Enable Black Site vault", defaultValue: "true" },
  { key: "feature.banner.active", description: "Show promotional banner", defaultValue: "false" },
  { key: "feature.banner.text", description: "Banner message text", defaultValue: "" },
  { key: "feature.banner.color", description: "Banner background color", defaultValue: "#d4ff33" },
  { key: "store.pricing.multiplier", description: "Global price multiplier", defaultValue: "1.0" },
];

export default function ConfigEditor({ configs }: { configs: Config[] }) {
  const router = useRouter();
  const [entries, setEntries] = useState<Record<string, string>>(
    Object.fromEntries(configs.map((c) => [c.key, c.value]))
  );
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  const handleSave = async (key: string) => {
    setSaving(key);
    try {
      await upsertConfig(key, entries[key]);
      router.refresh();
    } catch {
      alert("Failed to save");
    } finally {
      setSaving(null);
    }
  };

  const handleAddNew = async () => {
    if (!newKey.trim()) return;
    setSaving("new");
    try {
      await upsertConfig(newKey, newValue);
      setEntries({ ...entries, [newKey]: newValue });
      setNewKey("");
      setNewValue("");
      router.refresh();
    } catch {
      alert("Failed to create");
    } finally {
      setSaving(null);
    }
  };

  const handlePreset = async (key: string, defaultValue: string) => {
    if (entries[key] !== undefined) return;
    setSaving(key);
    try {
      await upsertConfig(key, defaultValue);
      setEntries({ ...entries, [key]: defaultValue });
      router.refresh();
    } catch {
      alert("Failed to create");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Preset Shortcuts */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="font-display font-bold uppercase tracking-tight mb-4">
          Quick Presets
        </h3>
        <div className="flex flex-wrap gap-2">
          {PRESET_KEYS.map((preset) => (
            <button
              key={preset.key}
              onClick={() => handlePreset(preset.key, preset.defaultValue)}
              disabled={entries[preset.key] !== undefined}
              className={`font-mono text-[10px] uppercase tracking-widest px-3 py-2 rounded-lg border transition-colors ${
                entries[preset.key] !== undefined
                  ? "border-white/10 text-white/20 cursor-default"
                  : "border-white/20 text-white/50 hover:text-volt hover:border-volt"
              }`}
              title={preset.description}
            >
              {preset.key}
            </button>
          ))}
        </div>
      </div>

      {/* Current Configs */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left p-4">Key</th>
              <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-left p-4">Value</th>
              <th className="font-mono text-[10px] text-white/40 uppercase tracking-widest text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(entries).map(([key, value]) => (
              <tr key={key} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 font-mono text-xs text-volt">{key}</td>
                <td className="p-4">
                  <input
                    value={value}
                    onChange={(e) => setEntries({ ...entries, [key]: e.target.value })}
                    className="w-full bg-transparent border border-white/10 rounded px-3 py-1 font-mono text-sm text-white focus:border-volt focus:outline-none"
                  />
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => handleSave(key)}
                    disabled={saving === key}
                    className="p-2 rounded-lg hover:bg-volt/10 text-white/30 hover:text-volt transition-colors disabled:opacity-50"
                    title="Save"
                  >
                    <Save size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="font-display font-bold uppercase tracking-tight mb-4">
          Add Custom Key
        </h3>
        <div className="flex gap-3">
          <input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="config.key"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-white focus:border-volt focus:outline-none"
          />
          <input
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="value"
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 font-mono text-sm text-white focus:border-volt focus:outline-none"
          />
          <button
            onClick={handleAddNew}
            disabled={saving === "new"}
            className="flex items-center gap-2 bg-volt text-black font-mono text-xs uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-volt/80 font-bold disabled:opacity-50"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
