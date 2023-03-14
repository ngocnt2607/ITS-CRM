import { Form, Formik, useFormik, FieldArray } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Col, Label, Modal, ModalHeader, Row } from 'reactstrap';
import * as Yup from 'yup';
import { TicketAPI } from '../../../../api/ticket.api';
import { PartnerDetailAPI } from '../../../../api/partnerdetail.api';
import addToast from '../../../../Components/Common/add-toast.component';
import CustomInputComponent from '../../../../Components/Common/custom-input.component';
import CustomTextareaComponent from '../../../../Components/Common/custom-textarea.component';
import LoadingComponent from '../../../../Components/Common/loading.component';
import { Message } from '../../../../shared/const/message.const';
import CustomSelectComponent from '../../../../Components/Common/custom-select/custom-select.component';
import {
  generateOption,
  getListOption,
} from '../../../../helpers/array.helper';
import { Typography } from '@mui/material';

const INIT = {
  nickname1: '',
  nickname2: '',
  nickname3: '',
  ip: '',
  recordStatus: '',
  note: '',
  test: [
    {
      number: '',
      callin: '',
      callout: '',
      onnet: '',
      offnet: '',
      telco: '',
      brand_name: '',
    },
  ],
};

function AddTicket({ isOpen, getList, close, updateRecord, isViewMode }) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const [initialValues, setInitialValues] = useState(INIT);
  const [listData, setListData] = useState({
    nickname1s: [],
    nickname2s: [],
    nickname3s: [],
    callins: [],
    callouts: [],
    onnets: [],
    offnets: [],
    recordStatus: [],
    telcos: []
  });
  const TYPE_OPTION = useRef([
    { label: 'ON', value: 'ON' },
    { label: 'OFF', value: 'OFF' },
  ]).current;
  const TYPE_OPTION1 = useRef([
    { label: 'Hoàn thành', value: 'Hoàn thành' },
    { label: 'Hủy', value: 'Hủy' },
  ]).current;
  const validationSchema = useRef(
    Yup.object({
      nickname1: Yup.object().nullable().required('Vui lòng chọn khách hàng'),
      nickname2: Yup.object().nullable(),
      nickname3: Yup.object().nullable(),
      ip: Yup.string().required('Vui lòng nhập IP của khách hàng'),
      // number: Yup.string().required('Vui lòng nhập thông tin thuê bao'),
      // telco: Yup.string().required('Vui lòng chọn nhà mạng'),
      // callin: Yup.object().nullable(),
      // callout: Yup.object().nullable(),
      // onnet: Yup.object().nullable(),
      // offnet: Yup.object().nullable(),
      recordStatus: Yup.object().nullable(),
      note: Yup.string(),
      brand_name: Yup.string(),
    })
  ).current;

  useEffect(() => {
    if (updateRecord) {
      const {
        nickname1,
        nickname2,
        nickname3,
        ip,
        number,
        callin,
        callout,
        onnet,
        offnet,
        telco,
        test,
        status,
        note,
        brand_name,
      } = updateRecord;
      setInitialValues({
        note,
        brand_name,
        // telco,
        nickname1: generateOption(nickname1, nickname1),
        nickname2: generateOption(nickname2, nickname2),
        nickname3: generateOption(nickname3, nickname3),
        ip,
        test: JSON.parse(test.replace(/'/g, '"')),
        // number,
        // callin: generateOption(callin, callin),
        // callout: generateOption(callout, callout),
        // onnet: generateOption(onnet, onnet),
        // offnet: generateOption(offnet, offnet),
        recordStatus: generateOption(status, status),
      });
      validationSchema.fields.recordStatus = Yup.object()
        .nullable()
        .required('Vui lòng chọn trạng thái');
      return;
    }
    validationSchema.fields.recordStatus = Yup.object().nullable();
    setInitialValues(INIT);
  }, [updateRecord]);

  const handleSubmit = async (values) => {
    try {
      console.log('aa');
      setLoading(true);
      const testArray = values.test?.map((item) => ({
        ...item,
        telco: item.telco?.value || '',
        callin: item.callin?.value || '',
        callout: item.callout?.value || '',
        onnet: item.onnet?.value || '',
        offnet: item.offnet?.value || '',
      }));
      if (updateRecord) {
        await TicketAPI.updateTicket({
          ...values,
          test: testArray,
          nickname1: values.nickname1?.value || '',
          nickname2: values.nickname2?.value || '',
          nickname3: values.nickname3?.value || '',
          status: values.recordStatus?.value || '',
          ticket_id: updateRecord.ticket_id,
        });
      } else {
        await TicketAPI.createNewTicket({
          ...values,
          test: testArray,
          nickname1: values.nickname1?.value || '',
          nickname2: values.nickname2?.value || '',
          nickname3: values.nickname3?.value || '',
          status: values.recordStatus?.value || '',
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
      PartnerDetailAPI.getPartner,
      PartnerDetailAPI.getTelco,
    ];
    try {
      setLoading(true);
      const response = await Promise.all(listAPI.map((api) => api()));
      setListData((prev) => ({
        ...prev,
        nickname1s: getListOption(response[0]?.data, 'nickname', 'nickname'),
        nickname2s: getListOption(response[0]?.data, 'nickname', 'nickname'),
        nickname3s: getListOption(response[0]?.data, 'nickname', 'nickname'),
        telcos: getListOption(response[1]?.data, 'name', 'name'),
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
        style={{ maxWidth: '65%', margin: '0 auto' }}
      >
        <ModalHeader>
          {isViewMode
            ? 'Xem Ticket'
            : updateRecord
            ? 'Cập nhật Ticket'
            : 'Thêm mới Ticket'}
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
            {({ values }) => {
              return (
                <Form>
                  <Row>
                    <Col lg={4}>
                      <CustomSelectComponent
                        name='nickname1'
                        options={listData.nickname1s}
                        label='Đối tác'
                        placeholder='Vui lòng chọn Đối tác'
                        isDisabled={isViewMode || !!updateRecord}
                      />
                    </Col>

                    <Col lg={4} className='ml-4'>
                      <CustomSelectComponent
                        name='nickname2'
                        options={listData.nickname2s}
                        label='Đối tác cấp 2'
                        placeholder='Vui lòng chọn Đối tác'
                        isDisabled={isViewMode || !!updateRecord}
                      />
                    </Col>

                    <Col lg={4} className='ml-4'>
                      <CustomSelectComponent
                        name='nickname3'
                        options={listData.nickname3s}
                        label='Đối tác cấp 3'
                        placeholder='Vui lòng chọn Đối tác'
                        isDisabled={isViewMode || !!updateRecord}
                      />
                    </Col>

                    <Col lg={6} className='mt-3'>
                      <CustomTextareaComponent
                        name='ip'
                        label='IP Đối tác'
                        placeholder='Vui lòng nhập IP Đối tác'
                        disabled={isViewMode || !!updateRecord}
                        rows={5}
                        cols={10}
                      />
                    </Col>

                    {updateRecord && (
                      <Col lg={6} className='ml-4 mt-3'>
                        <CustomSelectComponent
                          name='recordStatus'
                          options={TYPE_OPTION1}
                          label='Trạng thái'
                          placeholder='Vui lòng chọn trạng thái Ticket'
                          disabled={isViewMode}
                        />
                      </Col>
                    )}

                    <Col lg={6} className='ml-4 mt-3'>
                      <CustomInputComponent
                        name='note'
                        label='Ghi chú'
                        placeholder='Vui lòng nhập Ghi chú'
                        disabled={isViewMode || !!updateRecord}
                      />
                    </Col>

                    {/* VIETTEL */}
                    <FieldArray name='test'>
                      {({ push, remove }) => (
                        <>
                          <Col lg={12} className='mt-3 ml-4'>
                            <Typography variant='body2'>Thông tin đấu nối</Typography>
                          </Col>
                          {values.test && values.test.map((test, index) => (
                            <React.Fragment key={index}>
                              <Col lg={6} className='ml-4 mt-3'>
                                <CustomTextareaComponent
                                  name={`test[${index}].number`}
                                  label='Thông tin thuê bao'
                                  placeholder='Vui lòng nhập thông tin thuê bao'
                                  disabled={isViewMode || !!updateRecord}
                                  rows={5}
                                  cols={10}
                                />
                              </Col>

                              <Col lg={6}>
                                <Row>
                                  <Col lg={4} className='mt-3'>
                                    <CustomSelectComponent
                                      name={`test[${index}].telco`}
                                      label='Nhà mạng'
                                      options={listData.telcos}
                                      placeholder='Chọn nhà mạng'
                                      isDisabled={isViewMode || !!updateRecord}
                                    />
                                  </Col>

                                  <Col lg={4} className='mt-3'>
                                    <CustomInputComponent
                                      name={`test[${index}].brand_name`}
                                      label='Tên Brand'
                                      placeholder='Vui lòng nhập tên Brand'
                                      isDisabled={isViewMode || !!updateRecord}
                                    />
                                  </Col>

                                  <Col lg={4} className='ml-4 mt-3'>
                                    <CustomSelectComponent
                                      name={`test[${index}].onnet`}
                                      options={TYPE_OPTION}
                                      label='On Net'
                                      placeholder='On Net'
                                      isDisabled={isViewMode || !!updateRecord}
                                    />
                                  </Col>

                                  <Col lg={4} className='ml-4 mt-3'>
                                    <CustomSelectComponent
                                      name={`test[${index}].callin`}
                                      options={TYPE_OPTION}
                                      label='Call In'
                                      placeholder='Call in'
                                      isDisabled={isViewMode || !!updateRecord}
                                    />
                                  </Col>

                                  <Col lg={4} className='ml-4 mt-3'>
                                    <CustomSelectComponent
                                      name={`test[${index}].callout`}
                                      options={TYPE_OPTION}
                                      label='Call Out'
                                      placeholder='Call out'
                                      isDisabled={isViewMode || !!updateRecord}
                                    />
                                  </Col>

                                  <Col lg={4} className='ml-4 mt-3'>
                                    <CustomSelectComponent
                                      name={`test[${index}].offnet`}
                                      options={TYPE_OPTION}
                                      label='Off Net'
                                      placeholder='Off Net'
                                      isDisabled={isViewMode || !!updateRecord}
                                    />
                                  </Col>
                                </Row>
                              </Col>

                              <Col lg={1} className='ml-4 mt-3'>
                                <Button onClick={() => remove(index)}>
                                  Delete
                                </Button>
                              </Col>
                              <Col lg={11} className='ml-4 mt-3'>
                                <Button
                                  onClick={() =>
                                    push({
                                      telco: '',
                                      number: '',
                                      brand_name: '',
                                      callin: '',
                                      callout: '',
                                      onnet: '',
                                      offnet: '',
                                    })
                                  }
                                >
                                  Add
                                </Button>
                              </Col>
                            </React.Fragment>
                          ))}
                        </>
                      )}
                    </FieldArray>
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
              );
            }}
          </Formik>
        </div>
      </Modal>
    </>
  );
}

AddTicket.propTypes = {
  openModal: PropTypes.bool,
  getList: PropTypes.func,
  close: PropTypes.func,
  updateRecord: PropTypes.any,
};

export default React.memo(AddTicket);
