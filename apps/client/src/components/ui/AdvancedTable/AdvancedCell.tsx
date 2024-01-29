import { TableCell } from '@mui/material';
import { AdvancedTableColumn } from './AdvancedTable';

interface AdvancedCellProps<T extends Record<string, any>> {
  column: AdvancedTableColumn<T>;
  row: T;
  value: any;
}

const AdvancedCell = <T extends Record<string, any>>({
  column,
  row,
  value,
}: AdvancedCellProps<T>) => {
  let renderedValue = value;

  if (column.format) {
    renderedValue = column.format(renderedValue, row);
  }

  if (column.render) {
    renderedValue = column.render(renderedValue, row);
  }

  return (
    <TableCell key={column.name} align={column.align}>
      {renderedValue}
    </TableCell>
  );
};

export default AdvancedCell;
