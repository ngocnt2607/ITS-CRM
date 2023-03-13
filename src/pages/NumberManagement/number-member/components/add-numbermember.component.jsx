import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Col, Label, Modal, ModalHeader, Row } from 'reactstrap';
import * as Yup from 'yup';
import { NumberMemberAPI } from '../../../../api/number-member.api';
import { PartnerDetailAPI } from '../../../../api/partnerdetail.api';
import { VbnAPI } from '../../../../api/vbn.api';
import addToast from '../../../../Components/Common/add-toast.component';
import CustomInputComponent from '../../../../Components/Common/custom-input.component';
import SingleCalendarComponent from '../../../../Components/Common/calendar/single-calendar.component';
import LoadingComponent from '../../../../Components/Common/loading.component';
import { Message } from '../../../../shared/const/message.const';
import CustomSelectComponent from '../../../../Components/Common/custom-select/custom-select.component';
import {
  generateOption,
  getListOption,
} from '../../../../helpers/array.helper';
import AutocompleteControllerComponent from '../../../../Components/Common/autocomplete/autocomplete.component';
import UploadXlsxComponent from './upload-xlsx.component';

const INIT = {
  telco: '',
  isdn: [],
  cfu: '',
  numberowner: '',
  brandname: '',
  nickname: '',
  vosip: '',
  recordStatus: '',
  isdntype: '',
  dateassignedtoleeon: '',
  dateassignedtopartner: '',
  note: '',
};

function AddNumberMember({ isOpen, getList, close, updateRecord, isViewMode }) {
  const [loading, setLoading] = useState(false);
  const [isVinaphone, setIsVinaphone] = useState(false);
  const formRef = useRef();
  const [initialValues, setInitialValues] = useState(INIT);
  const [xlsxData, setXlsxData] = useState(null);
  const [listData, setListData] = useState({
    telcos: [],
    numberowners: [],
    nicknames: [],
    vosips: [],
    recordStatus: [],
    isdn: [],
    brandnames: [],
    isdntype: [],
  });
  const TYPE_OPTION = useRef([
    { label: 'Chưa cấp', value: 'Chưa cấp' },
    { label: 'Đã cấp', value: 'Đã cấp' },
    { label: 'Chặn lần 1', value: 'Chặn lần 1' },
    { label: 'Chặn lần 2', value: 'Chặn lần 2' },
    { label: 'Trả Telco', value: 'Trả Telco' },
  ]).current;
  const TYPE_OPTION1 = useRef([
    { label: 'Siptrunk', value: 'Siptrunk' },
    { label: 'Proconnect', value: 'Proconnect' },
    { label: '3C', value: '3C' },
    { label: 'Digisip ', value: 'Digisip ' },
  ]).current;
  const validationSchema = useRef(
    Yup.object({
      telco: Yup.object().nullable().required('Vui lòng chọn nhà mạng'),
      isdn: Yup.array(),
      cfu: Yup.string(),
      numberowner: Yup.object().nullable(),
      nickname: Yup.object().nullable().required('Vui lòng chọn tên khách hàng'),
      vosip: Yup.object().nullable().required('Vui lòng chọn server VOS'),
      recordStatus: Yup.object().nullable(),
      brandname: Yup.object().nullable(),
      isdntype: Yup.object(),
      note: Yup.string(),
      dateassignedtoleeon: Yup.string().required(
        'Vui lòng chọn ngày đấu nối Leeon'
      ),
      dateassignedtopartner: Yup.string().required('Vui lòng chọn ngày đấu nối cho khách hàng'),
    })
  ).current;

  const validateIsdn = (telco) => {
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
      const { telco, isdn, cfu, numberowner, brandname, nickname, vosip, status, isdntype, dateassignedtoleeon, dateassignedtopartner, note } =
        updateRecord;
      handleChangeTelco(telco);
      setInitialValues({
        telco: generateOption(telco, telco),
        isdn: isdn?.split(',') || [],
        cfu: cfu || '',
        numberowner: generateOption(numberowner, numberowner),
        brandname: generateOption(brandname, brandname),
        nickname: generateOption(nickname, nickname),
        vosip: generateOption(vosip, vosip),
        recordStatus: generateOption(status, status),
        isdntype: generateOption(isdntype, isdntype) || '',
        dateassignedtoleeon,
        dateassignedtopartner,
        note,
      });
      validationSchema.fields.recordStatus = Yup.object()
        .nullable()
        .required('Vui lòng chọn trạng thái');
        validationSchema.fields.isdntype = Yup.object();
      return;
    }
    validationSchema.fields.recordStatus = Yup.object().nullable();
    validationSchema.fields.isdntype = Yup.object().nullable();
    setInitialValues(INIT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateRecord]);

  const generateIsdn = () => {
    if (!xlsxData) {
      return formRef.current.values.isdn?.join(',');
    }

    return isVinaphone
      ? xlsxData.isdn
          .map((item, index) => `${item}-${xlsxData.cfu[index]}`)
          .join(',')
      : xlsxData.isdn.join(',');
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const data = {
        telco: values.telco?.value,
        numberowner: values.numberowner?.value || '',
        brandname: values.brandname?.value || '',
        nickname: values.nickname?.value,
        vosip: values.vosip?.value,
        isdn: generateIsdn(),
        isdntype: values.isdntype?.value || '',
        note: values.note || '',
        status: values.recordStatus?.value || '',
        dateassignedtoleeon: values.dateassignedtoleeon,
        dateassignedtopartner: values.dateassignedtopartner,
      };
      console.log(values)
      if (updateRecord) {
        await NumberMemberAPI.updateNumberMember({
          ...data,
          status: values.recordStatus?.value,
          isdntype: values.isdntype?.value,
          id: updateRecord.id,
        });
      } else {
        await NumberMemberAPI.createNewNumberMember(data);
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
    validationSchema.fields.isdn = Yup.array();
    setIsVinaphone(false);
    setXlsxData(null);
    close && close();
  };

  const getListData = useCallback(async () => {
    const listAPI = [
      PartnerDetailAPI.getTelco,
      NumberMemberAPI.getNumberList,
      VbnAPI.getVbnList,
      NumberMemberAPI.getAllCustomerList,
      PartnerDetailAPI.getListIP,
    ];
    try {
      setLoading(true);
      const response = await Promise.all(listAPI.map((api) => api()));
      setListData((prev) => ({
        ...prev,
        telcos: getListOption(response[0]?.data, 'name', 'name'),
        numberowners: getListOption(
          response[1]?.data,
          'numberowner',
          'numberowner'
        ),
        brandnames: getListOption(response[2]?.data, 'name', 'name'),
        nicknames: getListOption(response[3]?.data, 'nickname', 'nickname'),
        vosips: getListOption(response[4]?.data, 'name', 'name'),
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
      case 'VINAPHONE':
        validationSchema.fields.isdn = validateIsdn(telco);
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
      validationSchema.fields.isdn = Yup.array().test({
        name: 'validate isdn',
        exclusive: true,
        message: 'Vui lòng nhập đúng định dạng',
        test: (value) =>
          validatePhoneNumber(
            value?.map((item) => item.label || item) || [],
            formRef.current.values.telco?.value === 'VINAPHONE'
          ),
      });
      formRef.current.setFieldTouched('isdn', true);
    } else {
      validationSchema.fields.isdn = validateIsdn(
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
      >
        <ModalHeader>
          {isViewMode
            ? 'Xem các số'
            : updateRecord
            ? 'Cập nhật số'
            : 'Thêm số'}
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
                  <CustomSelectComponent
                    name='telco'
                    options={listData.telcos}
                    label='Nhà mạng'
                    placeholder='Vui lòng chọn nhà mạng'
                    disabled={isViewMode}
                    onChange={handleChangeTelco}
                  />
                </Col>

                <Col lg={6} className='ml-4'>
                  <Label htmlFor='isdn' className='form-label'>
                    Số thành viên
                  </Label>

                  <AutocompleteControllerComponent
                    name='isdn'
                    freeSolo
                    multiple
                    placeholder='Nhập số thành viên cách nhau bằng dấu phẩy'
                    options={listData.isdn}
                  />
                </Col>

                {!updateRecord && (
                <Col lg={6} className='mt-3'>
                  <Label className='form-label'>Tải lên tệp</Label>
                  <UploadXlsxComponent setXlsxData={handleXlsxData} />
                  <Label className='form-label'>Định dạng file: isdn nhập đủ 10 số bắt đầu bằng số 0</Label>
                </Col>
                )}

                {updateRecord && (
                <Col lg={6} className='ml-4 mt-3'>
                  <CustomInputComponent
                    name='cfu'
                    isDisabled={!isVinaphone}
                    label='CFU'
                    placeholder='Vui lòng nhập CFU'
                    disabled={isViewMode}
                  />
                </Col>
                )}

                <Col lg={6} className='mt-3'>
                  <CustomSelectComponent
                    name='numberowner'
                    options={listData.numberowners}
                    isDisabled={isVinaphone}
                    label='Số chủ'
                    placeholder='Vui lòng nhập số chủ'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='ml-4 mt-3'>
                  <CustomSelectComponent
                    name='brandname'
                    options={listData.brandnames}
                    label='Tên định danh'
                    placeholder='Vui lòng chọn tên định danh'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='ml-4 mt-3'>
                  <CustomSelectComponent
                    name='nickname'
                    options={listData.nicknames}
                    label='Khách hàng'
                    placeholder='Vui lòng chọn khách hàng'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='ml-4 mt-3'>
                  <CustomSelectComponent
                    name='vosip'
                    options={listData.vosips}
                    label='Server VOS'
                    placeholder='Vui lòng chọn server VOS'
                    disabled={isViewMode}
                  />
                </Col>

                <Col lg={6} className='ml-4 mt-3'>
                  <CustomSelectComponent
                    name='isdntype'
                    isDisabled={isVinaphone}
                    options={TYPE_OPTION1}
                    label='Loại Thuê bao'
                    placeholder='Vui lòng chọn dịch vụ'
                    disabled={isViewMode}
                  />
                </Col>

                
                  <Col lg={6} className='ml-4 mt-3'>
                    <CustomSelectComponent
                      name='recordStatus'
                      options={TYPE_OPTION}
                      label='Trạng thái'
                      placeholder='Vui lòng chọn trạng thái'
                      disabled={isViewMode}
                    />
                  </Col>
                

                <Col lg={6} className='ml-4 mt-3'>
                  <Label htmlFor='dateassignedtoleeon' className='form-label'>
                    Ngày đấu nối Leeon
                  </Label>

                  <SingleCalendarComponent
                    name='dateassignedtoleeon'
                    placeholder='Chọn ngày đấu nối Leeon'
                  />
                </Col>

                <Col lg={6} className='ml-4 mt-3'>
                  <Label htmlFor='dateassignedtopartner' className='form-label'>
                    Ngày đấu nối khách hàng
                  </Label>
                  <SingleCalendarComponent
                    name='dateassignedtopartner'
                    placeholder='Chọn ngày đấu nối cho khách hàng'
                  />
                </Col>

                <Col lg={6} className='ml-4 mt-3'>
                  <CustomInputComponent
                    name='note'
                    label='Ghi chú'
                    placeholder='Vui lòng nhập Ghi chú'
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

  AddNumberMember.propTypes = {
  openModal: PropTypes.bool,
  getList: PropTypes.func,
  close: PropTypes.func,
  updateRecord: PropTypes.any,
};

export default AddNumberMember;
