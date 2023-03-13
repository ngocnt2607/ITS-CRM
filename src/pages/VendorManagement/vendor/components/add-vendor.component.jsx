import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Modal, ModalHeader, Row } from 'reactstrap';
import * as Yup from 'yup';
import { VendorAPI } from '../../../../api/vendor.api';
import addToast from '../../../../Components/Common/add-toast.component';
import CustomInputComponent from '../../../../Components/Common/custom-input.component';
import LoadingComponent from '../../../../Components/Common/loading.component';
import { Message } from '../../../../shared/const/message.const';

const INIT = {
  name: '',
  nickname: '',
  address1: '',
  address2: '',
  phone: '',
  email: '',
  bank: '',
  bankaccount: '',
  bankbranch: '',
};

function AddVendor({ isOpen, getList, close, updateRecord, isViewMode }) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const [initialValues, setInitialValues] = useState(INIT);
  const validationSchema = useRef(
    Yup.object({
      name: Yup.string().required('Vui lòng nhập tên công ty'),
      nickname: Yup.string().required('Vui lòng nhập mã khách hàng'),
      address1: Yup.string().required('Vui lòng nhập địa chỉ'),
      address2: Yup.string(),
      phone: Yup.string().required('Vui lòng nhập số điện thoại'),
      email: Yup.string().required('Vui lòng nhập địa chỉ email'),
      bank: Yup.string(),
      bankaccount: Yup.string(),
      bankbranch: Yup.string(),
    })
  ).current;

  useEffect(() => {
    if (updateRecord) {
      const {
        name,
        nickname,
        address1,
        address2,
        bank,
        bankaccount,
        bankbranch,
        phone,
        email,
      } = updateRecord;
      setInitialValues({
        name,
        address1,
        address2,
        bank: bank || '',
        bankaccount: bankaccount || '',
        bankbranch: bankbranch || '',
        email,
        nickname,
        phone,
      });
      return;
    }
    setInitialValues(INIT);
  }, [updateRecord]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      if (updateRecord) {
        await VendorAPI.updateVendor({
          ...values,
          id: updateRecord.id,
        });
      } else {
        await VendorAPI.createNewVendor(values);
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
            ? 'Xem nhà cung cấp'
            : updateRecord
            ? 'Cập nhật nhà cung cấp'
            : 'Thêm mới nhà cung cấp'}
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
                    name='name'
                    label='Tên công ty'
                    placeholder='Vui lòng nhập tên công ty'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='ml-4'>
                  <CustomInputComponent
                    name='nickname'
                    label='Mã công ty'
                    placeholder='Vui lòng nhập mã công ty'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='mt-3'>
                  <CustomInputComponent
                    name='address1'
                    label='Địa chỉ 1'
                    placeholder='Vui lòng nhập địa chỉ 1'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='ml-4 mt-3'>
                  <CustomInputComponent
                    name='address2'
                    label='Địa chỉ 2'
                    placeholder='Vui lòng nhập địa chỉ 2'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='mt-3'>
                  <CustomInputComponent
                    name='phone'
                    label='Số điện thoại'
                    placeholder='Vui lòng nhập số điện thoại'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='ml-4 mt-3'>
                  <CustomInputComponent
                    name='email'
                    label='Email'
                    placeholder='Vui lòng nhập địa chỉ email'
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

AddVendor.propTypes = {
  openModal: PropTypes.bool,
  getList: PropTypes.func,
  close: PropTypes.func,
  updateRecord: PropTypes.any,
  isViewMode: PropTypes.bool,
};

export default React.memo(AddVendor);
