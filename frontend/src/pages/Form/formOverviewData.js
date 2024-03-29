import React from 'react';

import { getDisplayTime } from '@shared/utils/time';

export const getFormStatusRowId = row => `${row.writerEmail}`; // Note: the id in the data is formId, not index of elements in the array

export const getFormResultRowId = row => `${row.email}`;

export const formStatusBaseColumns = [
  {
    field: 'writerName',
    headerName: '填寫者姓名',
    flex: 0.8,
    minWidth: 70,
  },
  {
    field: 'writerEmail',
    headerName: '填寫者信箱',
    flex: 1.6,
    minWidth: 70,
  },
  {
    field: 'role',
    headerName: '填寫者角色',
    flex: 0.5,
    minWidth: 70,
  },
  {
    field: 'status',
    headerName: '填寫狀態',
    flex: 0.5,
    minWidth: 70,
  },
  {
    field: 'assignedAt',
    headerName: '生效時間',
    type: 'dateTime',
    renderCell: params => <span style={{ color: new Date(params.value) > new Date() ? '#FF5550' : '' }}>{getDisplayTime(new Date(params.value))}</span>,
    flex: 1.2,
    minWidth: 70,
  },
  {
    field: 'emailSender',
    headerName: '分派者',
    flex: 0.8,
    minWidth: 70,
  },
  {
    field: 'emailLastSentTime',
    headerName: '最後一次寄信時間',
    type: 'dateTime',
    // In Go, time.Time is a struct which cannot have a nil value. It's "zero" value is: 0001-01-01 00:00:00 +0000 UTC
    // And the response JS received is {emailLastSentTime: "0001-01-01T00:00:00Z", ...  }
    valueFormatter: ({ value }) => (value !== '0001-01-01T00:00:00Z' ? getDisplayTime(new Date(value)) : ''),
    flex: 1.2,
    minWidth: 70,
  },
];

export const formResultBaseColumns = [
  {
    field: 'name',
    headerName: '填寫者姓名',
    flex: 0.7,
  },
  {
    field: 'email',
    headerName: '填寫者信箱',
    flex: 1,
  },
  {
    field: 'role',
    headerName: '填寫者角色',
    flex: 0.5,
  },
  {
    field: 'answerTime',
    headerName: '回答時間',
    flex: 1,
    minWidth: 70,
    type: 'dateTime',
    valueFormatter: ({ value }) => getDisplayTime(new Date(value)),
  },
  {
    field: 'score',
    headerName: '分數',
    flex: 0.4,
  },
];

const getQuestionKeysName = (custId, quesNo) => `${custId}${quesNo}`;

export const transformFormResultData = data => {
  const { formCustId: custId } = data;
  const rows = data.results.reduce(
    (acc, cur) => [
      ...acc,
      {
        ...cur,
        ...cur.answers.reduce((a, c, idx) => ({ ...a, [getQuestionKeysName(custId, idx + 1)]: c }), {}),
      },
    ],
    []
  );
  return rows;
};

export const transformFormResultColumns = (baseCols, data) => {
  const { formCustId: custId, maxQuestionsCount } = data;
  const questionKeys = Array.from(Array(maxQuestionsCount).keys(), k => ({
    field: getQuestionKeysName(custId, k + 1),
    headerName: getQuestionKeysName(custId, k + 1),
    flex: 1,
  }));
  return [...baseCols, ...questionKeys];
};
