import DatePickerInput, {
  DatePickerProps,
} from '../NonFormInputs/DatePickerInput';
import { Controller, FieldValues } from 'react-hook-form';
import { ControlledField } from '@/types/ui';

interface FormDatePickerProps<T extends FieldValues>
  extends ControlledField<T>,
    Omit<DatePickerProps, 'name'> {}

const FormDatePicker = <G extends FieldValues>({
  control,
  name,
  onChange,
  rules,
  ...datePickerProps
}: FormDatePickerProps<G>) => {
  return (
    // Делаем свойство rules по аналогии с TexField
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <DatePickerInput
          onChange={(value, ctx) => {
            field.onChange(value);
            if (onChange) {
              onChange(value, ctx);
            }
          }}
          {...datePickerProps}
        />
      )}
    />
  );
};

export default FormDatePicker;
