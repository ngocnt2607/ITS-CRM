import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
} from 'react';
import {
  Button,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  Row,
  Label,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';
import * as Yup from 'yup';
import { OtpAPI } from '../../../../api/otp.api';
import addToast from '../../../../Components/Common/add-toast.component';
import CustomInputComponent from '../../../../Components/Common/custom-input.component';
import CustomInputNumberComponent from '../../../../Components/Common/custom-input-number.component';
import LoadingComponent from '../../../../Components/Common/loading.component';
import { Message } from '../../../../shared/const/message.const';
import CustomSelectComponent from '../../../../Components/Common/custom-select/custom-select.component';
import {
  generateOption,
  getListOption,
} from '../../../../helpers/array.helper';
import classnames from 'classnames';
import ConfirmModal from '../../../../Components/Common/ConfirmModal';

const INIT = {
  company: '',
  nickname: '',
  type: '',
  apikey: '',
  link_api: '',
  ip: '',
  balance: '0',
};

function AddOtp({
  isOpen,
  getList,
  close,
  updateRecord,
  isViewMode,
  getList1,
  updateRecord1,
  isViewMode1,
}) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const [modal, setModal] = useState(false);
  const [initialValues, setInitialValues] = useState(INIT);
  const [initialValues1, setInitialValues1] = useState(INIT);
  const [listData, setListData] = useState({
    apikeys: [],
  });
  const [confirmModal, setConfirmModal] = useState(false);
  const currentValues = useRef({});
  const validationSchema = useRef(
    Yup.object({
      company: Yup.string().required('Vui lòng nhập tên công ty'),
      nickname: Yup.string().required('Vui lòng nhập nickname'),
      type: Yup.object().nullable(),
      apikey: Yup.string().required('Vui lòng nhập API Key'),
      link_api: Yup.string().required('Vui lòng nhập link api'),
      ip: Yup.string().required('Vui lòng nhập ip'),
    })
  ).current;

  const validationSchema1 = useRef(
    Yup.object({
      balance: Yup.string().required('Vui lòng nhập số tiền'),
      apikey: Yup.object().nullable().required('Vui lòng chọn API Key'),
    })
  ).current;

  const TYPE_OPTION = useRef([
    { label: 'API', value: 'API' },
    { label: 'SMPP', value: 'SMPP' },
  ]).current;

  const toggle = () => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  };

  const [activeTab, setActiveTab] = useState('1');
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  useEffect(() => {
    if (updateRecord) {
      const { company, nickname, type, apikey, link_api, ip } = updateRecord;
      setInitialValues({
        company,
        nickname,
        apikey,
        type: generateOption(type, type),
        link_api,
        ip,
      });
      validationSchema.fields.type = Yup.object()
        .nullable()
        .required('Vui lòng chọn loại OTP');
      return;
    }
    setInitialValues(INIT);
  }, [updateRecord]);

  useEffect(() => {
    if (updateRecord1) {
      const { apikey, balance } = updateRecord1;
      setInitialValues1({
        apikey: generateOption(apikey, apikey),
        balance,
      });
      validationSchema.fields.type = Yup.object()
        .nullable()
        .required('Vui lòng chọn loại OTP');
      return;
    }
    setInitialValues1(INIT);
  }, [updateRecord1]);

  const handleSubmit = async (values) => {
    currentValues.current = values;
    setConfirmModal(true);
  };

  const handleSubmit1 = async (values) => {
    currentValues.current = values;
    setConfirmModal(true);
  };

  const handleClose = () => {
    formRef.current.resetForm();
    close && close();
  };

  const getListData = useCallback(async () => {
    const listAPI = [OtpAPI.getOTPList];
    try {
      setLoading(true);
      const response = await Promise.all(listAPI.map((api) => api()));
      setListData((prev) => ({
        ...prev,
        apikeys: getListOption(response[0]?.data, 'apikey', 'apikey'),
      }));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListData();
  }, [getListData]);

  const handleClickConfirm = async () => {
    const values = currentValues.current;

    try {
      setLoading(true);
      if (activeTab === '1') {
        if (updateRecord) {
          await OtpAPI.updateOTPList({
            ...values,
            type: values.type?.value,
            id: updateRecord.id,
          });
        } else {
          await OtpAPI.createOTPList({
            ...values,
            type: values.type?.value,
          });
        }
        addToast({
          message: updateRecord
            ? Message.UPDATE_SUCCESS
            : Message.CREATE_SUCCESS,
          type: 'success',
        });

        if (getList) {
          await getList();
        }
        setLoading(false);
        handleClose();
        setConfirmModal(false);
      } else {
        if (updateRecord1) {
          await OtpAPI.updateOTPTopUp({
            ...values,
            apikey: values.apikey?.value,
            id: updateRecord1.id,
          });
        } else {
          await OtpAPI.createOTPTopUp({
            ...values,
            apikey: values.apikey?.value,
          });
        }
        addToast({
          message: updateRecord
            ? Message.UPDATE_SUCCESS
            : Message.CREATE_SUCCESS,
          type: 'success',
        });

        if (getList1) {
          await getList1();
        }
        setLoading(false);
        handleClose();
        setConfirmModal(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <LoadingComponent open={loading} />}

      <Modal
        isOpen={isOpen}
        toggle={toggle}
        onClosed={handleClose}
        modalClassName='flip'
        centered
        size='lg'
      >
        <ModalHeader>
          {isViewMode
            ? 'Xem List OTP Partner'
            : updateRecord
            ? 'Cập nhật OTP Partner'
            : 'Thêm mới OTP Partner'}
          <Button
            type='button'
            onClick={handleClose}
            className='btn-close'
            aria-label='Close'
          ></Button>
        </ModalHeader>

        <div className='modal-content border-0 mt-3'>
          <Nav className='nav-tabs nav-tabs-custom nav-primary p-2 pb-0 bg-light'>
            <NavItem>
              <NavLink
                href='#'
                className={classnames({ active: activeTab === '1' })}
                onClick={() => {
                  toggleTab('1');
                }}
              >
                OTP Partner
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                href='#'
                className={classnames({ active: activeTab === '2' })}
                onClick={() => {
                  toggleTab('2');
                }}
              >
                Top-Up
              </NavLink>
            </NavItem>
          </Nav>
        </div>
        <Formik
          enableReinitialize
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={handleSubmit}
          innerRef={formRef}
        >
          <ModalBody>
            <TabContent activeTab={activeTab}>
              <TabPane tabId='1'>
                <Form action='#'>
                  <Row>
                    <div className='mb-3'>
                      <CustomInputComponent
                        name='company'
                        label='Company'
                        placeholder='Vui lòng nhập tên công ty'
                        disabled={isViewMode}
                      />
                    </div>

                    <div className='mb-3'>
                      <CustomInputComponent
                        name='nickname'
                        label='Nickname'
                        placeholder='Vui lòng nhập Nickname'
                        disabled={isViewMode}
                      />
                    </div>

                    <div className='mb-3'>
                      <CustomInputComponent
                        name='apikey'
                        label='API Key'
                        placeholder='Vui lòng nhập API Key'
                        disabled={isViewMode}
                      />
                    </div>

                    <div className='mb-3'>
                      <CustomInputComponent
                        name='link_api'
                        label='Link API'
                        placeholder='Vui lòng nhập Link API'
                        disabled={isViewMode}
                      />
                    </div>

                    <div className='mb-3'>
                      <CustomInputComponent
                        name='ip'
                        label='IP'
                        placeholder='Vui lòng nhập IP'
                        disabled={isViewMode}
                      />
                    </div>

                    <div className='mb-3'>
                      <CustomSelectComponent
                        name='type'
                        options={TYPE_OPTION}
                        label='Loại OTP'
                        placeholder='Vui lòng chọn loại OTP'
                        disabled={isViewMode}
                      />
                    </div>
                    {!isViewMode && (
                      <div className='hstack gap-2 justify-content-end mt-3'>
                        <Button color='light' onClick={handleClose}>
                          Close
                        </Button>
                        <Button color='primary' type='submit'>
                          Submit
                        </Button>
                      </div>
                    )}
                  </Row>
                </Form>
              </TabPane>
            </TabContent>
          </ModalBody>
        </Formik>

        <Formik
          enableReinitialize
          validationSchema={validationSchema1}
          initialValues={initialValues1}
          onSubmit={handleSubmit1}
          innerRef={formRef}
        >
          <ModalBody>
            <TabContent activeTab={activeTab}>
              <TabPane tabId='2'>
                <Form action='#'>
                  <Row>
                    <div className='mb-3'>
                      <CustomSelectComponent
                        name='apikey'
                        options={listData.apikeys}
                        label='API Key'
                        placeholder='Vui lòng chọn API Key'
                        disabled={isViewMode}
                      />
                    </div>

                    <div className='mb-3'>
                      <CustomInputNumberComponent
                        name='balance'
                        label='Balance'
                        placeholder='Vui lòng nhập Balance'
                        disabled={isViewMode}
                      />
                    </div>
                    {!isViewMode && (
                      <div className='hstack gap-2 justify-content-end mt-3'>
                        <Button color='light' onClick={handleClose}>
                          Close
                        </Button>
                        <Button color='primary' type='submit'>
                          Submit
                        </Button>
                      </div>
                    )}
                  </Row>
                </Form>
              </TabPane>
            </TabContent>
          </ModalBody>
        </Formik>
      </Modal>

      <ConfirmModal
        isOpen={confirmModal}
        close={() => setConfirmModal(false)}
        onClick={handleClickConfirm}
        title='Bạn có chắc chắn muốn submit?'
        header='Xác nhận thêm mới'
        content=''
      />
    </>
  );
}

AddOtp.propTypes = {
  openModal: PropTypes.bool,
  getList: PropTypes.func,
  getList1: PropTypes.func,
  close: PropTypes.func,
  updateRecord: PropTypes.any,
};

export default React.memo(AddOtp);