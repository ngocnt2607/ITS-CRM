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
  customer_name: '',
  service_type: '',
  coding: '',
  recordStatus: '',
  message: '',
};

function AddMessageTemplateAdv({
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
    customer_names: [],
    service_types: [],
    recordStatus: [],
    codings: [],
  });
  const validationSchema = useRef(
    Yup.object({
      customer_name: Yup.object().nullable().required('Vui lòng chọn tên khách hàng'),
      service_type: Yup.object().required('Vui lòng chọn loại dịch vụ'),
      coding: Yup.object().required('Vui lòng chọn loại tin nhắn'),
      recordStatus: Yup.object().nullable(),
      message: Yup.string().required('Vui lòng nhập message template'),
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
  const TYPE_OPTION2 = useRef([
    { label: 'Tin không dấu', value: 'Tin không dấu' },
    { label: 'Tin có dấu', value: 'Tin có dấu' },
  ]).current;

  useEffect(() => {
    if (updateRecord) {
      const {
        customer_name,
        service_type,
        coding,
        status,
        message
      } = updateRecord;
      setInitialValues({
        customer_name: generateOption(customer_name, customer_name),
        service_type: generateOption(service_type, service_type),
        coding: generateOption(coding, coding),
        recordStatus: generateOption(status, status),
        message,
      });
      validationSchema.fields.recordStatus = Yup.object()
      .nullable()
      .required('Vui lòng chọn trạng thái');
      validationSchema.fields.service_type = Yup.object();
      validationSchema.fields.coding = Yup.object();
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
        await SmsAdvAPI.updateSmsMessageTemplate({
          ...values,
          customer_name: values.customer_name?.value,
          service_type: values.service_type?.value,
          status: values.recordStatus?.value,
          coding: values.coding?.value,
          id: updateRecord.id,
        });
      } else {
        await SmsAdvAPI.createNewSmsMessageTemplate({
          ...values,
          customer_name: values.customer_name?.value,
          service_type: values.service_type?.value,
          status: values.recordStatus?.value,
          coding: values.coding?.value,
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
        customer_names: getListOption(response[0]?.data, 'customer_name', 'customer_name'),
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
            ? 'Xem Message Template'
            : updateRecord
            ? 'Cập nhật Message Template'
            : 'Thêm mới Message Template'}
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
                    name='customer_name'
                    options={listData.customer_names}
                    label='Customer Name'
                    placeholder='Vui lòng chọn Customer Name'
                    disabled={isViewMode}
                  />
                </div>

                <div className='mb-3'>
                  <CustomInputComponent
                    name='message'
                    label='Message'
                    placeholder='Vui lòng nhập Message Tempalte'
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
                  <CustomSelectComponent
                    name='coding'
                    label='Coding'
                    options={TYPE_OPTION2}
                    placeholder='Vui lòng chọn loại tin nhắn'
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

AddMessageTemplateAdv.propTypes = {
  openModal: PropTypes.bool,
  getList: PropTypes.func,
  close: PropTypes.func,
  updateRecord: PropTypes.any,
};

export default React.memo(AddMessageTemplateAdv);
