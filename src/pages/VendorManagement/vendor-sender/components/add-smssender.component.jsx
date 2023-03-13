import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Col, Modal, ModalHeader, Row } from 'reactstrap';
import * as Yup from 'yup';
import { SMSVendorAPI } from '../../../../api/sms-vendor.api';
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
  sender_name: '',
  type: '',
  gtel: '0',
  braxis: '0',
  gapit: '0',
  fts: '0',
  vmg: '0',
  imedia: '0',
};

function AddVSmsSender({
  isOpen,
  getList,
  close,
  updateRecord,
  isViewMode,
}) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const [initialValues, setInitialValues] = useState(INIT);
  const validationSchema = useRef(
    Yup.object({
      sender_name: Yup.string().nullable().required('Vui lòng nhập tên Sender'),
      type: Yup.object().nullable(),
      gtel: Yup.string().nullable(),
      braxis: Yup.string().nullable(),
      gapit: Yup.string().nullable(),
      fts: Yup.string().nullable(),
      vmg: Yup.string().nullable(),
      imedia: Yup.string().nullable(),
    })
  ).current;

  const TYPE_OPTION = useRef([
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
        sender_name,
        type,
        gtel,
        braxis,
        gapit,
        fts,
        vmg,
        imedia,
      } = updateRecord;
      setInitialValues({
        sender_name,
        type: generateOption(type, type),
        gtel,
        braxis,
        gapit,
        fts,
        vmg,
        imedia,
      });
      validationSchema.fields.type = Yup.object()
        .nullable()
        .required('Vui lòng chọn loại OTP');
      return;
    }
    setInitialValues(INIT);
  }, [updateRecord]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (updateRecord) {
        await SMSVendorAPI.updateSMSSenderList({
          ...values,
          type: values.type?.value,
          id: updateRecord.id,
        });
      } else {
        await SMSVendorAPI.createSMSSenderList({
          ...values,
          type: values.type?.value,
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
            ? 'Xem Sender'
            : updateRecord
            ? 'Cập nhật Sender'
            : 'Thêm mới Sender'}
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
                    name='sender_name'
                    label='Sender'
                    placeholder='Vui lòng nhập tên Sender'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='ml-4'>
                  <CustomSelectComponent
                      name='type'
                      options={TYPE_OPTION}
                      label='Loại OTP'
                      placeholder='Vui lòng chọn loại OTP'
                      disabled={isViewMode}
                    />
                </Col>

                <Col lg={6} className='mt-3'>
                  <CustomInputComponent
                    name='gtel'
                    label='Gtel'
                    placeholder='Vui lòng nhập giá cho Gtel'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='ml-4 mt-3'>
                  <CustomInputComponent
                    name='braxis'
                    label='Braxis'
                    placeholder='Vui lòng nhập giá cho Braxis'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='mt-3'>
                  <CustomInputComponent
                    name='gapit'
                    label='Gapit'
                    placeholder='Vui lòng nhập giá cho Gapit'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='ml-4 mt-3'>
                  <CustomInputComponent
                    name='fts'
                    label='FTS'
                    placeholder='Vui lòng nhập giá cho Fts'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='mt-3'>
                  <CustomInputComponent
                    name='vmg'
                    label='VMG'
                    placeholder='Vui lòng nhập giá cho VMG'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='mt-3 ml-4'>
                  <CustomInputComponent
                    name='imedia'
                    label='IMEDIA'
                    placeholder='Vui lòng nhập giá cho IMEDIA'
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

AddVSmsSender.propTypes = {
  openModal: PropTypes.bool,
  getList: PropTypes.func,
  close: PropTypes.func,
  updateRecord: PropTypes.any,
};

export default React.memo(AddVSmsSender);
