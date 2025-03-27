"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import useClickOutside from "@/app/hooks/dom/useClickOutside";

interface DropdownProps {
  label?: string;
  options: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  className?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownWidth, setDropdownWidth] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (buttonRef.current) {
      setDropdownWidth(buttonRef.current.offsetWidth);
    }
  }, [isOpen]);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        ref={buttonRef}
        className={`flex items-center justify-between border border-gray-300 w-full p-[12px]
           rounded-md cursor-pointer hover:border-primary ${className}`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="text-sm">{value || label}</span>

        <div className="flex items-center">
          {value ? (
            <X
              className="text-gray-600 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
            />
          ) : (
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.15 }}
            >
              <ChevronDown size={20} className="text-gray-600 ml-2" />
            </motion.div>
          )}
        </div>
      </div>

      {isOpen && (
        <div
          className="absolute mt-2 bg-white border-gray-200 border rounded-md shadow-lg z-10"
          style={{ width: dropdownWidth || "auto" }}
        >
          <motion.ul
            className="max-h-56 overflow-auto"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {options.map((option) => (
              <li
                key={option}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(option)}
              >
                {option}
              </li>
            ))}
          </motion.ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
