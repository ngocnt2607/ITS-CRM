import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Col, Modal, ModalHeader, Row } from 'reactstrap';
import * as Yup from 'yup';
import { VendorContactAPI } from '../../../../api/vendor-contact.api';
import addToast from '../../../../Components/Common/add-toast.component';
import CustomInputComponent from '../../../../Components/Common/custom-input.component';
import LoadingComponent from '../../../../Components/Common/loading.component';
import { Message } from '../../../../shared/const/message.const';
import CustomSelectComponent from '../../../../Components/Common/custom-select/custom-select.component';
import {
  generateOption,
  getListOption,
} from '../../../../helpers/array.helper';

const INIT = {
  vendor_name: '',
  name: '',
  email: '',
  department: '',
  address: '',
  phone: '',
  bank: '',
  bankaccount: '',
  bankbranch: '',
};

function AddVendorContact({
  isOpen,
  getList,
  close,
  updateRecord,
  isViewMode,
}) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const [initialValues, setInitialValues] = useState(INIT);
  const [listData, setListData] = useState({
    vendor_names: [],
  });
  const validationSchema = useRef(
    Yup.object({
      vendor_name: Yup.object().nullable().required('Please Enter Name'),
      name: Yup.string().required('Please Enter Nick Name'),
      email: Yup.string().required('Please Enter Address'),
      department: Yup.string().required('Please Enter Address'),
      address: Yup.string().required('Please Enter Phone number'),
      phone: Yup.string().required('Please Enter Email'),
      bank: Yup.string(),
      bankaccount: Yup.string(),
      bankbranch: Yup.string(),
    })
  ).current;

  useEffect(() => {
    if (updateRecord) {
      const {
        vendor_name,
        name,
        email,
        phone,
        department,
        address,
        bank,
        bankaccount,
        bankbranch,
      } = updateRecord;
      setInitialValues({
        vendor_name: generateOption(vendor_name, vendor_name),
        name,
        email,
        phone,
        department,
        address,
        bank: bank || '',
        bankaccount: bankaccount || '',
        bankbranch: bankbranch || '',
      });
      return;
    }
    setInitialValues(INIT);
  }, [updateRecord]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (updateRecord) {
        await VendorContactAPI.updateVendorContact({
          ...values,
          vendor_name: values.vendor_name?.value,
          id: updateRecord.id,
        });
      } else {
        await VendorContactAPI.createNewVendorContact({
          ...values,
          vendor_name: values.vendor_name?.value,
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
    const listAPI = [VendorContactAPI.getVendorNameList];
    try {
      setLoading(true);
      const response = await Promise.all(listAPI.map((api) => api()));
      setListData((prev) => ({
        ...prev,
        vendor_names: getListOption(response[0]?.data, 'name', 'name'),
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
            ? 'Xem liên hệ'
            : updateRecord
            ? 'Cập nhật liên hệ'
            : 'Thêm mới liên hệ'}
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
                  <CustomSelectComponent
                    name='vendor_name'
                    options={listData.vendor_names}
                    label='Tên công ty'
                    placeholder='Vui lòng chọn tên Công ty'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>

                <Col lg={6} className='ml-4'>
                  <CustomInputComponent
                    name='name'
                    label='Người liên hệ'
                    placeholder='Vui lòng nhập tên người liên hệ'
                    disabled={isViewMode}
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
                    name='phone'
                    label='Điện thoại'
                    placeholder='Vui lòng nhập số điện thoại liên hệ'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='mt-3'>
                  <CustomInputComponent
                    name='department'
                    label='Phòng ban'
                    placeholder='Vui lòng nhập tên phòng ban'
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

                <Col lg={4} className='mt-3'>
                  <CustomInputComponent
                    name='bank'
                    label='Ngân hàng'
                    placeholder='Vui lòng nhập ngân hàng'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={4} className='mt-3 ml-4'>
                  <CustomInputComponent
                    name='bankaccount'
                    label='Tài khoản ngân hàng'
                    placeholder='Vui lòng nhập tài khoản ngân hàng'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={4} className='mt-3 ml-4'>
                  <CustomInputComponent
                    name='bankbranch'
                    label='Chi nhánh ngân hàng'
                    placeholder='Vui lòng nhập chi nhánh ngân hàng'
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

AddVendorContact.propTypes = {
  openModal: PropTypes.bool,
  getList: PropTypes.func,
  close: PropTypes.func,
  updateRecord: PropTypes.any,
};

export default React.memo(AddVendorContact);
