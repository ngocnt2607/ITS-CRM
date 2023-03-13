import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Col, Modal, ModalHeader, Row } from 'reactstrap';
import * as Yup from 'yup';
import { ContactAPI } from '../../../../api/contact.api';
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

const INIT = {
  partner: '',  
  name: '',
  email: '',
  position: '',
  phone: '',
};

function AddContact({
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
    positions: [],
    partners: [],
  });
  const TYPE_OPTION = useRef([
    { label: 'Giám đốc', value: '0' },
    { label: 'Sale', value: '1' },
    { label: 'Kĩ thuật', value: '2' },
  ]).current;
  const validationSchema = useRef(
    Yup.object({
      partner: Yup.object().nullable().required('Vui lòng chọn đối tác'),
      name: Yup.string().required('Vui lòng nhập tên người đại diện'),
      email: Yup.string().required('Vui lòng nhập email'),
      position: Yup.object().nullable(),
      phone: Yup.string().required('Vui lòng nhập số điện thoại'),
    })
  ).current;

  useEffect(() => {
    if (updateRecord) {
      const {
        partner,
        name,
        email,
        position,
        phone,
      } = updateRecord;
      setInitialValues({
        partner: generateOption(partner, partner),
        name,
        email,
        position: generateOption(position, position),
        phone,
      });
      validationSchema.fields.position = Yup.object()
        .nullable()
        .required('Vui lòng chọn vị trí');
      return;
    }
    validationSchema.fields.position = Yup.object().nullable();
    setInitialValues(INIT);
  }, [updateRecord]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (updateRecord) {
        await ContactAPI.updateContact({
          ...values,
          partner: values.partner?.value,
          position: values.position?.value,
          id: updateRecord.id,
        });
      } else {
        await ContactAPI.createNewContact({
          ...values,
          partner: values.partner?.value,
          position: values.position?.value,
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
    const listAPI = [PartnerDetailAPI.getPartner];
    try {
      setLoading(true);
      const response = await Promise.all(listAPI.map((api) => api()));
      setListData((prev) => ({
        ...prev,
        partners: getListOption(response[0]?.data, 'nickname', 'nickname'),
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
              <div className='mb-3'>
                  <CustomSelectComponent
                    name='partner'
                    options={listData.partners}
                    label='Tên đối tác'
                    placeholder='Vui lòng chọn tên Đối tác'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </div>

                <div className='mb-3'>
                  <CustomInputComponent
                    name='name'
                    label='Người liên hệ'
                    placeholder='Vui lòng nhập người liên hệ'
                    disabled={isViewMode}
                  />
                </div>

                <div className='mb-3'>
                  <CustomInputComponent
                    name='email'
                    label='Email'
                    placeholder='Vui lòng nhập địa chỉ email'
                    disabled={isViewMode}
                  />
                </div>

                <div className='mb-3'>
                  <CustomSelectComponent
                    name='position'
                    options={TYPE_OPTION}
                    label='Vị trí'
                    placeholder='Vui lòng chọn vị trí'
                    disabled={isViewMode}
                  />
                </div>

                <div className='mb-3'>
                  <CustomInputComponent
                    name='phone'
                    label='Điện thoại'
                    placeholder='Vui lòng nhập số điện thoại liên hệ'
                    disabled={isViewMode}
                  />
                </div>
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

AddContact.propTypes = {
  openModal: PropTypes.bool,
  getList: PropTypes.func,
  close: PropTypes.func,
  updateRecord: PropTypes.any,
};

export default React.memo(AddContact);
