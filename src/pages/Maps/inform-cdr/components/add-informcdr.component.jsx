import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Col, Modal, ModalHeader, Row, Label } from 'reactstrap';
import * as Yup from 'yup';
import { InformCdrAPI } from '../../../../api/inform-cdr.api';
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
  nickname: '',
  month: '',
  recordStatus: '',
};

function AddInformCdr({
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
    nicknames: [],
  });
  const validationSchema = useRef(
    Yup.object({
      nickname: Yup.object().nullable().required('Vui lòng chọn khách hàng'),
      month: Yup.string().required('Vui lòng nhập tháng năm'),
    })
  ).current;
  const TYPE_OPTION = useRef([
    { label: 'Pending', value: 'Pending' },
    { label: 'Xác nhận', value: 'Xác nhận' },
    { label: 'Hủy', value: 'Hủy' },
  ]).current;
  useEffect(() => {
    if (updateRecord) {
      const {
        nickname,
        month,
        status
      } = updateRecord;
      setInitialValues({
        nickname: generateOption(nickname, nickname),
        month,
        recordStatus: generateOption(status, status),
      });
      validationSchema.fields.recordStatus = Yup.object()
        .nullable()
        .required('Vui lòng chọn trạng thái');
      return;
    }
    setInitialValues(INIT);
  }, [updateRecord]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (updateRecord) {
        await InformCdrAPI.updateInformCdr({
          ...values,
          nickname: values.nickname?.value,
          status: values.recordStatus?.value || '',
          id: updateRecord.id,
        });
      } else {
        await InformCdrAPI.createNewInformCdr({
          ...values,
          nickname: values.nickname?.value,
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
      PartnerAPI.getListPartner,
    ];
    try {
      setLoading(true);
      const response = await Promise.all(listAPI.map((api) => api()));
      setListData((prev) => ({
        ...prev,
        nicknames: getListOption(response[0]?.data, 'nickname', 'nickname'),
      }));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListData();
  }, [getListData]);

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
            ? 'Xem Thông báo cước'
            : updateRecord
            ? 'Cật nhật thông báo'
            : 'Thêm thông báo cước mới'}
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
                    name='vendor_name'
                    options={listData.nicknames}
                    label='Khách hàng'
                    placeholder='Vui lòng chọn khách hàng'
                  />
                </div>

                <div className='mb-3'>
                  <CustomInputComponent
                    name='month'
                    label='Tháng'
                    placeholder='Vui lòng nhập ngày tháng'
                  />
                </div>
                <Label className='form-label'>Ví dụ xuất tháng 3 thì nhập: 202303</Label>

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

AddInformCdr.propTypes = {
  openModal: PropTypes.bool,
  getList: PropTypes.func,
  close: PropTypes.func,
  updateRecord: PropTypes.any,
};

export default React.memo(AddInformCdr);
