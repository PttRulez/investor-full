'use client';

import { SyntheticEvent, useState } from 'react';
import { Dialog, IconButton } from '@mui/material';
import AddNewButton from '@/components/ui/AddNewButton';
import PortfolioForm from './components/PortfolioForm';
import { useQuery } from '@tanstack/react-query';
import investorService from '@/axios/investor/investor.service';
import AdvancedTable, {
  AdvancedTableColumn,
} from '@/components/ui/AdvancedTable/AdvancedTable';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { redirect, useRouter } from 'next/navigation';
import Head from 'next/head';
import { useSession } from 'next-auth/react';
import { IPortfolioResponse as Portfolio } from 'contracts';

type NewPortfolio = Pick<Portfolio, 'name' | 'compound'>;

const emptyPortfolio: NewPortfolio = {
  name: '',
  compound: false,
};

export default function PortfoliosPage() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/api/auth/signin?callbackUrl=/portfolios');
    },
  });

  const [portfolioToEdit, setPortfolioToEdit] = useState<
    Portfolio | NewPortfolio | null
  >(null);

  const { data: portfolioList } = useQuery({
    queryKey: ['allPortfolios'],
    queryFn: () => investorService.portfolio.allPortfolios(),
  });
  const router = useRouter();

  const addNewPortfolio = () => {
    setPortfolioToEdit(emptyPortfolio);
  };

  const columns: AdvancedTableColumn<Portfolio>[] = [
    {
      name: 'name',
      label: 'Название',
    },
    {
      name: 'compound',
      label: 'Составной',
      format: (compound: boolean) => {
        return compound ? (
          <CheckIcon sx={{ color: 'success.main' }} />
        ) : (
          <CloseIcon sx={{ color: 'error.main' }} />
        );
      },
      align: 'center',
    },
    {
      name: 'actions',
      label: '',
      render: (_, portfolio) => {
        return (
          <IconButton
            onClick={(e: SyntheticEvent) => {
              e.stopPropagation();
              setPortfolioToEdit(portfolio);
            }}
          >
            <ModeEditIcon />
          </IconButton>
        );
      },
    },
  ];

  if (!session?.user) return;

  return (
    <>
      <Head>
        <title>My page title</title>
      </Head>
      <AdvancedTable
        columns={columns}
        rows={portfolioList ?? []}
        pagination={false}
        rowClick={row => {
          router.push(`/portfolios/${row.id}`);
        }}
      />
      <AddNewButton onClick={addNewPortfolio} />
      <Dialog
        open={!!portfolioToEdit}
        onClose={() => setPortfolioToEdit(null)}
        sx={{
          '.MuiPaper-root.MuiDialog-paper': {
            maxWidth: '90%',
            maxHeight: '90%',
            display: 'flex',
            justifyContent: 'center',
            padding: '20px',
          },
        }}
      >
        {portfolioToEdit && (
          <PortfolioForm
            afterSuccessfulSubmit={() => setPortfolioToEdit(null)}
            portfolio={portfolioToEdit}
          />
        )}
      </Dialog>
    </>
  );
}
