import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export interface CommandItem {
  icon?: React.ReactNode;
  label: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  commands: CommandItem[];
  actions: CommandItem[];
}

export default function SearchModal({ open, onClose, commands, actions }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Background Blur */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal */}
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[15vh]">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-2xl rounded-lg bg-white shadow-xl border border-gray-200">
              {/* Search bar */}
              <div className="border-b border-gray-200 px-4 py-3 flex items-center gap-2">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Where do you want to go?"
                  className="w-full bg-transparent outline-none placeholder-gray-400"
                />
              </div>

              {/* Content */}
              <div className="max-h-[380px] overflow-y-auto">
                {/* Commands */}
                <div className="px-4 py-2 text-xs font-semibold text-gray-500">Commands</div>
                <div className="border-b border-gray-200 pb-2">
                  {commands.map((cmd, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 flex items-center gap-3 hover:bg-gray-50 cursor-pointer"
                    >
                      {cmd.icon}
                      <span className="text-sm text-gray-800">{cmd.label}</span>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="px-4 py-2 text-xs font-semibold text-gray-500">Actions</div>
                <div className="pb-4">
                  {actions.map((action, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 flex items-center gap-3 hover:bg-gray-50 cursor-pointer"
                    >
                      {action.icon}
                      <span className="text-sm text-gray-800">{action.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
