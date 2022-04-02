import { getDisplayTime } from '@shared/utils/time';

export const getFormStatusRowId = (row) => `${row.writerEmail}`; // Note: the id in the data is formId, not index of elements in the array

export const getFormResultRowId = (row) => `${row.email}`;

export const formStatusBaseColumns = [
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
    // minWidth: 70,
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
    // minWidth: 70,
  },
];

const getQuestionKeysName = (custId, quesNo) => `${custId}${quesNo}`;

/*
 * Input: { name: 'aaa', email: 'bb@123.com', custId: 'key,' answers:[3,3,5] }
 * Output: { name: 'aaa', email: 'bb@123.com', custId: 'key', answers:[3,3,2], 'key-0': 3, 'key-1: 3', 'key-2: 5' }
 */
export const transformFormResultData = (data) => {
  const { formCustId: custId } = data;
  const rows = data.results.reduce(
    (acc, cur) => [...acc, { ...cur, ...cur.answers.reduce((a, c, idx) => ({ ...a, [getQuestionKeysName(custId, idx + 1)]: c + 1 }), {}) }],
    []
  );
  return rows;
};

export const transformFormResultColumns = (baseCols, data) => {
  const { formCustId: custId, maxQuestionsCount } = data;
  const questionKeys = Array.from(Array(maxQuestionsCount).keys(), (k) => ({
    field: getQuestionKeysName(custId, k + 1),
    headerName: getQuestionKeysName(custId, k + 1),
    flex: 1,
  }));
  return [...baseCols, ...questionKeys];
};
