import { Minus, Plus } from "lucide-react";
import {
  Button,
  ButtonProps,
  Input,
  InputProps,
  toast,
  useFormField,
} from "..";

///--------------------------------------------------------------------------------

export interface Val {
  label: string;
  value: string;
}
export interface MultipleKeyValInputProps {
  value: Val[];
  setValue: React.Dispatch<React.SetStateAction<Val[]>>;
  inputLProps?: InputProps;
  inputVProps?: InputProps;
  btnProps?: ButtonProps;
  atLeastOne?: boolean;
  max?: number;
  errorMsg?: React.ReactNode;
  disabled?: boolean;
}

///--------------------------------------------------------------------------------

export const MultipleKeyValInput = ({
  value,
  setValue,
  inputLProps = {},
  inputVProps = {},
  btnProps = {},
  atLeastOne,
  errorMsg = "please fill all details",
  max,
  disabled = false,
}: MultipleKeyValInputProps) => {
  const { error } = useFormField();
  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const val = e.target.value;
    const newVal = value.map((field, index) => {
      if (index == idx) {
        return {
          ...field,
          [e.target.name]: val,
        };
      }
      return field;
    });
    setValue(newVal);
  };
  const handleAdd = () => {
    if (max) {
      if (value.length === max) {
        toast.error(`Maximum ${max} fields allowed`);
        return;
      }
    }
    setValue([...value, { label: "", value: "" }]);
  };
  const handleRemove = (index: number) => {
    setValue(value.filter((_, idx) => idx !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          size="sm"
          type="button"
          endContent={<Plus size={16} />}
          onClick={handleAdd}
        />
      </div>
      {value.map((field, index) => (
        <div key={index} className="flex gap-x-4">
          <Input
            disabled={disabled}
            name="label"
            value={field.label}
            placeholder="Label"
            onChange={(e) => handleFieldChange(e, index)}
            {...inputLProps}
          />
          <Input
            disabled={disabled}
            name="value"
            value={field.value}
            placeholder="Value"
            onChange={(e) => handleFieldChange(e, index)}
            {...inputVProps}
          />
          <Button
            size="sm"
            type="button"
            variant="destructive"
            disabled={disabled || (atLeastOne && index == 0)}
            onClick={() => handleRemove(index)}
            endContent={<Minus size={16} />}
            {...btnProps}
          />
        </div>
      ))}
      {error && <div className="text-rose-500 text-xs">{errorMsg}</div>}
    </div>
  );
};
