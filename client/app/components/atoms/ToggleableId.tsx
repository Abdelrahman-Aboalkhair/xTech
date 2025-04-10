import React from "react";
import { Eye, EyeOff } from "lucide-react";
import useToggle from "@/app/hooks/state/useToggle";
import shortenId from "@/app/utils/shortenId";

interface ToggleableIdProps {
  id: string;
  className?: string;
}

const ToggleableId = ({ id, className = "" }: ToggleableIdProps) => {
  const [isFullVisible, toggleFullVisible] = useToggle(false);

  const displayedId = isFullVisible ? id : shortenId(id);

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="font-mono text-gray-800 text-[14px]">{displayedId}</span>
      <button
        onClick={toggleFullVisible}
        className=" text-gray-500 hover:text-indigo-500 transition-colors duration-200 focus:outline-none"
        aria-label={isFullVisible ? "Hide full ID" : "Show full ID"}
      >
        {isFullVisible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
};

export default ToggleableId;
