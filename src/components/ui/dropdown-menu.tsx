// src/components/ui/dropdown-menu.tsx
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  cloneElement,
  ReactElement,
  useRef,
  useEffect,
} from "react";

// Create a context to share the open state and toggle function
interface DropdownMenuContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
const DropdownMenuContext = createContext<DropdownMenuContextProps | undefined>(
  undefined
);

export function DropdownMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

interface DropdownMenuTriggerProps {
  asChild?: boolean;
  children: ReactElement;
}

export function DropdownMenuTrigger({
  asChild = false,
  children,
}: DropdownMenuTriggerProps) {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenuTrigger must be used within a DropdownMenu");
  }
  const { open, setOpen } = context;

  const handleClick = () => setOpen(!open);

  if (asChild) {
    // If asChild is true, clone the child and add the onClick handler
    return cloneElement(children as ReactElement<any>, {
      onClick: handleClick,
    });
  }
  return (
    <button onClick={handleClick} type="button">
      {children}
    </button>
  );
}

interface DropdownMenuContentProps {
  children: ReactNode;
  className?: string;
}

export function DropdownMenuContent({
  children,
  className = "",
}: DropdownMenuContentProps) {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error("DropdownMenuContent must be used within a DropdownMenu");
  }
  const { open, setOpen } = context;

  // Close the menu when clicking outside
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, setOpen]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${className}`}
    >
      <div className="py-1">{children}</div>
    </div>
  );
}

interface DropdownMenuItemProps {
  onClick?: () => void;
  children: ReactNode;
}

export function DropdownMenuItem({ onClick, children }: DropdownMenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
      type="button"
    >
      {children}
    </button>
  );
}
