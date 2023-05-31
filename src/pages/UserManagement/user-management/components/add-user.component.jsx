import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import {
  Button, Col, Modal, ModalHeader, ModalBody, Row, Label, Nav,
  NavItem, NavLink, TabContent, TabPane
} from 'reactstrap';
import * as Yup from 'yup';
import { UserListAPI } from '../../../../api/user-list.api';
import { PartnerAPI } from '../../../../api/customer-management.api';
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
  recordStatus: '',
};

function AddUser({
  isOpen,
  getList,
  close,
  updateRecord,
  isViewMode,
}) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const [initialValues, setInitialValues] = useState(INIT);
  const [modal, setModal] = useState(false);
  const [listData, setListData] = useState({
    groups: [],
    partners: [],
    recordStatus: [],
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

  const TYPE_OPTION = useRef([
    { label: 'Hoạt động', value: 'Hoạt Động' },
    { label: 'Tạm dừng', value: 'Tạm Dừng' },
  ]).current;

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

  const handleClose = () => {
    formRef.current.resetForm();
    close && close();
  };

  const getListData = useCallback(async () => {
    const listAPI = [
      UserListAPI.getGroupList,
      PartnerDetailAPI.getPartner,
      PartnerAPI.getListPartner,
    ];
    try {
      setLoading(true);
      const response = await Promise.all(listAPI.map((api) => api()));
      setListData((prev) => ({
        ...prev,
        groups: getListOption(response[0]?.data, 'name', 'name'),
        partners: getListOption(response[2]?.data, 'nickname', 'nickname'),
      }));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListData();
  }, [getListData]);

  return (
    <>
      {loading && <LoadingComponent open={loading} />}

      <Modal
        isOpen={isOpen}
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

        <div className='modal-body'>
          <Formik
            enableReinitialize
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            innerRef={formRef}
          >
            <Form>
              <Row>
                <Col lg={6}>
                  <CustomInputComponent
                    name='fullname'
                    label='Họ và tên'
                    placeholder='Vui lòng nhập Họ và tên'
                    disabled={isViewMode}
                  />
                </Col>

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

                {updateRecord && (
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
          </Formik>
        </div>
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
