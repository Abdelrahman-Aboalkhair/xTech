"use client";
import { Check } from "lucide-react";
import { Controller, Control } from "react-hook-form";

interface CheckBoxProps {
  className?: string;
  name: string;
  control: Control<any>;
  label?: string;
  defaultValue?: boolean;
  onChangeExtra?: (name: string, value: boolean) => void;
}

const CheckBox: React.FC<CheckBoxProps> = ({
  className,
  name,
  control,
  label,
  defaultValue = false,
  onChangeExtra,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field }) => (
        <div
          className={`flex items-center space-x-2 cursor-pointer ${className}`}
          onClick={() => {
            const newValue = !field.value;
            field.onChange(newValue);
            if (onChangeExtra) {
              onChangeExtra(name, newValue);
            }
          }}
        >
          <div
            className={`w-[22px] h-[22px] flex items-center justify-center border rounded-md transition-all ${
              field.value ? "bg-primary border-primary" : "border-gray-400"
            }`}
          >
            {field.value && <Check className="text-white text-lg" />}
          </div>
          {label && (
            <span className="text-gray-700 select-none font-medium">
              {label}
            </span>
          )}
        </div>
      )}
    />
  );
};

export default CheckBox;
