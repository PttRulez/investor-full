import { FC, ReactNode } from 'react';
import { TableHead } from '@mui/material';

type Props = {
  children?: ReactNode;
};

const BasicTableHeader: FC<Props> = ({ children }) => {
  return (
    <TableHead
      sx={{
        th: {
          fontWeight: 'bold',
          textAlign: 'start',
          position: 'sticky',
          top: 0,
        },
      }}
    >
      {children}
    </TableHead>
  );
};

export default BasicTableHeader;
