import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Col, Modal, ModalHeader, Row, Label } from 'reactstrap';
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

const INIT = {
  customer_code: '',
  service_type: '',
  price: '0',
  recordStatus: '',
};

function AddCustomerServiceAdv({
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
    customer_codes: [],
    service_types: [],
    recordStatus: [],
  });
  const validationSchema = useRef(
    Yup.object({
      customer_code: Yup.object().nullable().required('Vui lòng chọn customer_code'),
      service_type: Yup.object().required('Vui lòng chọn loại dịch vụ'),
      price: Yup.string().required('Vui lòng nhập giá tiền'),
      recordStatus: Yup.object().nullable(),
    })
  ).current;
  const TYPE_OPTION = useRef([
    { label: 'MKT', value: 'MKT' },
    { label: 'OTP', value: 'OTP' },
  ]).current;
  const TYPE_OPTION1 = useRef([
    { label: 'Hoạt động', value: 'Hoạt động' },
    { label: 'Không hoạt động', value: 'Không hoạt động' },
  ]).current;

  useEffect(() => {
    if (updateRecord) {
      const {
        customer_code,
        service_type,
        price,
        status,
      } = updateRecord;
      setInitialValues({
        customer_code: generateOption(customer_code, customer_code),
        service_type: generateOption(service_type, service_type),
        price,
        recordStatus: generateOption(status, status),
      });
      validationSchema.fields.recordStatus = Yup.object()
      .nullable()
      .required('Vui lòng chọn trạng thái');
      validationSchema.fields.service_type = Yup.object();
      return;
    }
    validationSchema.fields.recordStatus = Yup.object()
      .nullable()
      .required('Vui lòng chọn trạng thái');
    setInitialValues(INIT);
  }, [updateRecord]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true); 
      if (updateRecord) {
        await SmsAdvAPI.updateSmsCustomerService({
          ...values,
          customer_code: values.customer_code?.value,
          service_type: values.service_type?.value,
          status: values.recordStatus?.value,
          id: updateRecord.id,
        });
      } else {
        await SmsAdvAPI.createNewSmsCustomerService({
          ...values,
          customer_code: values.customer_code?.value,
          service_type: values.service_type?.value,
          status: values.recordStatus?.value,
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
      SmsAdvAPI.getSmsAdvList
    ];
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

  return (
    <>
      {loading && <LoadingComponent open={loading} />}

      <Modal
        isOpen={isOpen}
        onClosed={handleClose}
        modalClassName='flip'
        centered
      >
        <ModalHeader>
          {isViewMode
            ? 'Xem Customer Service'
            : updateRecord
            ? 'Cập nhật Customer Service'
            : 'Thêm mới Customer Service'}
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
                <div className='mb-3'>
                  <CustomSelectComponent
                    name='customer_code'
                    options={listData.customer_codes}
                    label='Customer Code'
                    placeholder='Vui lòng chọn Customer Code'
                    disabled={isViewMode}
                  />
                </div>

                <div className='mb-3'>
                  <CustomSelectComponent
                    name='service_type'
                    options={TYPE_OPTION}
                    label='Loại dịch vụ'
                    placeholder='Vui lòng chọn loại dịch vụ sử dụng'
                    disabled={isViewMode}
                  />
                </div>

                <div className='mb-3'>
                  <CustomInputNumberComponent
                    name='price'
                    label='Đơn giá'
                    placeholder='Vui lòng nhập đơn giá'
                    disabled={isViewMode}
                  />
                </div>

                <div className='mb-3'>
                <CustomSelectComponent
                      name='recordStatus'
                      options={TYPE_OPTION1}
                      label='Trạng thái'
                      placeholder='Vui lòng chọn trạng thái'
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
          </Formik>
        </div>
      </Modal>
    </>
  );
}

AddCustomerServiceAdv.propTypes = {
  openModal: PropTypes.bool,
  getList: PropTypes.func,
  close: PropTypes.func,
  updateRecord: PropTypes.any,
};

export default React.memo(AddCustomerServiceAdv);
