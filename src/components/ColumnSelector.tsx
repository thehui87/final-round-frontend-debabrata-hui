import { Lock, Columns3, Menu } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import type { Column } from "../helper/type";

interface Props {
  columns: Column[];
  setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
}

export default function ColumnSelector({ columns, setColumns }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSort = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;

    const items = [...columns];
    const dragged = items[dragItem.current];

    // prevent dragging locked item
    if (dragged.locked) return;

    items.splice(dragItem.current, 1);
    items.splice(dragOverItem.current, 0, dragged);

    dragItem.current = dragOverItem.current = null;
    setColumns(items);
  };

  const toggleVisible = (index: number) => {
    if (columns[index].locked) return; // cannot hide locked column

    const updated = [...columns];
    updated[index].visible = !updated[index].visible;
    setColumns(updated);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`relative group flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
          open ? "bg-[#5c614b] text-white" : "text-black hover:bg-[#f4f4f4]"
        }`}
      >
        <Columns3 size={16} />
        {/* Tooltip */}
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none bg-white text-black text-xs px-2 py-1 border border-[#ebe8e5] shadow transition-opacity duration-200">
          Customize Column
        </span>
      </button>

      {open && (
        <div className="absolute top-10 right-0 w-[280px] bg-white border border-[#e8e7dd] shadow-xl rounded-sm z-50">
          {/* Columns list */}
          <div className="px-4 py-4 flex flex-col gap-4">
            {columns.map((col, index) => (
              <div
                key={col.key}
                className="flex justify-between items-center"
                draggable={!col.locked}
                onDragStart={() => (dragItem.current = index)}
                onDragEnter={() => (dragOverItem.current = index)}
                onDragEnd={handleSort}
              >
                <label className="flex items-center gap-3 text-[15px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={col.visible}
                    disabled={col.locked}
                    onChange={() => toggleVisible(index)}
                    className="accent-[#4caf50]"
                  />
                  {col.label}
                </label>

                {col.locked ? (
                  <Lock className="text-gray-500" size={16} />
                ) : (
                  <Menu className="text-gray-500 cursor-grab" size={18} />
                )}
              </div>
            ))}
          </div>

          {/* FOOTER */}
          <div className="border-t border-[#e8e7dd] px-6 py-3 flex justify-end bg-white">
            <button
              className="text-sm text-[#71725f] hover:underline"
              onClick={() => setColumns(columns.map(c => ({ ...c, visible: true })))}
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
