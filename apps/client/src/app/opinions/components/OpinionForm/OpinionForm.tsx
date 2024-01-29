import { SubmitHandler, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import DefaultFormBox from '@/components/ui/Forms/DefaultFormBox';
import {
  CreateOpinionData,
  Exchange,
  OpinionType,
  SecurityType,
} from 'contracts';
import FormDatePicker from '@/components/ui/Forms/FormDatePicker';
import FormSelect from '@/components/ui/Forms/FormSelect';
import FormText from '@/components/ui/Forms/FormText';
import { Button } from '@mui/material';
import { useMutation, useQuery } from '@tanstack/react-query';
import investorService from '@/axios/investor/investor.service';
import { useMemo } from 'react';
import Grid from '@mui/material/Unstable_Grid2/Grid2';

interface ExpertFormProps {
  afterSuccessfulSubmit: () => void;
  securityId: number;
  securityType: SecurityType;
}

const OpinionForm = ({
  afterSuccessfulSubmit,
  securityId,
  securityType,
}: ExpertFormProps) => {
  const { control, formState, handleSubmit, resetField, setValue, watch } =
    useForm<CreateOpinionData>({
      defaultValues: {
        date: dayjs().toDate(),
        exchange: Exchange.MOEX,
        securityId,
        securityType,
        targetPrice: undefined,
      },
    });

  const watchAll = watch();

  const { data: expertsListResponse } = useQuery({
    queryKey: ['expertList'],
    queryFn: () => investorService.expert.getExpertsList(),
  });

  const expertsList = useMemo(() => {
    if (!expertsListResponse) return [];

    return expertsListResponse.map(e => ({
      id: e.id,
      name: e.name,
    }));
  }, [expertsListResponse]);

  const createDeal = useMutation(
    (formData: CreateOpinionData) =>
      investorService.opinion.createOpinion(formData),
    {
      onSuccess: deal => {
        afterSuccessfulSubmit();
      },
    },
  );

  const onSubmit: SubmitHandler<CreateOpinionData> = data => {
    createDeal.mutate(data);
  };

  return (
    <DefaultFormBox onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3} justifyContent="space-between">
        <Grid xs={6}>
          <FormDatePicker
            control={control}
            handleClear={() => resetField('date')}
            onChange={newValue => {
              if (newValue) {
                setValue('date', newValue?.toDate());
              } else {
                resetField('date');
              }
            }}
            label={'Дата'}
            name={'date'}
            value={watchAll.date}
          />
        </Grid>
        <Grid xs={6}>
          <FormSelect
            control={control}
            name={'expertId'}
            label="Эксперт"
            options={expertsList}
            value={watchAll.expertId}
            variant="outlined"
          />
        </Grid>
      </Grid>

      <FormText
        control={control}
        error={!!formState.errors.sourceLink}
        handleClear={() => setValue('sourceLink', '')}
        helperText={formState.errors.sourceLink?.message}
        label={'Ссылка на источник'}
        name={'sourceLink'}
        value={watchAll.sourceLink}
        multiline
      />

      <Grid container spacing={3} justifyContent="space-between">
        <Grid xs={6}>
          <FormSelect
            control={control}
            name={'type'}
            label="Прогноз"
            options={{
              [OpinionType.FLAT]: 'Флэт',
              [OpinionType.GENERAL]: 'Без прогноза',
              [OpinionType.GROWTH]: 'Рост',
              [OpinionType.REDUCTION]: 'Снижение',
            }}
            value={watchAll.type}
          />
        </Grid>
        <Grid xs={6}>
          <FormText
            control={control}
            decimal
            error={!!formState.errors.targetPrice}
            handleClear={() => resetField('targetPrice')}
            helperText={formState.errors.targetPrice?.message}
            label={'Целевая цена'}
            name={'targetPrice'}
            type="number"
            value={watchAll.targetPrice}
          />
        </Grid>
      </Grid>

      <FormText
        control={control}
        error={!!formState.errors.text}
        handleClear={() => setValue('text', '')}
        helperText={formState.errors.text?.message}
        label={'Текст мнения'}
        multiline
        name={'text'}
        value={watchAll.text}
        variant="outlined"
      />
      <Button
        variant="outlined"
        color="primary"
        type="submit"
        sx={{ color: 'grey.700' }}
      >
        Сохранить
      </Button>
    </DefaultFormBox>
  );
};

export default OpinionForm;
