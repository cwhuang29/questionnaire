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
import { LinearProgress } from '@mui/material';
import { withStyles } from '@mui/styles';
import { DataGrid, GridOverlay, GridToolbar } from '@mui/x-data-grid';

const columns = [
  {
    field: 'formName',
    headerName: '量表名稱',
    flex: 1,
    minWidth: 90,
    // align: 'center',
  },
  {
    field: 'formCustId',
    headerName: '量表編碼',
    valueFormatter: ({ value }) => ROLES[value],
    flex: 1,
    minWidth: 70,
  },
  {
    field: 'researchName',
    headerName: '所屬計畫',
    flex: 1.5,
    align: 'left',
    renderCell: (params) => (
      <div >
        {params.value.map((p) => (
          <div key={p} style={{ fontSize: '0.8rem !important' }}>{p}</div>
        ))}
      </div>
    ),
  },
  {
    field: 'author',
    headerName: '作者',
    flex: 1,
    minWidth: 60,
  },
  {
    field: 'createdAt',
    headerName: 'Created At',
    flex: 1,
    minWidth: 60,
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

const StyledDataGrid = withStyles({
  root: {
    '& .MuiDataGrid-renderingZone': {
      maxHeight: 'none !important',
    },
    '& .MuiDataGrid-cell': {
      lineHeight: 'unset !important',
      maxHeight: 'none !important',
      whiteSpace: 'normal',
      flexDirection: 'column',
      alignItems: 'flex-start', // Vertically aligned
      justifyContent: 'center', // Horizontally aligned
    },
    '& .MuiDataGrid-row': {
      maxHeight: 'none !important',
      '&:nth-child(2n)': { backgroundColor: 'rgba(235, 235, 235, .7)' },
    },
    '& div[data-rowIndex][role="row"]': {
      // fontSize: 18,
      // height: 60,
      '& div': {
        // height: 60,
        // minHeight: "60px !important",
        // lineHeight: "59px !important"
      },
    },
  },
})(DataGrid);

const FormListView = (props) => {
  const navigate = useNavigate();
  const { data, isLoading, error } = props;

  const rows = data?.constructor === Array ? data : [];

  const onCellDoubleClick = (params) => {
    console.log(params);
    if (params.field === 'formName') {
      navigate(`/form/${params.id}`);
    }
  };

  console.log(rows[0]?.researchName);

  return (
    Object.keys(error).length === 0 && (
      <div style={{ height: '500px' }}>
        <StyledDataGrid
          // autoHeight
          loading={isLoading}
          hideFooterSelectedRowCount
          density='standard'
          disableDensitySelector
          getRowId={(row) => `${row.formCustId}${row.createdAt}`}
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
          // getCellClassName={(params) => (params.value >= 15 ? 'hot' : 'cold')}
          sx={{
            cursor: 'pointer',
            boxShadow: 2,
            border: 2,
            borderColor: 'primary.light',
            '& .MuiDataGrid-cell:hover': {
              color: 'primary.main',
            },
            '& .cold': {
              backgroundColor: '#b9d5ff91',
              color: '#1a3e72',
            },
          }}
        />
      </div>
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
