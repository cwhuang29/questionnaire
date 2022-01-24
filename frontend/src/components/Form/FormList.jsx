import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getAllForms } from '@actions/form';
import DataGrid from '@components/DataGrid';
import withFetchService from '@shared/hooks/withFetchService';
import { getDisplayTime } from '@utils/time';

const columns = [
  {
    field: 'formName',
    headerName: '量表名稱',
    flex: 1,
    // align: 'center',
  },
  {
    field: 'formCustId',
    headerName: '量表編碼',
    flex: 1,
  },
  {
    field: 'researchName',
    headerName: '所屬計畫',
    flex: 1,
    align: 'left',
    renderCell: (params) => (
      <div>
        {params.value.map((p) => (
          <div key={p} style={{ fontSize: '0.8rem !important', margin: '2px 0px' }}>
            {p}
          </div>
        ))}
      </div>
    ),
  },
  {
    field: 'author',
    headerName: '作者',
    flex: 0.5,
  },
  {
    field: 'updatedAt',
    headerName: 'Updated At',
    flex: 0.75,
    type: 'dateTime',
    valueFormatter: ({ value }) => getDisplayTime(new Date(value)),
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    flex: 0.75,
    type: 'dateTime',
    valueFormatter: ({ value }) => getDisplayTime(new Date(value)),
  },
];

const FormListView = (props) => {
  const navigate = useNavigate();
  const { data, error, isLoading } = props;
  const { data: formData = [] } = data;
  // const rows = data?.constructor === Array ? data : []; // withFetchService HOC returns {} when response is not ready yet

  const onCellDoubleClick = (params) => {
    if (params.field === 'formName') {
      navigate(`/forms/${params.id}`);
    }
  };

  return (
    Object.keys(error).length === 0 && <DataGrid isLoading={isLoading} columns={columns} rows={formData} onCellDoubleClick={onCellDoubleClick} height={820} />
  );
};

const getAllFormsForComponent = () => getAllForms();

const FormList = withFetchService(FormListView, getAllFormsForComponent);

FormListView.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
};

export default FormList;
