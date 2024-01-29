import React, { FC } from 'react';
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  SelectChangeEvent,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

export interface SelectProps {
  handleClear?: () => void;
  onChange?: (e: SelectChangeEvent) => void;
  label: string;
  labelPropName?: string;
  options: SelectList | SelectOption[];
  sortItems?: boolean;
  value?: any;
  sx?: SxProp;
  variant?: 'standard' | 'filled' | 'outlined' | undefined;
}

// onChange field
const SelectInput: FC<SelectProps> = ({
  handleClear,
  onChange,
  label,
  labelPropName = 'name',
  options,
  sortItems = true,
  value,
  variant = 'standard',
  sx,
  ...otherProps
}) => {
  return (
    <FormControl sx={sx} fullWidth {...otherProps}>
      <InputLabel id={label}>{label}</InputLabel>
      <MuiSelect
        labelId={label}
        id={`${label}-Select`}
        value={value}
        label={label}
        onChange={onChange}
        sx={{ paddingLeft: '20px' }}
        variant={variant}
        endAdornment={
          value && handleClear ? (
            <InputAdornment
              position={'end'}
              sx={{
                display: value ? '' : 'none',
                position: 'absolute',
                right: '25px',
              }}
            >
              <IconButton onClick={handleClear}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ) : (
            ''
          )
        }
      >
        {Array.isArray(options)
          ? options.map(option => (
              <MenuItem value={option.id} key={option.id}>
                {option[labelPropName]}
              </MenuItem>
            ))
          : sortItems
          ? Object.entries(options)
              .sort((a, b) => a[1].localeCompare(b[1], 'ru', { numeric: true }))
              .map(([key, value]) => (
                <MenuItem value={key} key={value}>
                  {value}
                </MenuItem>
              ))
          : Object.entries(options).map(([key, value]) => (
              <MenuItem value={key} key={value}>
                {value}
              </MenuItem>
            ))}
      </MuiSelect>
    </FormControl>
  );
};

export default SelectInput;
