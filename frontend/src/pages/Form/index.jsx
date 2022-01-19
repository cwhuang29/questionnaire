import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getFormById } from '@actions/form';
import DataGrid from '@components/DataGrid';
import FormModal from '@components/Form/FormModal';
import PageWrapper from '@components/HomePageWrapper';
import StyledBadge from '@components/styledComponents/StyledBadge';
import ROLES from '@constants/roles';
import apis from '@shared/constants/apis';
import withFetchService from '@shared/hooks/withFetchService';

import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { IconButton, Typography } from '@mui/material';

import { CreateForm } from './CreateForm';

const columns = [
  {
    field: 'assignee',
    headerName: '填寫者',
    flex: 2,
    minWidth: 70,
  },
  {
    field: 'role',
    headerName: '填寫者角色',
    valueFormatter: ({ value }) => ROLES[value],
    flex: 1,
    minWidth: 70,
  },
  {
    field: 'status',
    headerName: '填寫狀態',
    flex: 1.5,
    minWidth: 70,
  },
  {
    field: 'assigner',
    headerName: '寄信者',
    flex: 2,
    minWidth: 70,
  },
  {
    field: 'lastSendTime',
    headerName: '最後一次寄信時間',
    type: 'dateTime',
    valueFormatter: ({ value }) => getDisplayTime(new Date(value)),
    flex: 2,
    minWidth: 70,
  },
];

const getFormByIdForComponent = (formId) => () => getFormById(formId);

const FormView = (props) => {
  const { data, error, isLoading } = props;
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();

  const { formName } = data;
  const modalOnOpen = () => setOpenModal(true);
  const modalOnClose = () => setOpenModal(false);
  const onSubmit = () => {
    const formId = window.location.pathname.split('/').pop();
    navigate(`${apis.V2.UPDATE_FORM}/${formId}`);
  };
  const rows = []; // TODO

  return (
    <PageWrapper>
      {Object.keys(error).length === 0 && (
        <>
          <Typography variant='h3' component='div' sx={{ fontWeight: 'bold', marginBottom: '1em' }}>
            量表：{formName}&nbsp;
            <IconButton aria-label='form-icon-button' style={{ marginTop: '-10px' }} onClick={modalOnOpen}>
              <StyledBadge badgeContent='' color='primary' variant='dot'>
                <InsertDriveFileIcon style={{ fontSize: '50px', color: '#656565' }} />
              </StyledBadge>
            </IconButton>
          </Typography>

          <FormModal open={openModal} onClose={modalOnClose} data={data} submitButtonText='修改' onSubmit={onSubmit} />

          <DataGrid isLoading={isLoading} columns={columns} rows={rows} />
        </>
      )}
    </PageWrapper>
  );
};

const Form = React.memo(() => {
  const { formId } = useParams();
  const FormWithData = withFetchService(FormView, getFormByIdForComponent(formId));
  return <FormWithData />;
});

FormView.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
};

export { CreateForm, Form as default };
