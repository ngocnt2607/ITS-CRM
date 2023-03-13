import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Col, Modal, ModalHeader, Row, Label } from 'reactstrap';
import * as Yup from 'yup';
import { VbnAPI } from '../../../../api/vbn.api';
import { PartnerAPI } from '../../../../api/customer-management.api';
import SingleCalendarComponent from '../../../../Components/Common/calendar/single-calendar.component';
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
  name: '',
  registrationnumber: '',
  registerby: '',
  address: '',
  register: '',
  begintime: '',
  expiretime: '',
};

function AddVbn({
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
    registerbys: [],
  });
  const validationSchema = useRef(
    Yup.object({
      name: Yup.string().nullable().required('Vui lòng nhập tên định danh'),
      registrationnumber: Yup.string().required('Vui lòng nhập số đăng ký định danh'),
      registerby: Yup.object().required('Vui lòng nhập tên đơn vị đăng kí'),
      address: Yup.string().required('Vui lòng nhập địa chỉ'),
      register: Yup.object().nullable(),
      begintime: Yup.string().required('Vui lòng chọn thời gian bắt đầu'),
      expiretime: Yup.string().required(
        'Vui lòng chọn thời gian kết thúc'
      ),
    })
  ).current;
  // const TYPE_OPTION = useRef([
  //   { label: 'Không quảng cáo', value: 'Không quảng cáo' },
  //   { label: 'Quảng cáo', value: 'Quảng cáo' },
  // ]).current;
  const TYPE_OPTION1 = useRef([
    { label: 'Voice Brandname', value: 'Voice Brandname' },
    { label: 'Đăng ký định danh', value: 'Đăng ký định danh' },
  ]).current;

  useEffect(() => {
    if (updateRecord) {
      const {
        name,
        registrationnumber,
        registerby,
        register,
        address,
        begintime,
        expiretime ,
      } = updateRecord;
      setInitialValues({
        name,
        registrationnumber,
        registerby: generateOption(registerby, registerby),
        register: generateOption(register, register),
        address,
        begintime,
        expiretime,
      });
        validationSchema.fields.register = Yup.object()
        .nullable()
        .required('Please select register');
      return;
    }
    setInitialValues(INIT);
  }, [updateRecord]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true); 
      if (updateRecord) {
        await VbnAPI.updateVBN({
          ...values,
          register: values.register?.value,
          registerby: values.registerby?.value,
          id: updateRecord.id,
        });
      } else {
        await VbnAPI.createNewVBN({
          ...values,
          register: values.register?.value,
          registerby: values.registerby?.value,
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
      PartnerAPI.getListPartner
    ];
    try {
      setLoading(true);
      const response = await Promise.all(listAPI.map((api) => api()));
      setListData((prev) => ({
        ...prev,
        registerbys: getListOption(response[0]?.data, 'nickname', 'nickname'),
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
            ? 'Xem định danh'
            : updateRecord
            ? 'Cập nhật định danh'
            : 'Thêm mới định danh'}
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
                  <CustomInputComponent
                    name='name'
                    label='Tên brand'
                    placeholder='Vui lòng nhập tên Brand'
                    disabled={isViewMode}
                  />
                </div>

                <div className='mb-3'>
                  <CustomInputComponent
                    name='registrationnumber'
                    label='Số đăng kí'
                    placeholder='Vui lòng nhập số đăng ký brandname'
                    disabled={isViewMode}
                  />
                </div>

                <div className='mb-3'>
                  <CustomSelectComponent
                    name='registerby'
                    options={listData.registerbys}
                    label='Đơn vị đăng ký'
                    placeholder='Vui lòng nhập tên đơn vị đăng ký'
                    disabled={isViewMode}
                  />
                </div>

                <div className='mb-3'>
                  <CustomInputComponent
                    name='address'
                    label='Địa chỉ'
                    placeholder='Vui lòng nhập địa chỉ'
                    disabled={isViewMode}
                  />
                </div>

                <div className='mb-3'>
                    <CustomSelectComponent
                      name='register'
                      options={TYPE_OPTION1}
                      label='Dịch vụ'
                      placeholder='Vui lòng chọn dịch vụ'
                      disabled={isViewMode}
                    />
                </div>

                <div className='mb-3'>
                  <Label htmlFor='begintime' className='form-label'>
                    Ngày bắt đầu
                  </Label>

                  <SingleCalendarComponent
                    name='begintime'
                    placeholder='Chọn ngày bắt đầu'
                  />
                </div>

                <div className='mb-3'>
                  <Label htmlFor='expiretime' className='form-label'>
                    Ngày kết thúc
                  </Label>
                  <SingleCalendarComponent
                    name='expiretime'
                    placeholder='Chọn ngày kết thúc'
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

AddVbn.propTypes = {
  openModal: PropTypes.bool,
  getList: PropTypes.func,
  close: PropTypes.func,
  updateRecord: PropTypes.any,
};

export default React.memo(AddVbn);
