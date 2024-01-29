import { FC } from 'react';
import {
  DesktopDatePicker,
  DesktopDatePickerProps,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { IconButton, TextField } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/ru';
import dayjs from '@/dayjs.config';
import { Dayjs } from 'dayjs';

export type DatePickerProps = DesktopDatePickerProps<Dayjs> & {
  error?: boolean;
  handleClear: () => void;
  label: string;
  value: any;
  variant?: 'standard' | 'filled' | 'outlined' | undefined;
};

const DatePickerInput = ({
  error = false,
  handleClear,
  label,
  onChange,
  value,
  variant = 'standard',
  ...otherProps
}: DatePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <DesktopDatePicker
        label={label}
        onChange={(v, ctx) => {
          if (onChange && v) {
            onChange(v.set('hours', 11), ctx);
          }
        }}
        value={dayjs(value)}
        //@ts-ignore
        InputProps={{
          endAdornment: value && (
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClear}
            >
              <ClearIcon />
            </IconButton>
          ),
        }}
        renderInput={(params: any) => (
          <TextField
            {...params}
            error={error}
            variant={variant}
            sx={{
              '& .MuiInputBase-root.MuiInput-root': { paddingLeft: '15px' },
              '& label': { marginLeft: '15px' },
            }}
          />
        )}
        sx={{ width: '100%', ...otherProps.sx }}
        {...otherProps}
      />
    </LocalizationProvider>
  );
};

export default DatePickerInput;
