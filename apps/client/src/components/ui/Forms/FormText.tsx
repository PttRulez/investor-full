import { Controller, FieldValues } from 'react-hook-form';
import TextInput, { TextInputProps } from '../NonFormInputs/TextInput';
import { ControlledField } from '@/types/ui';

type FormTextInputProps<T extends FieldValues> = ControlledField<T> &
  TextInputProps;

const FormText = <G extends FieldValues>({
  control,
  decimal,
  name,
  onChange,
  rules,
  type,
  value,
  ...textInputProps
}: FormTextInputProps<G>) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <TextInput
          onChange={event => {
            if (type === 'number' && decimal) {
              const floatValue = parseFloat(
                parseFloat(event.target.value).toFixed(2),
              );
              event.target.value = floatValue.toString();
              field.onChange(isNaN(floatValue) ? 0 : floatValue);
            } else if (type === 'number') {
              const intValue = parseInt(event.target.value);
              event.target.value = intValue.toString();
              field.onChange(isNaN(intValue) ? 0 : intValue);
            } else {
              field.onChange(event);
            }

            if (onChange) {
              onChange(event);
            }
          }}
          type={type}
          value={value}
          {...textInputProps}
        />
      )}
    />
  );
};

export default FormText;
