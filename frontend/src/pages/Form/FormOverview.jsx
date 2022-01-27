import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

import { getFormById } from '@actions/form';
import DataGrid from '@components/DataGrid';
import FormModal from '@components/Form/FormModal';
import PageWrapper from '@components/HomePageWrapper';
import { AssignmentModal, EmailNotificationModal } from '@components/Modal';
import StyledBadge from '@components/styledComponents/StyledBadge';
import { GLOBAL_MESSAGE_SERVERITY } from '@constants/styles';
import { useGlobalMessageContext } from '@hooks/useGlobalMessageContext';
import formService from '@services/form.service';
import notificationService from '@services/notification.service';
import withFetchService from '@shared/hooks/withFetchService';

import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import MailIcon from '@mui/icons-material/Mail';
import { IconButton, Typography } from '@mui/material';
import { GridActionsCellItem } from '@mui/x-data-grid';

import {
  formResultBaseColumns,
  formStatusBaseColumns,
  getFormResultRowId,
  getFormStatusRowId,
  transformFormResultColumns,
  transformFormResultData,
} from './formOverviewData';

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

const Title = ({ children }) => (
  <Typography variant='h5' component='div' sx={{ fontWeight: 'bold', marginBottom: '1em', textAlign: 'left' }}>
    {children}
  </Typography>
);

const SpaceingComponent = () => <div style={{ marginBottom: '2.5em' }} />;

const FormOverViewView = (props) => {
  const { data, error, isLoading } = props;
  const [openFormModal, setOpenFormModal] = useState(false);
  const [openAssignmentModal, setOpenAssignmentModal] = useState(false);
  const [openNotificationModal, setOpenNotificationModal] = useState(false);
  const [isFetchingFormAssignStatusData, setIsFetchingFormAssignStatusData] = useState(true);
  const [formAssignStatusData, setFormAssignStatusData] = useState([]);
  const [isFetchingFormResultData, setIsFetchingFormResultData] = useState(true);
  const [formResultData, setFormResultData] = useState([]);
  const [formResultColumns, setFormResultColumns] = useState([]);
  const navigate = useNavigate();
  const { addGlobalMessage } = useGlobalMessageContext();

  const formId = getURLQueryFormId();
  const { data: formData = {} } = data;

  const formModalOnOpen = () => setOpenFormModal(true);
  const formModalOnClose = () => setOpenFormModal(false);
  const assignmentModalOnOpen = () => setOpenAssignmentModal(true);
  const assignmentModalOnClose = () => setOpenAssignmentModal(false);
  const notificationModalOnOpen = () => setOpenNotificationModal(true);
  const notificationModalOnClose = () => setOpenNotificationModal(false);

  const formOnSubmit = () => {
    navigate(`/update/form/${formId}`, { state: formData }); // The key should be 'state'
  };
  const AssignmentOnSubmit = async (assignmentData) => {
    const resp = await formService.createFormStatus(formId, assignmentData);
    setIsFetchingFormAssignStatusData(true); // Note: the form status and notification history won't update until emails are sent out
    return resp;
  };
  const notificationOnSubmit = async (notificationData) => {
    const resp = await notificationService.sendEmailNotificaionByFormId(formId, notificationData);
    setIsFetchingFormAssignStatusData(true);
    return resp;
  };

  useEffect(() => {
    if (!isFetchingFormAssignStatusData) {
      return;
    }
    setIsFetchingFormAssignStatusData(true);
    formService
      .getFormStatus(formId)
      .then((resp) => setFormAssignStatusData(resp.data))
      .catch((err) =>
        addGlobalMessage({
          title: err.title,
          content: err.content,
          severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
          timestamp: Date.now(),
        })
      )
      .finally(() => setIsFetchingFormAssignStatusData(false));
  }, [isFetchingFormAssignStatusData]);

  useEffect(() => {
    setIsFetchingFormResultData(true);
    formService
      .getFormResult(formId)
      .then((resp) => {
        const transformedData = transformFormResultData(resp.data);
        const transformedColumns = transformFormResultColumns(formResultBaseColumns, resp.data);
        setFormResultData(transformedData);
        setFormResultColumns(transformedColumns);
      })
      .catch((err) =>
        addGlobalMessage({
          title: err.title,
          content: err.content,
          severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
          timestamp: Date.now(),
        })
      )
      .finally(() => setIsFetchingFormResultData(false));
  }, []);

  const deleteFormStatus = (params) => () => {
    // Note: the index of data has been set to writerEmail by getRowId(), so the following two lines are equivalent in this case
    const { id } = params;
    const email = params.row.writerEmail;

    formService
      .deleteFormStatus(formId, { email })
      .then((resp) => {
        addGlobalMessage({
          title: resp.title,
          content: resp.content,
          severity: GLOBAL_MESSAGE_SERVERITY.SUCCESS,
          timestamp: Date.now(),
        });

        const remainRows = formAssignStatusData.filter((d) => d.writerEmail !== id);
        setFormAssignStatusData(remainRows); // This is the only way to update rows in datagrid
      })
      .catch((err) => {
        addGlobalMessage({
          title: err.title,
          content: err.content,
          severity: GLOBAL_MESSAGE_SERVERITY.ERROR,
          timestamp: Date.now(),
        });
      });
  };

  const formStatusActionColumn = useMemo(
    () => ({
      field: 'actions',
      headerName: 'Delete',
      type: 'actions',
      align: 'center',
      width: 80,
      getActions: (params) => [<GridActionsCellItem icon={<DeleteIcon />} label='Delete' onClick={deleteFormStatus(params)} /* showInMenu */ />],
    }),
    [formAssignStatusData] // Otherwise formAssignStatusData in the deleteFormStatus() equals to its initial value, i.e. {}
  );

  const formStatusColumns = [...formStatusBaseColumns, formStatusActionColumn];

  return (
    <PageWrapper>
      {Object.keys(error).length === 0 && !isLoading ? (
        <>
          <Typography variant='h3' component='div' sx={{ fontWeight: 'bold', margin: ' 0.3em 0 0.8em' }}>
            量表—{formData.formName}
          </Typography>

          <FormModal open={openFormModal} onClose={formModalOnClose} formData={formData} submitButtonText='修改' onSubmit={formOnSubmit} />
          <AssignmentModal open={openAssignmentModal} onClose={assignmentModalOnClose} submitButtonText='送出' onSubmit={AssignmentOnSubmit} />
          <EmailNotificationModal
            open={openNotificationModal}
            onClose={notificationModalOnClose}
            submitButtonText='確認寄信'
            onSubmit={notificationOnSubmit}
            isFetchingEmail={isFetchingFormAssignStatusData}
            emailList={formAssignStatusData}
          />

          <FormActionItem title='查看量表' Icon={<FormModalIcon onClick={formModalOnOpen} />} />
          <FormActionItem title='分配量表' Icon={<AssignmentModalIcon onClick={assignmentModalOnOpen} />} />
          <FormActionItem title='寄通知信' Icon={<NotificationModalIcon onClick={notificationModalOnOpen} />} />

          <Title>量表填寫狀況</Title>
          <DataGrid isLoading={isFetchingFormAssignStatusData} columns={formStatusColumns} rows={formAssignStatusData} getRowId={getFormStatusRowId} />
          <SpaceingComponent />

          <Title>量表回答狀況</Title>
          <DataGrid isLoading={isFetchingFormResultData} columns={formResultColumns} rows={formResultData} getRowId={getFormResultRowId} />
          <SpaceingComponent />
        </>
      ) : (
        <div />
      )}
    </PageWrapper>
  );
};

const FormOverview = React.memo(() => {
  const { formId } = useParams();
  const FormOverviewWithData = withFetchService(FormOverViewView, getFormByIdForComponent(formId));
  return <FormOverviewWithData />;
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

Title.propTypes = {
  children: PropTypes.string.isRequired,
};

FormOverViewView.propTypes = {
  data: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.object.isRequired,
};

export default FormOverview;