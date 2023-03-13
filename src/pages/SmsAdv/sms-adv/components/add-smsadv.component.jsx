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
import { SmsAdvAPI } from '../../../../api/sms-adv.api';
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
  customer_name: '',
  customer_code: '',
  address : '',
  phone: '',
  email: '',
  token: '',
  balance: '0',
};

function AddSmsAdv({
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
    customer_codes: [],
  });
  const [confirmModal, setConfirmModal] = useState(false);
  const currentValues = useRef({});
  const validationSchema = useRef(
    Yup.object({
      customer_name: Yup.string().required('Vui lòng nhập tên khách hàng'),
      customer_code: Yup.string().required('Vui lòng nhập code khách hàng'),
      address : Yup.string(),
      phone: Yup.string(),
      email: Yup.string(),
      token: Yup.string().required('Vui lòng nhập token'),
    })
  ).current;

  const validationSchema1 = useRef(
    Yup.object({
      balance: Yup.string().required('Vui lòng nhập số tiền'),
      customer_code: Yup.object().nullable().required('Vui lòng chọn Code'),
    })
  ).current;

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
      const { customer_name, customer_code, address , phone, email, token } = updateRecord;
      setInitialValues({
        customer_name,
        customer_code,
        address,
        phone,
        email,
        token,
      });
      return;
    }
    setInitialValues(INIT);
  }, [updateRecord]);

  useEffect(() => {
    if (updateRecord1) {
      const { customer_code, balance } = updateRecord1;
      setInitialValues1({
        customer_code: generateOption(customer_code, customer_code),
        balance,
      });
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
    const listAPI = [SmsAdvAPI.getSmsAdvList];
    try {
      setLoading(true);
      const response = await Promise.all(listAPI.map((api) => api()));
      setListData((prev) => ({
        ...prev,
        customer_codes: getListOption(response[0]?.data, 'customer_code', 'customer_code'),
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
          await SmsAdvAPI.updateSmsAdv({
            ...values,
            id: updateRecord.id,
          });
        } else {
          await SmsAdvAPI.createNewSmsAdv({
            ...values,
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
          await SmsAdvAPI.updateSmsAdv({
            ...values,
            customer_code: values.customer_code?.value,
            id: updateRecord1.id,
          });
        } else {
          await SmsAdvAPI.createSmsAdvTopUp({
            ...values,
            customer_code: values.customer_code?.value,
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
            ? 'Xem List SMS Brand'
            : updateRecord
            ? 'Cập nhật SMS Brand'
            : 'Thêm mới SMS Brand'}
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
                Customer Adv
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
                        name='customer_name'
                        label='Tên khách hàng'
                        placeholder='Vui lòng nhập tên khách hàng'
                        disabled={isViewMode}
                      />
                    </div>

                    <div className='mb-3'>
                      <CustomInputComponent
                        name='customer_code'
                        label='Code khách hàng'
                        placeholder='Vui lòng nhập Code của khách hàng'
                        disabled={isViewMode}
                      />
                    </div>

                    <div className='mb-3'>
                      <CustomInputComponent
                        name='address '
                        label='Địa chỉ'
                        placeholder='Vui lòng nhập địa chỉ của khách hàng'
                        disabled={isViewMode}
                      />
                    </div>

                    <div className='mb-3'>
                      <CustomInputComponent
                        name='phone'
                        label='Số điện thoại'
                        placeholder='Vui lòng nhập số điện thoại'
                        disabled={isViewMode}
                      />
                    </div>

                    <div className='mb-3'>
                      <CustomInputComponent
                        name='email'
                        label='Email'
                        placeholder='Vui lòng nhập email'
                        disabled={isViewMode}
                      />
                    </div>

                    <div className='mb-3'>
                      <CustomInputComponent
                        name='token'
                        label='Token'
                        placeholder='Vui lòng nhập Token'
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
                        name='customer_code'
                        options={listData.customer_codes}
                        label='Customer_code'
                        placeholder='Vui lòng chọn Customer_code'
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

AddSmsAdv.propTypes = {
  openModal: PropTypes.bool,
  getList: PropTypes.func,
  getList1: PropTypes.func,
  close: PropTypes.func,
  updateRecord: PropTypes.any,
};

export default React.memo(AddSmsAdv);