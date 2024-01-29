'use client';
import { useMemo } from 'react';
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  useMaterialReactTable,
} from 'material-react-table';
import PortfolioTableFooter from './PortfolioTableFooter';
import { IPortfolioResponse, IPositionResponse, SecurityType } from 'contracts';
import { getDefaultMRTOptions } from '@/utils/mrt-default-options';
import PortfolioTableToolbar from './PortfolioTableToolbar';
import { SelectChangeEvent } from '@mui/material';

const defaultMRTOptions = getDefaultMRTOptions<IPositionResponse>();

const PortfolioTable = ({
  onChooseTransaction,
  portfolio,
}: {
  onChooseTransaction: (e: SelectChangeEvent) => void;
  portfolio: IPortfolioResponse;
}) => {
  const columns = useMemo<Array<MRT_ColumnDef<IPositionResponse>>>(
    () => [
      {
        header: 'Тип',
        Header: <></>,
        accessorKey: 'security.securityType',
        accessorFn: p =>
          p.security.securityType === SecurityType.SHARE
            ? 'Акция'
            : 'Облигация',
        size: 5,
        enableSorting: false,
        enableColumnActions: false,
      },
      {
        header: 'Тикер',
        accessorKey: 'security.ticker',
        size: 5,
      },
      {
        header: 'Название',
        accessorKey: 'security.name',
        size: 50,
      },
      // {
      //   header: 'Название короткое',
      //   accessorKey: 'security.shortName',
      //   size: 50,
      // },
      {
        header: 'Кол-во',
        accessorKey: 'amount',
        size: 5,
      },
      {
        header: 'Текущая\nцена',
        accessorKey: 'currentPrice',
        size: 5,
      },
      {
        header: 'Текущая\nстоимость',
        accessorKey: 'total',
        accessorFn: position => position.total.toLocaleString('RU-ru', {}),
        size: 5,
      },
    ],
    [],
  );

  const table = useMaterialReactTable<IPositionResponse>({
    // ...defaultMRTOptions,
    columns,
    data: portfolio?.positions?.allPositions ?? [],
    enableColumnActions: false,
    enableColumnDragging: false,
    enableGrouping: true,
    // enableToolbarInternalActions: false,
    renderToolbarInternalActions: props => (
      <PortfolioTableToolbar
        onChooseTransaction={e => {
          onChooseTransaction(e);
        }}
      />
    ),
    icons: { SortIcon: <></> },
    muiTableHeadRowProps: {
      sx: {
        '.Mui-TableHeadCell-Content-Wrapper': { whiteSpace: 'pre-wrap' },
        '.MuiTableSortLabel-icon': {
          display: 'none',
        },
      },
    },
    muiTableHeadCellProps: {
      align: 'center',
    },
    muiTableBodyCellProps: {
      align: 'center',
    },
    initialState: { expanded: true, grouping: ['security.securityType'] },
    // renderColumnActionsMenuItems: () => [<></>],
    muiTablePaperProps: { sx: { marginBottom: '100px' } },
    // enableRowPinning: false,
    renderBottomToolbar: () => (
      <PortfolioTableFooter
        cashoutsSum={portfolio.cashoutsSum}
        currentValue={portfolio.total}
        depositsSum={portfolio.depositsSum}
        profitability={portfolio.profitability}
      />
    ),
  });

  return <MaterialReactTable table={table} />;
};

export default PortfolioTable;
