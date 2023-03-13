import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import { Button, Col, Modal, ModalHeader, ModalBody, Row, Label,  Nav,
  NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import * as Yup from 'yup';
import { UserListAPI } from '../../../../api/user-list.api';
import { PartnerDetailAPI } from '../../../../api/partnerdetail.api';
import addToast from '../../../../Components/Common/add-toast.component';
import CustomInputComponent from '../../../../Components/Common/custom-input.component';
import LoadingComponent from '../../../../Components/Common/loading.component';
import { Message } from '../../../../shared/const/message.const';
import CustomSelectComponent from '../../../../Components/Common/custom-select/custom-select.component';
import {
  generateOption,
  getListOption,
} from '../../../../helpers/array.helper';
import classnames from "classnames";

const INIT = {
  username: '',
  fullname: '',
  email: '',
  password: '',
  group: '',
  phonenumber: '',
  partner: [],
  account: [],
  recordStatus: '',
};

function AddUser({
  isOpen,
  getList,
  close,
  updateRecord,
  isViewMode,
  getList1, updateRecord1, isViewMode1
}) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const [initialValues, setInitialValues] = useState(INIT);
  const [modal, setModal] = useState(false);
  const [initialValues1, setInitialValues1] = useState(INIT);
  const [selectedNickname, setSelectedNickname] = useState('');
  const [listData, setListData] = useState({
    groups: [],
    partners: [],
    recordStatus: [],
  });
  const [listAccountPartner, setListAccountPartner] = useState({
    accounts: [],
  });
  const validationSchema = useRef(
    Yup.object({
      username: Yup.string().required('Vui lòng nhập tên đăng nhập'),
      password: Yup.string(),
      fullname: Yup.string().required('Vui lòng nhập họ tên'),
      email: Yup.string().required('Vui lòng nhập Email'),
      phonenumber: Yup.string().required('Vui lòng nhập số điện thoại'),
      group: Yup.object().nullable().required('Vui lòng chọn role'),
      partner: Yup.array(),
      recordStatus: Yup.object().nullable(),
    })
  ).current;

  const validationSchema1 = useRef(
    Yup.object({
      username: Yup.string().required('Vui lòng nhập tên đăng nhập'),
      password: Yup.string(),
      fullname: Yup.string().required('Vui lòng nhập họ tên'),
      email: Yup.string().required('Vui lòng nhập Email'),
      phonenumber: Yup.string().required('Vui lòng nhập số điện thoại'),
      group: Yup.object().nullable().required('Vui lòng chọn role'),
      partner: Yup.object().nullable().required('Vui lòng chọn partner'),
      account: Yup.array(),
      recordStatus: Yup.object().nullable(),
    })
  ).current;
  const TYPE_OPTION = useRef([
    { label: 'Hoạt động', value: 'Hoạt Động' },
    { label: 'Tạm dừng', value: 'Tạm Dừng' },
  ]).current;

  const toggle = () => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  };

  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  useEffect(() => {
    if (updateRecord) {
      const {
        username,
        fullname,
        email,
        password,
        group,
        phonenumber,
        partner,
        status,
      } = updateRecord;
      setInitialValues({
        username,
        fullname,
        email,
        password,
        group: generateOption(group, group),
        phonenumber,
        recordStatus: generateOption(status, status),
        partner:
        partner?.split(',')?.map((item) => generateOption(item, item)) || [],
      });
      validationSchema.fields.recordStatus = Yup.object().nullable().required('Vui lòng chọn trạng thái');
      return;
    }
    validationSchema.fields.recordStatus = Yup.object().nullable();
    setInitialValues(INIT);
  }, [updateRecord]);

  useEffect(() => {
    if (updateRecord1) {
      const {
        username,
        fullname,
        email,
        password,
        group,
        phonenumber,
        partner,
        account,
        status,
      } = updateRecord1;
      setInitialValues1({
        username,
        fullname,
        email,
        password,
        group: generateOption(group, group),
        phonenumber,
        recordStatus: generateOption(status, status),
        partner: generateOption(partner, partner),
        account:
        account?.split(',')?.map((item) => generateOption(item, item)) || [],
      });
      validationSchema.fields.recordStatus = Yup.object().nullable().required('Vui lòng chọn trạng thái');
      return;
    }
    validationSchema.fields.recordStatus = Yup.object().nullable();
    setInitialValues1(INIT);
  }, [updateRecord1]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (updateRecord) {
        await UserListAPI.updateUser({
          ...values,
          group: values.group?.value,
          status: values.recordStatus?.value,
          partner: values.partner?.map((item) => item?.value)?.join(','),
          id: updateRecord.id,
        });
      } else {
        await UserListAPI.createNewUser({
          ...values,
          group: values.group?.value,
          status: values.recordStatus?.value,
          partner: values.partner?.map((item) => item?.value)?.join(','),
        });
      }
      addToast({
        message: updateRecord ? Message.UPDATE_SUCCESS : Message.CREATE_SUCCESS,
        type: 'success',
      });

      if (getList) {
        await getList();
      }
      setLoading(false);
      handleClose();
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSubmit1 = async (values) => {
    try {
      setLoading(true);
      if (updateRecord1) {
        await UserListAPI.updateUser({
          ...values,
          group: values.group?.value,
          status: values.recordStatus?.value,
          partner: values.partner?.value,
          account: values.account?.map((item) => item?.value)?.join(','),
          id: updateRecord1.id,
        });
      } else {
        await UserListAPI.createNewUser({
          ...values,
          group: values.group?.value,
          status: values.recordStatus?.value,
          partner: values.partner?.value,
          account: values.account?.map((item) => item?.value)?.join(','),
        });
      }
      addToast({
        message: updateRecord1 ? Message.UPDATE_SUCCESS : Message.CREATE_SUCCESS,
        type: 'success',
      });

      if (getList1) {
        await getList1();
      }
      setLoading(false);
      handleClose();
    } catch (error) {
      setLoading(false);
    }
  };

  const handleClose = () => {
    formRef.current.resetForm();
    close && close();
  };

  const getListData = useCallback(async () => {
    const listAPI = [
      UserListAPI.getGroupList,
      PartnerDetailAPI.getPartner,
    ];
    try {
      setLoading(true);
      const response = await Promise.all(listAPI.map((api) => api()));
      setListData((prev) => ({
        ...prev,
        groups: getListOption(response[0]?.data, 'name', 'name'),
        partners: getListOption(response[1]?.data, 'nickname', 'nickname'),
      }));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListData();
  }, [getListData]);

  useLayoutEffect(() => {
    const handleCallAPI = async () => {
      const listAPI1 = [
        UserListAPI.getAccount,
      ];
      try {
        setLoading(true);
        const response = await Promise.all(
          listAPI1.map((api) => api(selectedNickname))
        );
        setListAccountPartner({
          accounts: getListOption(response[0]?.data, 'name', 'name'),
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    if (formRef.current) {
      formRef.current.setFieldValue('account', []);
    }
    if (selectedNickname) {
      handleCallAPI();
    } else {
      setListAccountPartner({
        accounts: [],
      });
    }
  }, [selectedNickname]);

  const handleChangeSelectedNickname = (value) => {
    setSelectedNickname(value);
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
            ? 'Xem tài khoản'
            : updateRecord
            ? 'Cập nhật tài khoản'
            : 'Thêm mới tài khoản'}
          <Button
            type='button'
            onClick={handleClose}
            className='btn-close'
            aria-label='Close'
          ></Button>
        </ModalHeader>

        <div className="modal-content border-0 mt-3">
              <Nav className="nav-tabs nav-tabs-custom nav-primary p-2 pb-0 bg-light">
                <NavItem>
                  <NavLink
                    href="#"
                    className={classnames({ active: activeTab === "1" })}
                    onClick={() => {
                      toggleTab("1");
                    }}
                  >
                    Tạo tài khoản nội bộ
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    href="#"
                    className={classnames({ active: activeTab === "2" })}
                    onClick={() => {
                      toggleTab("2");
                    }}
                  >
                    Tạo tài khoản khách hàng
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
            <TabPane tabId="1">
              <Form action="#">
                <Row>
                  <Col lg={6}>
                  <CustomInputComponent
                    name='fullname'
                    label='Họ và tên'
                    placeholder='Vui lòng nhập Họ và tên'
                    disabled={isViewMode}
                  />
                  </Col>

                  {/* <Col lg={6} className='ml-4'>
                    <CustomSelectComponent
                    name='type'
                    options={TYPE_OPTION}
                    label='Loại hợp đồng'
                    placeholder='Vui lòng chọn loại hợp đồng'
                  />
                  </Col> */}

                  <Col lg={6} className='ml-4'>
                  <CustomInputComponent
                    name='username'
                    label='Tên đăng nhập'
                    placeholder='Vui lòng nhập tên đăng nhập'
                    disabled={isViewMode}
                  />
                  </Col>

                  <Col lg={6} className='ml-4 mt-3'>
                  <CustomSelectComponent
                    name='group'
                    options={listData.groups}
                    label='Role'
                    placeholder='Vui lòng chọn Role cho user'
                    disabled={isViewMode}
                  />
                  </Col>
                
                  <Col lg={6} className='mt-3'>
                  <CustomSelectComponent
                    name='partner'
                    options={listData.partners}
                    label='Khách hàng quản lý'
                    placeholder='Vui lòng chọn Khách hàng quản lý của user'
                    isAll
                    isMulti
                    disabled={isViewMode}
                   />
                 </Col>

                  <Col lg={6} className='mt-3 ml-4'>
                  <CustomInputComponent
                    name='email'
                    label='Email'
                    placeholder='Vui lòng nhập địa chỉ email'
                    disabled={isViewMode}
                    />
                  </Col> 
                  
                  <Col lg={6} className='mt-3'>
                  <CustomInputComponent
                    name='phonenumber'
                    label='Điện thoại'
                    placeholder='Vui lòng nhập số điện thoại'
                    disabled={isViewMode}
                    />
                  </Col>
                  
                  <Col lg={6} className='mt-3 ml-4'>
                  <CustomInputComponent
                    name='password'
                    label='Mật khẩu'
                    type='password'
                    className='form-control pe-5'
                    placeholder='Vui lòng nhập mật khẩu'
                    disabled={isViewMode || !!updateRecord}
                  />
                  </Col>

                  {updateRecord &&(
                  <Col lg={6} className='mt-3'>
                     <CustomSelectComponent
                      name='recordStatus'
                      options={TYPE_OPTION}
                      label='Trạng thái'
                      placeholder='Vui lòng chọn trạng thái'
                      disabled={isViewMode}
                    />
                  </Col>
                  )}
                
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
            <TabPane tabId="2">
              <Form action="#">
                <Row>
                  <Col lg={6} className="mb-3">
                  <CustomInputComponent
                    name='fullname'
                    label='Họ và tên'
                    placeholder='Vui lòng nhập Họ và tên'
                    disabled={isViewMode1}
                  />
                  </Col>

                  {/* <Col lg={6} className='ml-4'>
                    <CustomSelectComponent
                    name='type'
                    options={TYPE_OPTION}
                    label='Loại hợp đồng'
                    placeholder='Vui lòng chọn loại hợp đồng'
                  />
                  </Col> */}

                  <Col lg={6} className='ml-4'>
                  <CustomInputComponent
                    name='username'
                    label='Tên đăng nhập'
                    placeholder='Vui lòng nhập tên đăng nhập'
                    disabled={isViewMode1}
                  />
                  </Col>

                  <Col lg={6} className='ml-4 mt-3'>
                  <CustomSelectComponent
                    name='group'
                    options={listData.groups}
                    label='Role'
                    placeholder='Vui lòng chọn Role cho user'
                    disabled={isViewMode1}
                  />
                  </Col>

                  <Col lg={6} className='mt-3'>
                  <CustomSelectComponent
                    name='partner'
                    options={listData.partners}
                    label='Khách hàng quản lý'
                    placeholder='Vui lòng chọn Khách hàng quản lý của user'
                    disabled={isViewMode1}
                    onChange={handleChangeSelectedNickname}
                  />
                  </Col>

                  <Col lg={6} className='ml-4 mt-3'>
                  <CustomSelectComponent
                    name='account'
                    options={listAccountPartner.accounts}
                    label='Tào khoản quản lý'
                    placeholder='Vui lòng chọn tài khoản mà user quản lý'
                    isAll
                    isMulti
                    disabled={isViewMode1}
                  />
              </Col>
                
                  <Col lg={6} className='mt-3 ml-4'>
                  <CustomInputComponent
                    name='email'
                    label='Email'
                    placeholder='Vui lòng nhập địa chỉ email'
                    disabled={isViewMode1}
                   />
                 </Col>

                  <Col lg={6} className='mt-3 ml-4'>
                  <CustomInputComponent
                    name='phonenumber'
                    label='Điện thoại'
                    placeholder='Vui lòng nhập số điện thoại'
                    disabled={isViewMode1}
                    />
                  </Col> 
                  
                  <Col lg={6} className='mt-3'>
                  <CustomInputComponent
                    name='password'
                    label='Mật khẩu'
                    type='password'
                    className='form-control pe-5'
                    placeholder='Vui lòng nhập mật khẩu'
                    disabled={isViewMode1 || !!updateRecord1}
                    />
                  </Col>

                  {updateRecord1 &&(
                  <Col lg={6} className='mt-3'>
                     <CustomSelectComponent
                      name='recordStatus'
                      options={TYPE_OPTION}
                      label='Trạng thái'
                      placeholder='Vui lòng chọn trạng thái'
                      disabled={isViewMode1}
                    />
                  </Col>
                  )}
                
                {!isViewMode1 && (
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
    </>
  );
}


AddUser.propTypes = {
  openModal: PropTypes.bool,
  getList: PropTypes.func,
  close: PropTypes.func,
  updateRecord: PropTypes.any,
  isViewMode: PropTypes.bool,
};

export default React.memo(AddUser);
