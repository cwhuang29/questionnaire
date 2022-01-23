import ROLES from '@constants/roles';
import { getDisplayTime } from '@shared/utils/time';

export const columns = [
  {
    field: 'writerName',
    headerName: '填寫者姓名',
    flex: 1.2,
    minWidth: 70,
  },
  {
    field: 'writerEmail',
    headerName: '填寫者信箱',
    flex: 2,
    minWidth: 70,
  },
  {
    field: 'role',
    headerName: '填寫者角色',
    valueFormatter: ({ value }) => ROLES[value],
    flex: 0.7,
    minWidth: 70,
  },
  {
    field: 'status',
    headerName: '填寫狀態',
    flex: 0.7,
    minWidth: 70,
  },
  {
    field: 'emailSender',
    headerName: '寄信者',
    flex: 1.2,
    minWidth: 70,
  },
  {
    field: 'emailLastSentTime',
    headerName: '最後一次寄信時間',
    type: 'dateTime',
    valueFormatter: ({ value }) => getDisplayTime(new Date(value)),
    flex: 1.2,
    minWidth: 70,
  },
];
