import styled from 'styled-components';

import Badge from '@mui/material/Badge';

// eslint-disable-next-line no-unused-vars
const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: 9,
    top: 7,
    padding: '0 2px',
    // backgroundColor: '#FBDC30',
    backgroundColor: '#7A9EDA',
  },
}));

export default StyledBadge;
