import React, { useState, useRef, useEffect } from "react";
import SearchModal from "./SearchModal";

import {
  PanelLeft,
  Search,
  Inbox,
  Zap,
  PanelTop,
  CircleDollarSign,
  ShoppingCart,
  Receipt,
  BookOpen,
  Users,
  Store,
  Settings,
} from "lucide-react";

interface MenuItemsProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  submenu?: string[];
}
export default function Sidebar() {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const menuItems: MenuItemsProps[] = [
    { icon: <Search size={16} />, label: "Search", active: false },
    { icon: <Inbox size={16} />, label: "Inbox", active: true },
    {
      icon: <Zap size={16} />,
      label: "Insights",
      active: false,
      submenu: ["Reporting", "Rewards"],
    },
    {
      icon: <PanelTop size={16} />,
      label: "My Ramp",
      active: false,
      submenu: ["Overview", "Expenses", "Travel"],
    },
    {
      icon: <CircleDollarSign size={16} />,
      label: "Expenses",
      active: false,
      submenu: ["Card transactions", "Reimbursements", "Travel"],
    },
    {
      icon: <ShoppingCart size={16} />,
      label: "Procurement",
      active: false,
      submenu: ["Requests", "Purchase orders"],
    },
    { icon: <Receipt size={16} />, label: "Bill Pay", active: false },
    {
      icon: <BookOpen size={16} />,
      label: "Accounting",
      active: true,
      submenu: ["Ramp card", "Reimbursements", "Payments", "Bill Pay"],
    },
    { icon: <Users size={16} />, label: "People", active: false },
    {
      icon: <Store size={16} />,
      label: "Vendors",
      active: false,
      submenu: ["Overview", "Price Intelligence", "Seat Intelligence"],
    },
  ];

  const handleMenuClick = (item: MenuItemsProps, index: number) => {
    if (item.label === "Search") {
      setSearchModalOpen(true);
      return;
    }

    if (item.submenu) {
      setOpenSubmenu(openSubmenu === index ? null : index);
    } else {
      console.log("Navigate to:", item.label);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setOpenSubmenu(null);
        setOpenDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");

      if (
        (isMac && e.metaKey && e.key === "k") || // Cmd + K
        (!isMac && e.ctrlKey && e.key === "k") // Ctrl + K
      ) {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <aside
        ref={sidebarRef}
        className="relative left-0 top-0 h-screen w-15 bg-[#f4f3ef] flex flex-col items-center py-6 border-r border-r-[#dbdac9]"
      >
        {/* Dropdown trigger */}
        <div className="relative group">
          <button
            className="p-3 hover:bg-[#ebe8e5] rounded-lg transition text-gray-600 hover:text-black"
            // onClick={() => setOpenDropdown(!openDropdown)}
          >
            <PanelLeft size={16} />
          </button>

          {/* Tooltip */}
          <span className="absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none bg-white text-black text-xs ml-2 px-2 py-2 border border-[#ebe8e5] shadow transition">
            Menu
          </span>

          {/* Dropdown menu */}
          {/* {openDropdown && (
            <div className="absolute left-13 top-0 w-48 bg-[#f4f3ef] shadow-xl z-50 border border-[#ebe8e5]">
              <ul className="text-sm">
                <li className="px-4 py-3 text-left font-bold">Insights</li>
                <li className="pr-4 py-3 pl-8 text-left hover:bg-[#ebe8e5] cursor-pointer text-[#707062] hover:underline">
                  Reporting
                </li>
                <li className="pr-4 py-3 pl-8 text-left hover:bg-[#ebe8e5] cursor-pointer text-[#707062] hover:underline">
                  Rewards
                </li>
              </ul>
            </div>
          )} */}
        </div>

        {/* Menu items */}
        <div className="flex-1 mt-10 flex flex-col gap-2">
          {menuItems.map((item, index) => (
            <div key={index} className="relative group">
              <button
                onClick={() => handleMenuClick(item, index)}
                className="p-3 hover:bg-[#ebe8e5] rounded-lg transition text-gray-600 hover:text-black"
              >
                {item.icon}
              </button>

              {/* Tooltip */}
              <span className="absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none bg-white text-black text-xs ml-2 px-2 py-2 border border-[#ebe8e5] shadow transition">
                {item.label}
              </span>

              {item.active && (
                <span className="absolute right-0.5 top-1 w-2 h-2 bg-[#e4f221] rounded-full border border-[#c6c6a7]"></span>
              )}

              {item.submenu && openSubmenu === index && (
                <div className="absolute left-13 bottom-0 w-48 bg-[#f4f3ef] shadow-xl z-50 border border-[#ebe8e5]">
                  <div className="px-4 py-3 text-sm text-left font-bold">{item.label}</div>
                  {item.submenu.map((sub, subIndex) => {
                    return (
                      <div
                        key={subIndex}
                        className="pr-4 py-3 pl-8 text-sm text-left hover:bg-[#ebe8e5] cursor-pointer text-[#707062] hover:underline"
                        onClick={() => console.log("Navigate to", sub)}
                      >
                        {sub}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom settings */}
        <div className="relative group mb-0 border-t border-[#ebe8e5]">
          <button
            className="p-3 hover:bg-[#ebe8e5] rounded-lg transition text-gray-600 hover:text-black"
            onClick={() => setOpenDropdown(!openDropdown)}
          >
            <Settings size={16} />
          </button>
          {/* <span className="absolute left-12 top-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none bg-white text-black text-xs ml-2 px-2 py-2 border border-[#ebe8e5] shadow transition">
            Settings
          </span> */}
          {/* <div className="px-4 py-3 text-sm text-left font-bold">{"Setting"}</div> */}
          {openDropdown && (
            <div className="absolute left-13 bottom-0 w-48 bg-[#f4f3ef] shadow-xl z-50 border border-[#ebe8e5]">
              <div className="px-4 py-3 text-sm text-left font-bold">Settings</div>
              {[
                "Company settings",
                "Expense policy",
                "Entities",
                "Integrations",
                "Personal settings",
                "Ramp Plus",
                "Sign out",
              ].map((item, index) => {
                return (
                  <div
                    key={index}
                    className="pr-4 py-3 pl-8 text-sm text-left hover:bg-[#ebe8e5] cursor-pointer text-[#707062] hover:underline"
                    onClick={() => console.log("Navigate to", item)}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      <SearchModal
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        commands={[{ label: "Search Destinations" }, { label: "Search Trips" }]}
        actions={[{ label: "Create New Trip" }, { label: "Open Dashboard" }]}
      />
    </>
  );
}
