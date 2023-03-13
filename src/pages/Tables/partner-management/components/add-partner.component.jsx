import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Col, Label, Modal, ModalHeader, Row } from 'reactstrap';
import * as Yup from 'yup';
import { PartnerAPI } from '../../../../api/customer-management.api';
// import { PartnerDetailAPI } from '../../../../api/partnerdetail.api';
import addToast from '../../../../Components/Common/add-toast.component';
import CustomInputComponent from '../../../../Components/Common/custom-input.component';
import LoadingComponent from '../../../../Components/Common/loading.component';
import { Message } from '../../../../shared/const/message.const';
// import CustomSelectComponent from '../../../../Components/Common/custom-select/custom-select.component';
// import {
//   generateOption,
//   getListOption,
// } from '../../../../helpers/array.helper';

const INIT = {
  nickname: '',
  taxcode: '',
  email: '',
  address: '',
  company: '',
  phone: '',
  represent: '',
  website: '',
  bank: '',
  bankaccount: '',
  bankbranch: '',
  ip: '',
  name_contact: '',
  email_contact: '',
  phone_contact: '',
  position_contact: '',
  department: '',
};

function AddPartner({
  isOpen,
  getList,
  close,
  updateRecord,
  isViewMode,
}) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const [initialValues, setInitialValues] = useState(INIT);
  // const [listData, setListData] = useState({
  //   ips: []
  // });
  const validationSchema = useRef(
    Yup.object({
      nickname: Yup.string().max(6,'Tên viết tắt tối đa 6 ký tự').required('Vui lòng nhập mã khách hàng'),
      taxcode: Yup.string().required('Vui lòng nhập mã số thuế'),
      ip: Yup.string().required('Vui lòng nhập ip'),
      email: Yup.string(),
      address: Yup.string(),
      company: Yup.string().required('Vui lòng nhập tên công ty'),
      phone: Yup.string(),
      represent: Yup.string(),
      website: Yup.string(),
      bank: Yup.string(),
      bankaccount: Yup.string(),
      bankbranch: Yup.string(),
      name_contact: Yup.string(),
      email_contact: Yup.string(),
      phone_contact: Yup.string(),
      position_contact: Yup.string(),
      department: Yup.string(),
    })
  ).current;

  useEffect(() => {
    if (updateRecord) {
      const {
        nickname,
        taxcode,
        email,
        address,
        company,
        phone,
        represent,
        website,
        bank,
        bankaccount,
        bankbranch,
        ip,
        name_contact,
        email_contact,
        phone_contact,
        position_contact,
        department,
      } = updateRecord;
      setInitialValues({
        nickname,
        taxcode: taxcode || '',
        email: email || '',
        address: address || '',
        company,
        phone: phone || '',
        represent: represent || '',
        website: website || '',
        bank: bank || '',
        bankaccount: bankaccount || '',
        bankbranch: bankbranch || '',
        ip,
        name_contact: name_contact || '',
        email_contact: email_contact || '',
        phone_contact: phone_contact || '',
        position_contact: position_contact || '',
        department: department || '',
      });
      return;
    }
    setInitialValues(INIT);
  }, [updateRecord]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (updateRecord) {
        await PartnerAPI.updatePartner({
          ...values,
          id: updateRecord.id,
        });
      } else {
        await PartnerAPI.createNewPartner({
          ...values,
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

  // const getListData = useCallback(async () => {
  //   const listAPI = [
  //     PartnerDetailAPI.getListIP,
  //   ];
  //   try {
  //     setLoading(true);
  //     const response = await Promise.all(listAPI.map((api) => api()));
  //     setListData((prev) => ({
  //       ...prev,
  //       ips: getListOption(response[0]?.data, 'ip', 'ip'),
  //     }));
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   getListData();
  // }, [getListData]);

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
            ? 'Chi tiết đối tác'
            : updateRecord
            ? 'Cập nhật đối tác'
            : 'Thêm mới đối tác'}
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
                    name='company'
                    label='Công ty'
                    placeholder='Vui lòng nhập công ty'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6}>
                  <CustomInputComponent
                    name='nickname'
                    label='Tên giao dịch'
                    placeholder='Vui lòng nhập tên giao dịch'
                    disabled={isViewMode || updateRecord}
                    // isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>

                <Col lg={6} className='mt-3'>
                  <CustomInputComponent
                    name='taxcode'
                    label='Mã số thuế'
                    placeholder='Vui lòng nhập tên mã số thuế'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='mt-3'>
                  <CustomInputComponent
                    name='ip'
                    label='IP khách hàng'
                    placeholder='Vui lòng nhập IP của khách hàng'
                  />
                </Col>

                <Col lg={6} className='mt-3'>
                  <CustomInputComponent
                    name='email'
                    label='Email'
                    placeholder='Vui lòng nhập địa chỉ email'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='ml-4 mt-3'>
                  <CustomInputComponent
                    name='address'
                    label='Địa chỉ'
                    placeholder='Vui lòng nhập địa chỉ'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='ml-4 mt-3'>
                  <CustomInputComponent
                    name='phone'
                    label='Điện thoại'
                    placeholder='Vui lòng nhập số điện thoại'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='mt-3 ml-4'>
                  <CustomInputComponent
                    name='represent'
                    label='Người đại diện'
                    placeholder='Vui lòng nhập tên người đại diện'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='mt-3 ml-4'>
                  <CustomInputComponent
                    name='website'
                    label='Website'
                    placeholder='Vui lòng nhập Website'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='ml-4 mt-3'>
                  <CustomInputComponent
                    name='bank'
                    label='Ngân hàng'
                    placeholder='Vui lòng nhập ngân hàng'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='mt-3 ml-4'>
                  <CustomInputComponent
                    name='bankaccount'
                    label='Tài khoản ngân hàng'
                    placeholder='Vui lòng nhập tài khoản ngân hàng'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='mt-3 ml-4'>
                  <CustomInputComponent
                    name='bankbranch'
                    label='Chi nhánh ngân hàng'
                    placeholder='Vui lòng nhập chi nhánh ngân hàng'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='mt-3 ml-4'>
                <Label className='form-label' style={{fontSize: '16px'}}>Thông tin người liên hệ:</Label>
                </Col>
                <Col lg={6} className='mt-3 ml-4'>
                <Label className='form-label'></Label>
                </Col>

                <Col lg={6} className='mt-3 ml-4'>
                  <CustomInputComponent
                    name='name_contact'
                    label='Người liên hệ'
                    placeholder='Vui lòng nhập người liên hệ'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='mt-3 ml-4'>
                  <CustomInputComponent
                    name='email_contact'
                    label='Email người liên hệ'
                    placeholder='Vui lòng nhập email người liên hệ'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='mt-3 ml-4'>
                  <CustomInputComponent
                    name='phone_contact'
                    label='Diện thoại người liên hệ'
                    placeholder='Vui lòng nhập điện thoại người liên hệ'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='mt-3 ml-4'>
                  <CustomInputComponent
                    name='position_contact'
                    label='Vị trí người liên hệ'
                    placeholder='Vui lòng nhập vị trí người liên hệ'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='mt-3 ml-4'>
                  <CustomInputComponent
                    name='department'
                    label='Phòng ban người liên hệ'
                    placeholder='Vui lòng nhập phòng ban người liên hệ'
                    disabled={isViewMode}
                  />
                </Col>
              </Row>

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
            </Form>
          </Formik>
        </div>
      </Modal>
    </>
  );
}

AddPartner.propTypes = {
  openModal: PropTypes.bool,
  getList: PropTypes.func,
  close: PropTypes.func,
  updateRecord: PropTypes.any,
  isViewMode: PropTypes.bool,
};

export default React.memo(AddPartner);
