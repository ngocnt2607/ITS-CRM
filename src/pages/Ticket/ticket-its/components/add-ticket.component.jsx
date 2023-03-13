import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react';
import { Button, Col, Label, Modal, ModalHeader, Row } from 'reactstrap';
import * as Yup from 'yup';
import { TicketAPI } from '../../../../api/ticket.api';
import { PartnerAPI } from '../../../../api/customer-management.api';
import { PartnerDetailAPI } from '../../../../api/partnerdetail.api';
import { IpAPI } from '../../../../api/ip.api';
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
import UploadXlsxComponent from './upload-xlsx-ticket.component';
import AutocompleteControllerComponent from '../../../../Components/Common/autocomplete/autocomplete.component';

const INIT = {
  nickname1: '',
  nickname2: '',
  nickname3: '',
  ip: '',
  number: '',
  number1: '',
  number2: '',
  number3: '',
  callin: '',
  callout: '',
  onnet: '',
  offnet: '',
  callin1: '',
  callout1: '',
  onnet1: '',
  offnet1: '',
  callin2: '',
  callout2: '',
  onnet2: '',
  offnet2: '',
  callin3: '',
  callout3: '',
  onnet3: '',
  offnet3: '',
  recordStatus: '',
  note: '',
  telco: 'VIETTEL',
  telco1: 'MOBIFONE',
  telco2: 'VINAPHONE',
  telco3: 'GMOBILE',
  brand_name: '',
  brand_name1: '',
  brand_name2: '',
  brand_name3: '',

};

function AddTicket({
  isOpen,
  getList,
  close,
  updateRecord,
  isViewMode,
}) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const [selectedNickname, setSelectedNickname] = useState('');
  const [isVinaphone, setIsVinaphone] = useState(false);
  const [initialValues, setInitialValues] = useState(INIT);
  const [xlsxData, setXlsxData] = useState(null);
  const [listData, setListData] = useState({
    nickname1s: [],
    nickname2s: [],
    nickname3s: [],
    callins: [],
    callouts: [],
    onnets: [],
    offnets: [],
    callin1s: [],
    callout1s: [],
    onnet1s: [],
    offnet1s: [],
    callin2s: [],
    callout2s: [],
    onnet2s: [],
    offnet2s: [],
    callin3s: [],
    callout3s: [],
    onnet3s: [],
    offnet3s: [],
    recordStatus: [],
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
      number: Yup.string(),
      number1: Yup.string(),
      number2: Yup.string(),
      number3: Yup.string(),
      telco: Yup.string(),
      telco1: Yup.string(),
      telco2: Yup.string(),
      telco3: Yup.string(),
      callin: Yup.object().nullable(),
      callout: Yup.object().nullable(),
      onnet: Yup.object().nullable(),
      offnet: Yup.object().nullable(),
      callin1: Yup.object().nullable(),
      callout: Yup.object().nullable(),
      onnet1: Yup.object().nullable(),
      offnet1: Yup.object().nullable(),
      callin2: Yup.object().nullable(),
      callout2: Yup.object().nullable(),
      onnet2: Yup.object().nullable(),
      offnet2: Yup.object().nullable(),
      callin3: Yup.object().nullable(),
      callout3: Yup.object().nullable(),
      onnet3: Yup.object().nullable(),
      offnet3: Yup.object().nullable(),
      recordStatus: Yup.object().nullable(),
      note: Yup.string(),
      brand_name: Yup.string(),
      brand_name1: Yup.string(),
      brand_name2: Yup.string(),
      brand_name3: Yup.string(),
    })
  ).current;

  const validateNumber = (telco) => {
    return Yup.array()
      .min(1, 'Vui lòng nhập số thành viên')
      .test({
        name: 'validate isdn',
        exclusive: true,
        message: 'Vui lòng nhập đúng định dạng',
        test: (value) =>
          validatePhoneNumber(
            value?.map((item) => item.label || item) || [],
            telco === 'VINAPHONE'
          ),
      });
  };

  useEffect(() => {
    if (updateRecord) {
      const {
        nickname1,
        nickname2,
        nickname3,
        ip,
        number,
        number1,
        number2,
        number3,
        callin,
        callout,
        onnet,
        offnet,
        callin1,
        callout1,
        onnet1,
        offnet1,
        callin2,
        callout2,
        onnet2,
        offnet2,
        callin3,
        callout3,
        onnet3,
        offnet3,
        telco,
        telco1,
        telco2,
        telco3,
        status,
        note,
        brand_name,
        brand_name1,
        brand_name2,
        brand_name3,
      } = updateRecord;
      handleChangeTelco(telco);
      setInitialValues({
        note,
        brand_name,
        brand_name1,
        brand_name2,
        brand_name3,
        telco,
        telco1,
        telco2,
        telco3,
        nickname1: generateOption(nickname1, nickname1),
        nickname2: generateOption(nickname2, nickname2),
        nickname3: generateOption(nickname3, nickname3),
        ip,
        number,
        number1,
        number2,
        number3,
        callin: generateOption(callin, callin),
        callout: generateOption(callout, callout),
        onnet: generateOption(onnet, onnet),
        offnet: generateOption(offnet, offnet),
        callin1: generateOption(callin1, callin1),
        callout1: generateOption(callout1, callout1),
        onnet1: generateOption(onnet1, onnet1),
        offnet1: generateOption(offnet1, offnet1),
        callin2: generateOption(callin2, callin2),
        callout2: generateOption(callout2, callout2),
        onnet2: generateOption(onnet2, onnet2),
        offnet2: generateOption(offnet2, offnet2),
        callin3: generateOption(callin3, callin3),
        callout3: generateOption(callout3, callout3),
        onnet3: generateOption(onnet3, onnet3),
        offnet3: generateOption(offnet3, offnet3),
        recordStatus: generateOption(status, status),
      });
    validationSchema.fields.recordStatus = Yup.object().nullable().required('Vui lòng chọn trạng thái');
      return;
    }
    validationSchema.fields.recordStatus = Yup.object().nullable();
    setInitialValues(INIT);
  }, [updateRecord]);

  const generateNumber = () => {
    if (!xlsxData) {
      return formRef.current.values.number?.join(',');
    }

    return isVinaphone
      ? xlsxData.number
          .map((item, index) => `${item}-${xlsxData.cfu[index]}`)
          .join(',')
      : xlsxData.number.join(',');
  };

  const generateNumber1 = () => {
    if (!xlsxData) {
      return formRef.current.values.number1?.join(',');
    }

    return isVinaphone
      ? xlsxData.number
          .map((item, index) => `${item}-${xlsxData.cfu[index]}`)
          .join(',')
      : xlsxData.number.join(',');
  };

  const generateNumber2 = () => {
    if (!xlsxData) {
      return formRef.current.values.number2?.join(',');
    }

    return isVinaphone
      ? xlsxData.number
          .map((item, index) => `${item}-${xlsxData.cfu[index]}`)
          .join(',')
      : xlsxData.number.join(',');
  };

  const generateNumber3 = () => {
    if (!xlsxData) {
      return formRef.current.values.number3?.join(',');
    }

    return isVinaphone
      ? xlsxData.number
          .map((item, index) => `${item}-${xlsxData.cfu[index]}`)
          .join(',')
      : xlsxData.number.join(',');
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      console.log(values)
      if (updateRecord) {
        await TicketAPI.updateTicket({
          ...values,
          nickname1: values.nickname1?.value || '',
          nickname2: values.nickname2?.value || '',
          nickname3: values.nickname3?.value || '',
          callin: values.callin?.value || '',
          callout: values.callout?.value || '',
          onnet: values.onnet?.value || '',
          offnet: values.offnet?.value || '',
          callin1: values.callin1?.value || '',
          callout1: values.callout1?.value || '',
          onnet1: values.onnet1?.value || '',
          offnet1: values.offnet1?.value || '',
          callin2: values.callin2?.value || '',
          callout2: values.callout2?.value || '',
          onnet2: values.onnet2?.value || '',
          offnet2: values.offnet2?.value || '',
          callin3: values.callin3?.value || '',
          callout3: values.callout3?.value || '',
          onnet3: values.onnet3?.value || '',
          offnet3: values.offnet3?.value || '',
          status: values.recordStatus?.value || '',
          id: updateRecord.id,
        });
      } else {
        await TicketAPI.createNewTicket({
          ...values,
          nickname1: values.nickname1?.value || '',
          nickname2: values.nickname2?.value || '',
          nickname3: values.nickname3?.value || '',
          callin: values.callin?.value || '',
          callout: values.callout?.value || '',
          onnet: values.onnet?.value || '',
          offnet: values.offnet?.value || '',
          callin1: values.callin1?.value || '',
          callout1: values.callout1?.value || '',
          onnet1: values.onnet1?.value || '',
          offnet1: values.offnet1?.value || '',
          callin2: values.callin2?.value || '',
          callout2: values.callout2?.value || '',
          onnet2: values.onnet2?.value || '',
          offnet2: values.offnet2?.value || '',
          callin3: values.callin3?.value || '',
          callout3: values.callout3?.value || '',
          onnet3: values.onnet3?.value || '',
          offnet3: values.offnet3?.value || '',
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
    setIsVinaphone(false);
    setXlsxData(null);
    close && close();
  };

  const getListData = useCallback(async () => {
    const listAPI = [
      PartnerDetailAPI.getPartner,
    ];
    try {
      setLoading(true);
      const response = await Promise.all(listAPI.map((api) => api()));
      setListData((prev) => ({
        ...prev,
        nickname1s: getListOption(response[0]?.data, 'nickname', 'nickname'),
        nickname2s: getListOption(response[0]?.data, 'nickname', 'nickname'),
        nickname3s: getListOption(response[0]?.data, 'nickname', 'nickname'),
      }));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListData();
  }, [getListData]);

  const handleChangeTelco = (telco) => {
    switch (telco) {
      case 'VIETTEL':
      case 'MOBIFONE':
      case 'OTHER':
      case 'CO':
      case 'GTEL':
      case 'VIETNAMOBILE':
      case 'GMOBILE':
      case 'DIGITEL':
      case 'VINAPHONE':
        validationSchema.fields.isdn = validateNumber(telco);
        setIsVinaphone(telco === 'VINAPHONE');
        break;
      default:
        break;
    }
  };

  const validatePhoneNumber = (arrayHotline, isVina = false) => {
    let isValid = true;

    if (arrayHotline) {
      const length = arrayHotline.length;
      for (let i = 0; i < length; i += 1) {
        const regex = /(0)+([0-9]{9})\b/;
        const regexOnlyNumber = /^\d+$/;
        const item = arrayHotline[i];
        const prefix = item.split('-')?.[0];
        const suffix = item.split('-')?.[1] || '';
        if (
          !regex.test(isVina ? prefix : item) ||
          (isVina && !(item.includes('-') && regexOnlyNumber.test(suffix))) ||
          (!isVina && item.includes('-'))
        ) {
          isValid = false;
          break;
        }
      }
    }

    return isValid;
  };

  const handleXlsxData = (data) => {
    if (data) {
      validationSchema.fields.number = Yup.array().test({
        name: 'validate number',
        exclusive: true,
        message: 'Vui lòng nhập đúng định dạng',
        test: (value) =>
          validatePhoneNumber(
            value?.map((item) => item.label || item) || [],
            formRef.current.values.telco?.value === 'VINAPHONE'
          ),
      });
      formRef.current.setFieldTouched('number', true);
    } else {
      validationSchema.fields.number = validateNumber(
        formRef.current.values.telco?.value === 'VINAPHONE'
      );
    }

    setXlsxData(data);
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
        style={{ maxWidth: '85%', margin: '0 auto' }}
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
                <Col lg={12} className='mt-3 ml-4'>
                  <Label className='form-label'></Label>
                </Col>
                <Col lg={3} className='mt-3'>
                  <CustomInputComponent
                    name='telco'
                    label='Nhà mạng'
                    placeholder='Vui lòng chọn nhà mạng'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>
                <Col lg={6} className='mt-3 ml-4'>
                  <Label className='form-label'></Label>
                </Col>

                <Col lg={5} className='ml-4 mt-3'>
                  <CustomTextareaComponent
                    name='number'
                    label='Thông tin thuê bao'
                    placeholder='Vui lòng nhập thông tin thuê bao'
                    // isDisabled={isViewMode || !!updateRecord}
                    disabled={isViewMode || !!updateRecord}
                    rows={5}
                    cols={10}
                  />
                </Col>
                           
                <Col lg={2} className='mt-3'>
                  <CustomInputComponent
                    name='brand_name'
                    label='Tên Brand'
                    placeholder='Vui lòng nhập tên Brand'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>
                           
                <Col lg={1} className='ml-4 mt-3'>
                  <CustomSelectComponent
                    name='callin'
                    options={TYPE_OPTION}
                    label='Call In'
                    placeholder='Call in'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>
              
                <Col lg={1} className='ml-4 mt-3'>
                  <CustomSelectComponent
                    name='callout'
                    options={TYPE_OPTION}
                    label='Call Out'
                    placeholder='Call out'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>
              
                <Col lg={1} className='ml-4 mt-3'>
                  <CustomSelectComponent
                    name='onnet'
                    options={TYPE_OPTION}
                    label='On Net'
                    placeholder='On Net'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>
              
                <Col lg={1} className='ml-4 mt-3'>
                  <CustomSelectComponent
                    name='offnet'
                    options={TYPE_OPTION}
                    label='Off Net'
                    placeholder='Off Net'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>

          {/* MOBIFONE */}
                <Col lg={10} className='mt-3 ml-4'>
                  <Label className='form-label'></Label>
                </Col>
                <Col lg={3} className='mt-3'>
                <CustomInputComponent
                    name='telco1'
                    label='Nhà mạng'
                    placeholder='Vui lòng chọn nhà mạng'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>
                <Col lg={8} className='mt-3 ml-4'>
                  <Label className='form-label'></Label>
                </Col>

                <Col lg={5} className='ml-4 mt-3'>
                  <CustomTextareaComponent
                    name='number1'
                    label='Thông tin thuê bao'
                    placeholder='Vui lòng nhập thông tin thuê bao'
                    disabled={isViewMode || !!updateRecord}
                    rows={5}
                    cols={10}
                  />
                </Col>

                <Col lg={2} className='mt-3'>
                  <CustomInputComponent
                    name='brand_name1'
                    label='Tên Brand'
                    placeholder='Vui lòng nhập tên Brand'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>
                           
                <Col lg={1} className='ml-4 mt-3'>
                  <CustomSelectComponent
                    name='callin1'
                    options={TYPE_OPTION}
                    label='Call In'
                    placeholder='Call in'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>
              
                <Col lg={1} className='ml-4 mt-3'>
                  <CustomSelectComponent
                    name='callout1'
                    options={TYPE_OPTION}
                    label='Call Out'
                    placeholder='Call out'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>
              
                <Col lg={1} className='ml-4 mt-3'>
                  <CustomSelectComponent
                    name='onnet1'
                    options={TYPE_OPTION}
                    label='On Net'
                    placeholder='On Net'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>
              
                <Col lg={1} className='ml-4 mt-3'>
                  <CustomSelectComponent
                    name='offnet1'
                    options={TYPE_OPTION}
                    label='Off Net'
                    placeholder='Off Net'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>

            {/* VINAPHONE */}
                <Col lg={8} className='mt-3 ml-4'>
                  <Label className='form-label'></Label>
                </Col>
                <Col lg={10} className='mt-3 ml-4'>
                  <Label className='form-label'></Label>
                </Col>
                <Col lg={3} className='mt-3'>
                <CustomInputComponent
                    name='telco2'
                    label='Nhà mạng'
                    placeholder='Vui lòng chọn nhà mạng'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>
                <Col lg={8} className='mt-3 ml-4'>
                  <Label className='form-label'></Label>
                </Col>

                <Col lg={5} className='ml-4 mt-3'>
                  <CustomTextareaComponent
                    name='number2'
                    label='Thông tin thuê bao'
                    placeholder='Vui lòng nhập thông tin thuê bao'
                    disabled={isViewMode || !!updateRecord}
                    rows={5}
                    cols={10}
                  />
                </Col>
                           
                <Col lg={2} className='mt-3'>
                  <CustomInputComponent
                    name='brand_name2'
                    label='Tên Brand'
                    placeholder='Vui lòng nhập tên Brand'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>
                           
                <Col lg={1} className='ml-4 mt-3'>
                  <CustomSelectComponent
                    name='callin2'
                    options={TYPE_OPTION}
                    label='Call In'
                    placeholder='Call in'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>
              
                <Col lg={1} className='ml-4 mt-3'>
                  <CustomSelectComponent
                    name='callout2'
                    options={TYPE_OPTION}
                    label='Call Out'
                    placeholder='Call out'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>
              
                <Col lg={1} className='ml-4 mt-3'>
                  <CustomSelectComponent
                    name='onnet2'
                    options={TYPE_OPTION}
                    label='On Net'
                    placeholder='On Net'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>
              
                <Col lg={1} className='ml-4 mt-3'>
                  <CustomSelectComponent
                    name='offnet2'
                    options={TYPE_OPTION}
                    label='Off Net'
                    placeholder='Off Net'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>

            {/* GMOBILE */}
                <Col lg={10} className='mt-3 ml-4'>
                  <Label className='form-label'></Label>
                </Col>
                <Col lg={3} className='mt-3'>
                <CustomInputComponent
                    name='telco3'
                    label='Nhà mạng'
                    placeholder='Vui lòng chọn nhà mạng'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>
                <Col lg={5} className='mt-3 ml-4'>
                  <Label className='form-label'></Label>
                </Col>

                <Col lg={5} className='ml-4 mt-3'>
                  <CustomTextareaComponent
                    name='number3'
                    label='Thông tin thuê bao'
                    placeholder='Vui lòng nhập thông tin thuê bao'
                    disabled={isViewMode || !!updateRecord}
                    rows={5}
                    cols={10}
                  />
                </Col>
                           
                <Col lg={2} className='mt-3'>
                  <CustomInputComponent
                    name='brand_name3'
                    label='Tên Brand'
                    placeholder='Vui lòng nhập tên Brand'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>
                           
                <Col lg={1} className='ml-4 mt-3'>
                  <CustomSelectComponent
                    name='callin3'
                    options={TYPE_OPTION}
                    label='Call In'
                    placeholder='Call in'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>
              
                <Col lg={1} className='ml-4 mt-3'>
                  <CustomSelectComponent
                    name='callout3'
                    options={TYPE_OPTION}
                    label='Call Out'
                    placeholder='Call out'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>
              
                <Col lg={1} className='ml-4 mt-3'>
                  <CustomSelectComponent
                    name='onnet3'
                    options={TYPE_OPTION}
                    label='On Net'
                    placeholder='On Net'
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </Col>
              
                <Col lg={1} className='ml-4 mt-3'>
                  <CustomSelectComponent
                    name='offnet3'
                    options={TYPE_OPTION}
                    label='Off Net'
                    placeholder='Off Net'
                    isDisabled={isViewMode || !!updateRecord}
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

AddTicket.propTypes = {
  openModal: PropTypes.bool,
  getList: PropTypes.func,
  close: PropTypes.func,
  updateRecord: PropTypes.any,
};

export default React.memo(AddTicket);