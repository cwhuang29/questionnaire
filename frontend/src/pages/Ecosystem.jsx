import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Box, Chip, Typography } from '@mui/material';
import { SectionWrapper } from 'components/styledComponents/SectionWrapper';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';

import { flows, flowDetails } from 'shared/constant/scenarioFlows';

const FlowChip = ({ flow }) => (
  <Chip
    label={flow.label}
    clickable
    icon={flow.icon}
    sx={{
      backgroundColor: '#EBEBEB',
      height: '45px',
      borderRadius: '23px',
      fontSize: '1.2rem',
      padding: '0 5px',
      margin: '0 min(32px, 2.5%)',
    }}
    onClick={null}
  />
);

FlowChip.propTypes = {
  flow: PropTypes.object.isRequired,
};

const Ecosystem = () => {
  const { ecosystem } = useParams();
  const currFlow = flows[ecosystem];
  const currFlowDetail = flowDetails[ecosystem];

  return (
    <Box sx={{ color: '#EFEFEF' }}>
      <SectionWrapper padding='8em 0' background='#E8D8BD'>
        <Typography variant='h3' component='div' sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          專為剛畢業的你所打造
        </Typography>
        <div style={{ padding: '35px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {currFlow.map((flow, idx) => (
            <React.Fragment key={flow.label}>
              <FlowChip flow={flow} />
              {idx !== currFlow.length - 1 && <DoubleArrowIcon sx={{ color: '#5B5B5B', fontSize: '31px', position: 'relative', top: '7px' }} />}
            </React.Fragment>
          ))}
        </div>
      </SectionWrapper>
      {currFlowDetail.map((desc) => (
        <SectionWrapper padding='3em 0 1.7em 0' background={desc.backgroundColor}>
          <Typography variant='h3' component='div' sx={{ fontWeight: 'bold', textAlign: 'center' }}>
            {desc.title}
          </Typography>
          <div style={{ padding: '35px min(40px, 3%)', display: 'flex', justifyContent: 'center' }}>
            <img src={desc.image} alt='' height='380' style={{ borderRadius: '20px', width: 'min(40%, 600px)' }} />
            <div style={{ width: 'min(10%, 100px)' }} />
            <Typography variant='h6' component='div' sx={{ width: '45%', whiteSpace: 'pre-line' }}>
              {desc.content}
            </Typography>
          </div>
        </SectionWrapper>
      ))}
    </Box>
  );
};

export default Ecosystem;
