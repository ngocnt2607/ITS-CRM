import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Col, Modal, ModalHeader, Row } from 'reactstrap';
import * as Yup from 'yup';
import { NumberOwnerAPI } from '../../../../api/number-owner.api';
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
  isdn: '',
  telco: '',
  limits: '',
  vosip: '',
};

function AddNumberOwner({
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
    telcos: [],
    vosips: []
  });
  const validationSchema = useRef(
    Yup.object({
      isdn: Yup.string().required('Vui lòng nhập số chủ'),
      telco: Yup.object().nullable().required('Vui lòng chọn nhà mạng'),
      limits: Yup.string().required('Vui lòng nhập hạn mức'),
      vosip: Yup.object().nullable().required('Vui lòng chọn server VOS'),
    })
  ).current;

  useEffect(() => {
    if (updateRecord) {
      const {
        isdn,
        telco,
        limits,
        vosip,
      } = updateRecord;
      setInitialValues({
        telco: generateOption(telco, telco),
        vosip: generateOption(vosip, vosip),
        isdn,
        limits,
      });
      return;
    }
    setInitialValues(INIT);
  }, [updateRecord]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (updateRecord) {
        await NumberOwnerAPI.updateNumberOwner({
          ...values,
          telco: values.telco?.value,
          vosip: values.vosip?.value,
          id: updateRecord.id,
        });
      } else {
        await NumberOwnerAPI.createNewNumberOwner({
          ...values,
          telco: values.telco?.value,
          vosip: values.vosip?.value
        });
      }
      console.log(values)
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
      PartnerDetailAPI.getTelco,
      PartnerDetailAPI.getListIP,
    ];
    try {
      setLoading(true);
      const response = await Promise.all(listAPI.map((api) => api()));
      setListData((prev) => ({
        ...prev,
        telcos: getListOption(response[0]?.data, 'name', 'name'),
        vosips: getListOption(response[1]?.data, 'name', 'name'),
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
            ? 'Xem Số chủ'
            : updateRecord
            ? 'Cập nhật Số chủ'
            : 'Thêm mới Số chủ'}
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
            <div className='mb-3'>
                  <CustomSelectComponent
                    name='telco'
                    options={listData.telcos}
                    label='Nhà mạng'
                    placeholder='Vui lòng chọn nhà mạng'
                    disabled={isViewMode}
                  />
              </div>

              <div className='mb-3'>
                  <CustomInputComponent
                    name='isdn'
                    label='Số chủ'
                    placeholder='Vui lòng nhập số chủ'
                    disabled={isViewMode}
                  />
              </div>

              <div className='mb-3'>
                  <CustomInputComponent
                    name='limits'
                    label='Hạn mức'
                    placeholder='Vui lòng nhập hạn mức'
                    disabled={isViewMode}
                  />
              </div>

              <div className='mb-3'>
                  <CustomSelectComponent
                    name='vosip'
                    options={listData.vosips}
                    label='Server VOS'
                    placeholder='Vui lòng chọn server VOS'
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
            </Form>
          </Formik>
        </div>
      </Modal>
    </>
  );
}

AddNumberOwner.propTypes = {
  openModal: PropTypes.bool,
  getList: PropTypes.func,
  close: PropTypes.func,
  updateRecord: PropTypes.any,
};

export default React.memo(AddNumberOwner);