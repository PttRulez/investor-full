import { FC, FormEventHandler, ReactNode } from 'react';
import { Box, Stack } from '@mui/material';

interface Props {
  children: ReactNode;
  onSubmit?: FormEventHandler;
  sx?: SxProp;
}

const DefaultFormBox = ({ children, onSubmit, sx }: Props) => {
  return (
    <Box onSubmit={onSubmit} component="form" sx={{ padding: '30px', ...sx }}>
      <Stack gap={'20px'}>{children}</Stack>
    </Box>
  );
};

export default DefaultFormBox;
