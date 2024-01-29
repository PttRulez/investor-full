'use client';

import { Button, Dialog } from '@mui/material';
import { useState } from 'react';
import ExpertForm from './components/ExpertForm/ExpertForm';

const ExpertsPage = () => {
  const [expertModalOpen, setExperModalOpen] = useState<boolean>(false);
  return (
    <>
      <Button
        variant="outlined"
        sx={{
          color: 'grey.700',
          borderColor: 'grey.700',
          marginBottom: '50px',
        }}
        onClick={() => setExperModalOpen(true)}
      >
        + Эксперт
      </Button>
      <Dialog open={expertModalOpen} onClose={() => setExperModalOpen(false)}>
        <ExpertForm afterSuccessfulSubmit={() => setExperModalOpen(false)} />
      </Dialog>
    </>
  );
};

export default ExpertsPage;
