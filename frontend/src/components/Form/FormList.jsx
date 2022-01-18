import React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getAllForms } from '@actions/form';
import messages from '@constants/messages';
import ROLES from '@constants/roles';
import withFetchService from '@shared/hooks/withFetchService';
import { getDisplayTime } from '@utils/time';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LinearProgress from '@mui/material/LinearProgress';
import { DataGrid, GridOverlay, GridToolbar } from '@mui/x-data-grid';

const columns = [
  {
    field: 'id',
    headerName: 'ID',
    width: 150,
    type: 'number', // 'string' (default) 'number' 'date' 'dateTime' 'boolean' 'singleSelect' 'actions'
    // editable: true,
    // valueOptions: ['optionA', 'optionB', 'optionC'] // If the column type is 'singleSelect', you need to set the valueOptions
    // renderHeader: (params) => (<strong>{'Birthday '}<span role='img' aria-label='enjoy'>🎂</span></strong>), // Add additional decorators in the header
  },
  { field: 'name', headerName: 'Form Name', width: 150 },
  {
    field: 'role',
    headerName: 'Role',
    valueFormatter: ({ value }) => ROLES[value],
  },
  { field: 'author', headerName: 'Author', width: 150 },
  {
    field: 'created_at',
    headerName: 'Created At',
    width: 200,
    type: 'dateTime',
    valueFormatter: ({ value }) => getDisplayTime(new Date(value)),
  },
];

const CustomLoadingOverlay = () => (
  <GridOverlay>
    <div style={{ position: 'absolute', top: 0, width: '100%' }}>
      <LinearProgress />
    </div>
  </GridOverlay>
);

const SortedDescendingIcon = () => <ExpandMoreIcon className='icon' />;

const SortedAscendingIcon = () => <ExpandLessIcon className='icon' />;

const CustomNoRowsOverlay = () => (
  <div
    style={{
      display: 'flex',
      top: '58px',
      left: 0,
      right: 0,
      bottom: 0,
      height: 'auto',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      overflow: 'hidden',
    }}
  >
    {messages.NO_DATA}
  </div>
);

const FormListView = (props) => {
  const navigate = useNavigate();
  const { data, isLoading, error } = props;

  const rows = data.constructor === Array ? data : [];

  const onCellDoubleClick = (params) => {
    if (params.field === 'name') {
      navigate(`/form/${params.id}`);
    }
  };

  return (
    Object.keys(error).length === 0 && (
      <DataGrid
        autoHeight
        loading={isLoading}
        hideFooterSelectedRowCount
        editMode='row'
        density='standard'
        disableDensitySelector
        components={{
          Toolbar: GridToolbar,
          LoadingOverlay: CustomLoadingOverlay,
          ColumnSortedDescendingIcon: SortedDescendingIcon,
          ColumnSortedAscendingIcon: SortedAscendingIcon,
          NoRowsOverlay: CustomNoRowsOverlay,
        }}
        onCellDoubleClick={onCellDoubleClick}
        columns={columns}
        rows={rows}
        style={{ cursor: 'pointer' }}
      />
    )
  );
};

const getAllFormsForComponent = () => () => getAllForms();

const FormList = withFetchService(FormListView, getAllFormsForComponent());

FormListView.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
};

export default FormList;
