import React, { useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getFormById } from '@actions/form';
import DataGrid from '@components/DataGrid';
import FormModal from '@components/Form/FormModal';
import PageWrapper from '@components/HomePageWrapper';
import { AssignmentModal, EmailNotificationModal } from '@components/Modal';
import StyledBadge from '@components/styledComponents/StyledBadge';
import ROLES from '@constants/roles';
import formService from '@services/form.service';
import notificationService from '@services/notification.service';
import withFetchService from '@shared/hooks/withFetchService';

import AssignmentIcon from '@mui/icons-material/Assignment';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MailIcon from '@mui/icons-material/Mail';
import { IconButton, Typography } from '@mui/material';

// TODO
const testEmails = [
  { email: 'a1@gmail.com', role: 'student' },
  { email: 'a2@gmail.com', role: 'student' },
  { email: 'a3@gmail.com', role: 'teacher' },
  { email: 'a4@gmail.com', role: 'parent' },
];

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

const getURLQueryFormId = () => window.location.pathname.split('/').pop(); // e.g. http://127.0.0.1/form/5

const FormModalIcon = ({ onClick }) => (
  <IconButton aria-label='icon-button' style={{ marginTop: '-5px' }} onClick={onClick}>
    <StyledBadge badgeContent='' color='primary' variant='dot'>
      <InsertDriveFileIcon style={{ fontSize: '35px', color: '#656565' }} />
    </StyledBadge>
  </IconButton>
);

const AssignmentModalIcon = ({ onClick }) => (
  <IconButton aria-label='icon-button' style={{ marginTop: '-5px' }} onClick={onClick}>
    <AssignmentIcon style={{ fontSize: '35px', color: '#656565' }} />
  </IconButton>
);

const NotificationModalIcon = ({ onClick }) => (
  <IconButton aria-label='icon-button' style={{ marginTop: '-5px' }} onClick={onClick}>
    <MailIcon style={{ fontSize: '35px', color: '#656565' }} />
  </IconButton>
);

const FormActionItem = ({ title, Icon }) => (
  <Typography variant='h5' component='div' sx={{ fontWeight: 'bold', marginBottom: '1em', textAlign: 'left' }}>
    {title}&nbsp;{Icon}
  </Typography>
);

const FormView = (props) => {
  const { data, error, isLoading } = props;
  const [openFormModal, setOpenFormModal] = useState(false);
  const [openAssignmentModal, setOpenAssignmentModal] = useState(false);
  const [openNotificationModal, setOpenNotificationModal] = useState(false);
  const navigate = useNavigate();

  const formId = getURLQueryFormId();
  const { formName } = data;
  const rows = []; // TODO

  const formModalOnOpen = () => setOpenFormModal(true);
  const formModalOnClose = () => setOpenFormModal(false);
  const assignmentModalOnOpen = () => setOpenAssignmentModal(true);
  const assignmentModalOnClose = () => setOpenAssignmentModal(false);
  const notificationModalOnOpen = () => setOpenNotificationModal(true);
  const notificationModalOnClose = () => setOpenNotificationModal(false);

  const formOnSubmit = () => navigate(`/update/form/${formId}`, { state: data }); // The key should be 'state'
  const AssignmentOnSubmit = (assignmentData) => formService.assignForm(formId, assignmentData);
  const notificationOnSubmit = (notificationData) => notificationService.sendEmailNotificaionByFormId(formId, notificationData);

  return (
    <PageWrapper>
      {Object.keys(error).length === 0 && !isLoading ? (
        <>
          <Typography variant='h3' component='div' sx={{ fontWeight: 'bold', marginBottom: '1em' }}>
            量表—{formName}
          </Typography>

          <FormModal open={openFormModal} onClose={formModalOnClose} formData={data} submitButtonText='修改' onSubmit={formOnSubmit} />
          <AssignmentModal open={openAssignmentModal} onClose={assignmentModalOnClose} submitButtonText='送出' onSubmit={AssignmentOnSubmit} />
          <EmailNotificationModal
            open={openNotificationModal}
            onClose={notificationModalOnClose}
            submitButtonText='確認寄信'
            onSubmit={notificationOnSubmit}
            emailList={testEmails}
          />

          <FormActionItem title='查看量表' Icon={<FormModalIcon onClick={formModalOnOpen} />} />
          <FormActionItem title='分配量表' Icon={<AssignmentModalIcon onClick={assignmentModalOnOpen} />} />
          <FormActionItem title='寄通知信' Icon={<NotificationModalIcon onClick={notificationModalOnOpen} />} />

          <DataGrid isLoading={isLoading} columns={columns} rows={rows} />
          <br />
          <br />
        </>
      ) : (
        <div />
      )}
    </PageWrapper>
  );
};

const Form = React.memo(() => {
  const { formId } = useParams();
  const FormWithData = withFetchService(FormView, getFormByIdForComponent(formId));
  return <FormWithData />;
});

FormModalIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
};

AssignmentModalIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
};

NotificationModalIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
};

FormActionItem.propTypes = {
  title: PropTypes.string.isRequired,
  Icon: PropTypes.element.isRequired,
};

FormView.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
};

export default Form;
