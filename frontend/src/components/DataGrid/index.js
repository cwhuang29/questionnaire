import React from 'react';
import PropTypes from 'prop-types';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LinearProgress } from '@mui/material';
import { withStyles } from '@mui/styles';
import { DataGrid as MuiDataGrid, GridOverlay, GridToolbar } from '@mui/x-data-grid';

import NoRowsOverlay from './NoRowsOverlay';

const CustomLoadingOverlay = () => (
  <GridOverlay>
    <div style={{ position: 'absolute', top: 0, width: '100%' }}>
      <LinearProgress />
    </div>
  </GridOverlay>
);

const SortedDescendingIcon = () => <ExpandMoreIcon className='icon' />;

const SortedAscendingIcon = () => <ExpandLessIcon className='icon' />;

// To enable dynamic row-height and other styles
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
    '& .MuiDataGrid-cell:hover': {
      backgroundColor: '#b9d5ff91',
      color: '#204376',
    },
    '& .MuiDataGrid-row:hover': {
      backgroundColor: 'inherit',
    },
    '& .MuiDataGrid-row': {
      maxHeight: 'none !important',
      '&:nth-child(2n)': { backgroundColor: 'rgba(235, 235, 235, .6)' },
    },
    // '& div[data-rowIndex][role="row"]': {
    //   fontSize: 18,
    //   height: 60,
    //   '& div': {
    //     height: 60,
    //     minHeight: "60px !important",
    //     lineHeight: "59px !important"
    //   },
    // },
  },
})(MuiDataGrid);

const DataGrid = (props) => {
  const { rows, columns, isLoading, onCellDoubleClick, height, getRowId } = props;

  return (
    <div style={{ height: `${height}px`, width: '100%' }}>
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
          NoRowsOverlay,
        }}
        onCellDoubleClick={onCellDoubleClick}
        sx={{
          cursor: 'pointer',
          boxShadow: 2,
          border: 2,
          borderColor: 'primary.light',
          // '& .cold': { },
        }}
        // getCellClassName={(params) => (params.value >= 15 ? 'hot' : 'cold')}
        getRowId={getRowId}
      />
    </div>
  );
};

DataGrid.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  onCellDoubleClick: PropTypes.func,
  getRowId: PropTypes.func,
  height: PropTypes.number,
};

DataGrid.defaultProps = {
  rows: [],
  onCellDoubleClick: () => {},
  getRowId: () => {},
  height: 600,
};

export default DataGrid;
