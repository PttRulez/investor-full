import { ChangeEvent, FC } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';

export interface CheckboxInputProps {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  label: string;
  labelPlacement?: 'start' | 'top' | 'bottom' | 'end';
  sx?: SxProp;
  checked: any;
}

const CheckboxInput: FC<CheckboxInputProps> = ({
  checked,
  label,
  labelPlacement,
  onChange,
  sx,
  ...otherProps
}) =>  {
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={Boolean(checked)}
          onChange={onChange}
          sx={sx}
          {...otherProps}
        />
      }
      label={label}
      labelPlacement={labelPlacement}
    />
  );
};

export default CheckboxInput;
