import { FC, ReactNode } from 'react';
import {
  Paper,
  SxProps,
  Table,
  TableContainer,
  Typography,
} from '@mui/material';

interface Props {
  children?: ReactNode;
  sx?: SxProps;
  title?: string;
};

const BasicTable: FC<Props> = ({ children, sx, title }) => {
  return (
    <TableContainer
      component={Paper}
      sx={{ padding: '30px', overflowX: 'initial', ...sx }}
    >
      {title && <Typography variant='h4' align='center'>{title}</Typography>}
      <Table aria-label="simple table" stickyHeader>
        {children}
      </Table>
    </TableContainer>
  );
};

export default BasicTable;
