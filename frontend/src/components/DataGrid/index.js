import React from 'react';
import PropTypes from 'prop-types';

import messages from '@constants/messages';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LinearProgress } from '@mui/material';
import { withStyles } from '@mui/styles';
import { DataGrid as MuiDataGrid, GridOverlay, GridToolbar } from '@mui/x-data-grid';

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
})(MuiDataGrid);

const DataGrid = (props) => {
  const { rows, columns, isLoading, onCellDoubleClick, height } = props;

  return (
    <div style={{ height: `${height}px` }}>
      <StyledDataGrid
        rows={rows}
        columns={columns}
        loading={isLoading}
        // autoHeight
        hideFooterSelectedRowCount
        disableDensitySelector
        components={{
          Toolbar: GridToolbar,
          LoadingOverlay: CustomLoadingOverlay,
          ColumnSortedDescendingIcon: SortedDescendingIcon,
          ColumnSortedAscendingIcon: SortedAscendingIcon,
          NoRowsOverlay: CustomNoRowsOverlay,
        }}
        onCellDoubleClick={onCellDoubleClick}
        // getRowId={(row) => `${row.formCustId}${row.createdAt}`}
        // getCellClassName={(params) => (params.value >= 15 ? 'hot' : 'cold')}
        sx={{
          cursor: 'pointer',
          boxShadow: 2,
          border: 2,
          borderColor: 'primary.light',
          '& .MuiDataGrid-cell:hover': {
            backgroundColor: '#b9d5ff91',
            color: '#1a3e72',
          },
          '& .cold': {
            backgroundColor: '#b9d5ff91',
            color: '#1a3e72',
          },
        }}
      />
    </div>
  );
};

DataGrid.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onCellDoubleClick: PropTypes.func,
  height: PropTypes.number,
};

DataGrid.defaultProps = {
  rows: [],
  onCellDoubleClick: () => {},
  height: 600,
};

export default DataGrid;
