import { FC } from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import SelectInput, { SelectProps } from '../NonFormInputs/SelectInput';
import { SelectChangeEvent } from '@mui/material';
import { ControlledField } from '@/types/ui';

type FormSelectInputProps<T extends FieldValues> = ControlledField<T> &
  SelectProps;

const FormSelect = <G extends FieldValues>({
  control,
  name,
  onChange,
  ...selectProps
}: FormSelectInputProps<G>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <SelectInput
          onChange={(e: SelectChangeEvent) => {
            field.onChange(e);
            if (onChange) {
              onChange(e);
            }
          }}
          {...selectProps}
        />
      )}
    />
  );
};

export default FormSelect;
