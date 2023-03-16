import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Col, Modal, ModalHeader, Row, Label } from 'reactstrap';
import * as Yup from 'yup';
import { ServiceConfigAPI } from '../../../../api/service-config.api';
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
  packetName: '',
  description: '',
  status: '',
  blockType: '',
};

function AddServicePacket({
  isOpen,
  getList,
  close,
  updateRecord,
  isViewMode,
}) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const [initialValues, setInitialValues] = useState(INIT);
  const TYPE_OPTION = useRef([
    { label: 'Hoạt động', value: 'Hoạt động' },
    { label: 'Tạm dừng', value: 'Tạm dừng' },
  ]).current;
  const TYPE_OPTION1 = useRef([
    { label: '1s + 1', value: '1s + 1' },
    { label: '6s + 1', value: '6s + 1' },
    { label: '1ph + 1ph', value: '1ph + 1ph' },
    { label: '15s + 15 ', value: '15s + 15 ' },
  ]).current;
  const validationSchema = useRef(
    Yup.object({
      packetName: Yup.string().required('Vui lòng nhập tên gói cước'),
      description: Yup.string(),
      recordStatus: Yup.object().nullable(),
      blockType: Yup.object().nullable(),
    })
  ).current;

  useEffect(() => {
    if (updateRecord) {
      const {
        packetName,
        description,
        status,
        blockType,
      } = updateRecord;
      setInitialValues({
        packetName,
        description: description || '',
        recordStatus: generateOption(status, status),
        blockType: generateOption(blockType, blockType),
      });
      validationSchema.fields.recordStatus = Yup.object()
        .nullable()
        .required('Vui lòng chọn trạng thái');
      validationSchema.fields.blockType = Yup.object()
        .nullable()
        .required('Vui lòng chọn Block tính cước');
      return;
    }
    setInitialValues(INIT);
  }, [updateRecord]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (updateRecord) {
        await ServiceConfigAPI.updateServicePacket({
          ...values,
          status: values.recordStatus?.value,
          blockType: values.blockType?.value,
          id: updateRecord.id,
        });
      } else {
        await ServiceConfigAPI.createNewServicePacket({
          ...values,
          status: values.recordStatus?.value,
          blockType: values.blockType?.value,
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
  console.log(formRef.current);

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
            ? 'Xem gói'
            : updateRecord
            ? 'Cật nhật gói'
            : 'Thêm mới gói'}
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
                    name='packetName'
                    label='Tên gói'
                    placeholder='Vui lòng nhập tên gói'
                    disabled={isViewMode}
                  />
                </div>

                <div className='mb-3'>
                  <CustomInputComponent
                    name='description'
                    label='Mô tả'
                    placeholder='Vui lòng nhập mô tả'
                    disabled={isViewMode}
                  />
                </div>

                <div className='mb-3'>
                  <CustomSelectComponent
                    name='recordStatus'
                    options={TYPE_OPTION}
                    label='Trạng thái'
                    placeholder='Vui lòng chọn trạng thái'
                    disabled={isViewMode}
                  />
                </div>

                <div className='mb-3'>
                  <CustomSelectComponent
                    name='blockType'
                    options={TYPE_OPTION1}
                    label='Block tính cước'
                    placeholder='Vui lòng chọn Block tính cước'
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

AddServicePacket.propTypes = {
  openModal: PropTypes.bool,
  getList: PropTypes.func,
  close: PropTypes.func,
  updateRecord: PropTypes.any,
};

export default React.memo(AddServicePacket);
