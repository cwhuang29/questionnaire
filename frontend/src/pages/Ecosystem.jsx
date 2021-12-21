import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Box, Chip, Typography } from '@mui/material';
import { SectionWrapper } from 'components/styledComponents/SectionWrapper';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { scenarioFlowTitles, scenarioFlows, scenarioFlowDetails } from 'shared/constant/scenarioFlows';

const FlowChip = ({ flow }) => (
  <Chip
    clickable
    label={flow.label}
    icon={flow.icon}
    sx={{
      backgroundColor: '#EBEBEB',
      height: '45px',
      borderRadius: '23px',
      fontSize: '1.24rem',
      padding: '0 5px',
      margin: '0 min(32px, 2.2%) 10px min(32px, 2.2%)',
    }}
    onClick={() => document.getElementById(`${flow.label}`).scrollIntoView({ behavior: 'smooth', block: 'start' })}
  />
);

const FlowIntro = ({ detail }) => (
  <div style={{ padding: '35px min(40px, 3%)', display: 'flex', justifyContent: 'center' }}>
    <img src={detail.image} alt='' height='380' style={{ borderRadius: '20px', width: 'min(40%, 550px)' }} />
    <div style={{ width: 'min(10%, 100px)' }} />
    <Typography variant='h6' component='div' sx={{ width: '45%', whiteSpace: 'pre-line' }}>
      {detail.content}
    </Typography>
  </div>
);

const Ecosystem = () => {
  const { ecosystem } = useParams();
  const title = scenarioFlowTitles[ecosystem];
  const flow = scenarioFlows[ecosystem];
  const flowDetail = scenarioFlowDetails[ecosystem];

  return (
    <Box sx={{ color: '#EFEFEF' }}>
      <img
        src='/assets/mascot/mascot_gif.gif'
        alt='SnY mascot'
        width='250'
        style={{
          position: 'absolute',
          top: '95px',
          left: '50px',
          transform: 'scaleX(-1)',
          WebkitTransform: 'scaleX(-1)',
        }}
      />
      <img
        src='/assets/mascot/mascot_gif.gif'
        alt='SnY mascot'
        width='250'
        style={{
          position: 'absolute',
          top: '95px',
          right: '50px',
        }}
      />
      <SectionWrapper padding='8em 0' background='#E8D8BD'>
        <Typography variant='h3' component='div' sx={{ fontWeight: 'bold', textAlign: 'center' }}>
          {title}
        </Typography>
        <div style={{ padding: '35px 0' }} />
        <div style={{ textAlign: 'center' }}>
          {flow.map((f, idx) => (
            <React.Fragment key={f.label}>
              <FlowChip flow={f} />
              {idx !== flow.length - 1 && <DoubleArrowIcon sx={{ color: '#5B5B5B', fontSize: '31px', position: 'relative', top: '7px' }} />}
            </React.Fragment>
          ))}
        </div>
      </SectionWrapper>
      {flowDetail.map((detail) => (
        <React.Fragment key={detail.title}>
          <SectionWrapper id={`${detail.title}`} padding='4em 0 1.8em 0' background={detail.backgroundColor}>
            <Typography variant='h3' component='div' sx={{ fontWeight: 'bold', textAlign: 'center', cursor: 'default' }}>
              {detail.title}
            </Typography>
            <FlowIntro detail={detail} />
          </SectionWrapper>
        </React.Fragment>
      ))}
    </Box>
  );
};

FlowChip.propTypes = {
  flow: PropTypes.object.isRequired,
};

FlowIntro.propTypes = {
  detail: PropTypes.object.isRequired,
};

export default Ecosystem;
