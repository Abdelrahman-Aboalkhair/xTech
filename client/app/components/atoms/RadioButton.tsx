"use client";
import { Controller, Control } from "react-hook-form";

interface RadioButtonProps {
  className?: string;
  name: string;
  control: Control<any>;
  label?: string;
  value: string;
  currentValue?: string;
  onChangeExtra?: (value: string) => void;
}

const RadioButton: React.FC<RadioButtonProps> = ({
  className,
  name,
  control,
  label,
  value,
  currentValue,
  onChangeExtra,
}) => {
  const isChecked = currentValue === value;

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={""}
      render={({ field }) => (
        <div
          className={`flex items-center space-x-2 cursor-pointer ${className}`}
          onClick={() => {
            field.onChange(value);
            if (onChangeExtra) {
              onChangeExtra(value);
            }
          }}
        >
          <div
            className={`w-[20px] h-[20px] flex items-center justify-center border rounded-full transition-all ${
              isChecked ? "bg-primary border-primary" : "border-gray-400"
            }`}
          >
            {isChecked && (
              <div className="w-[10px] h-[10px] rounded-full bg-white" />
            )}
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

export default RadioButton;
