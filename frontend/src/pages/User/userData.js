import React from 'react';

import { getDisplayTime } from '@shared/utils/time';

export const usersOverviewBaseColumns = [
  {
    field: 'name',
    headerName: '姓名',
    flex: 0.7,
    minWidth: 70,
  },
  {
    field: 'email',
    headerName: '信箱',
    flex: 1.2,
    minWidth: 80,
  },
  {
    field: 'fillOutCount',
    headerName: '填寫數量',
    flex: 0.6,
    minWidth: 30,
  },
  {
    field: 'fillOutNames',
    headerName: '已填寫問卷',
    flex: 1.8,
    minWidth: 100,
    align: 'left',
    valueFormatter: ({ value }) => value?.join(', ') || '',
    renderCell: params => (
      <div>
        {params.value?.map(p => (
          <div key={p} style={{ fontSize: '0.8rem !important', margin: '2px 0px' }}>
            {p}
          </div>
        ))}
      </div>
    ),
  },
  {
    field: 'assignedCount',
    headerName: '分派數量',
    flex: 0.6,
    minWidth: 30,
  },
  {
    field: 'assignedNames',
    headerName: '已分派問卷',
    flex: 1.8,
    minWidth: 100,
    align: 'left',
    valueFormatter: ({ value }) => value?.join(', ') || '',
    renderCell: params => (
      <div>
        {params.value?.map(p => (
          <div key={p} style={{ fontSize: '0.8rem !important', margin: '2px 0px' }}>
            {p}
          </div>
        ))}
      </div>
    ),
  },
  {
    field: 'createdAt',
    headerName: '創立帳號時間',
    flex: 1,
    minWidth: 70,
    type: 'dateTime',
    valueFormatter: ({ value }) => getDisplayTime(new Date(value)),
    // renderCell: (params) => <span style={{ color: new Date(params.value) > new Date() ? '#FF5550' : '' }}>{getDisplayTime(new Date(params.value))}</span>,
  },
];
