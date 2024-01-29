import AddIcon from '@mui/icons-material/Add';
import { FC, SyntheticEvent } from 'react';
import { RightBottomFab } from '@/components/ui/styled/RightBottomFab';

interface Props {
  onClick: (e: SyntheticEvent) => void;
  sx?: SxProp;
}

const AddNewButton: FC<Props> = ({ onClick, sx }) => {
  return (
    <RightBottomFab onClick={onClick} sx={sx}>
      <AddIcon />
    </RightBottomFab>
  );
};

export default AddNewButton;
