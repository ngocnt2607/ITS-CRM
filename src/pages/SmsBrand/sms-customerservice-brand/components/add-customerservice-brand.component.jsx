import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Col, Modal, ModalHeader, Row, Label } from 'reactstrap';
import * as Yup from 'yup';
import { SmsBrandAPI } from '../../../../api/sms-brand.api';
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
  brand_type: '',
  brand: '',
  price: '0',
  recordStatus: '',
};

function AddCustomerServiceBrand({
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
    brand_types: [],
    recordStatus: [],
  });
  const validationSchema = useRef(
    Yup.object({
      customer_code: Yup.object().nullable().required('Vui lòng chọn customer_code'),
      service_type: Yup.object().required('Vui lòng chọn loại dịch vụ'),
      brand_type: Yup.object().required('Vui lòng chọn loại Brand'),
      price: Yup.string().required('Vui lòng nhập giá tiền'),
      brand: Yup.string().required('Vui lòng nhập Brand'),
      recordStatus: Yup.object().nullable(),
    })
  ).current;
  const TYPE_OPTION = useRef([
    { label: 'Quảng cáo', value: 'Quảng cáo' },
    { label: 'CSKH', value: 'CSKH' },
  ]).current;
  const TYPE_OPTION1 = useRef([
    { label: 'Hoạt động', value: 'Hoạt động' },
    { label: 'Không hoạt động', value: 'Không hoạt động' },
  ]).current;
  const TYPE_OPTION2 = useRef([
    { label: 'Y Tế, Giáo dục', value: 'Y Te, Giao duc' },
    { label: 'Điện lực', value: 'Dien luc' },
    { label: 'Ngân hàng', value: 'Ngan hang' },
    { label: 'Tài chính, Chứng khoán', value: 'Tai chinh, Chung khoan' },
    { label: 'Thương mại điện tử', value: 'Thuong mai dien tu' },
    { label: 'Hành chính công', value: 'Hanh chinh cong' },
    { label: 'Lĩnh vực khác', value: 'Hanh chinh cong' },
    { label: 'Quốc tế, OTT, MXH', value: 'Quoc te, OTT, MXH' },
    
  ]).current;

  useEffect(() => {
    if (updateRecord) {
      const {
        customer_code,
        service_type,
        brand_type,
        price,
        brand,
        status,
      } = updateRecord;
      setInitialValues({
        customer_code: generateOption(customer_code, customer_code),
        service_type: generateOption(service_type, service_type),
        brand_type: generateOption(brand_type, brand_type),
        price,
        brand,
        recordStatus: generateOption(status, status),
      });
      validationSchema.fields.recordStatus = Yup.object()
      .nullable()
      .required('Vui lòng chọn trạng thái');
      validationSchema.fields.service_type = Yup.object();
      validationSchema.fields.brand_type = Yup.object();
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
        await SmsBrandAPI.updateSmsBrandCustomerService({
          ...values,
          customer_code: values.customer_code?.value,
          service_type: values.service_type?.value,
          brand_type: values.brand_type?.value,
          status: values.recordStatus?.value,
          id: updateRecord.id,
        });
      } else {
        await SmsBrandAPI.createNewSmsBrandCustomerService({
          ...values,
          customer_code: values.customer_code?.value,
          service_type: values.service_type?.value,
          brand_type: values.brand_type?.value,
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
      SmsBrandAPI.getSmsBrandList
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
                  <CustomSelectComponent
                    name='brand_type'
                    options={TYPE_OPTION2}
                    label='Loại Brand'
                    placeholder='Vui lòng chọn loại Brand'
                    disabled={isViewMode}
                  />
                </div>

                <div className='mb-3'>
                  <CustomInputComponent
                    name='brand'
                    label='Brand'
                    placeholder='Vui lòng nhập Brand'
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

AddCustomerServiceBrand.propTypes = {
  openModal: PropTypes.bool,
  getList: PropTypes.func,
  close: PropTypes.func,
  updateRecord: PropTypes.any,
};

export default React.memo(AddCustomerServiceBrand);
