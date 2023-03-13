import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Col, Modal, ModalHeader, ModalBody, Row, Label,  Nav,
  NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import * as Yup from 'yup';
import { PartnerDetailAPI } from '../../../../api/partnerdetail.api';
import { ContractAPI } from '../../../../api/contract.api';
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
import UploadContractComponent from '../../../../Components/Common/upload-file.component';
import classnames from "classnames";
import { gridColumnPositionsSelector } from '@mui/x-data-grid';
const INIT = {
  nickname: '',
  contractno: '',
  contractappendixno: '',
  service: '',
  note: '',
  begintime: '',
  expiretime: '',
};

function AddContract({ isOpen, getList, close, updateRecord, isViewMode, getList1, updateRecord1, isViewMode1 }) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const [modal, setModal] = useState(false);
  const [initialValues, setInitialValues] = useState(INIT);
  const [initialValues1, setInitialValues1] = useState(INIT);
  const [listData, setListData] = useState({
    nicknames: [],
    services: [],
    contractnos: [],
  });
  const [file, setContract] = useState(null);
  const validationSchema = useRef(
    Yup.object({
      nickname: Yup.object().nullable().required('Vui lòng chọn khách hàng'),
      contractno: Yup.string().required('Vui lòng nhập mã hợp đồng'),
      service: Yup.object().nullable().required('Vui lòng chọn loại dịch vụ'),
      note: Yup.string().required('Vui lòng nhập ghi chú'),
      begintime: Yup.string().required('Vui lòng chọn ngày bắt đầu hợp đồng'),
      expiretime: Yup.string().required('Vui lòng chọn ngày kết hợp đồng'),
    })
  ).current;

  const validationSchema1 = useRef(
    Yup.object({
      nickname: Yup.object().nullable().required('Vui lòng chọn khách hàng'),
      contractno: Yup.object().nullable().required('Vui lòng chọn mã hợp đồng'),
      contractappendixno: Yup.string().required('Vui lòng nhập mã phụ lục'),
      service: Yup.object().nullable().required('Vui lòng chọn loại dịch vụ'),
      note: Yup.string().required('Vui lòng nhập ghi chú'),
      begintime: Yup.string().required('Vui lòng chọn ngày bắt đầu hợp đồng'),
      expiretime: Yup.string().required('Vui lòng chọn ngày kết hợp đồng'),
    })
  ).current;

  const toggle = () => {
    if (modal) {
      setModal(false);
    } else {
      setModal(true);
    }
  };

  const [activeTab, setActiveTab] = useState("1");
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  useEffect(() => {
    if (updateRecord) {
      const {
        nickname,
        contractno,
        service,
        note,
        begintime,
        expiretime,
      } = updateRecord;
      setInitialValues({
        nickname: generateOption(nickname, nickname),
        contractno,
        service: generateOption(service, service),
        note,
        begintime,
        expiretime,
      });
      return;
    }
    setInitialValues(INIT);
  }, [updateRecord]);

  useEffect(() => {
    if (updateRecord1) {
      const {
        nickname,
        contractno,
        contractappendixno,
        service,
        note,
        begintime,
        expiretime,
      } = updateRecord1;
      setInitialValues1({
        nickname: generateOption(nickname, nickname),
        contractno: generateOption(contractno, contractno),
        contractappendixno,
        service: generateOption(service, service),
        note,
        begintime,
        expiretime,
      });
      return;
    }
    setInitialValues1(INIT);
  }, [updateRecord1]);

  const handleSubmit = async (values) => {
    const formData = new FormData();
    const { nickname, contractno, service, note, begintime, expiretime } = values;
    formData.append('nickname', nickname?.value);
    formData.append('contractno', contractno);
    formData.append('service', service?.value);
    formData.append('note', note);
    formData.append('begintime', begintime);
    formData.append('expiretime', expiretime);
    formData.append('file', file);
    try {
      setLoading(true);
      if (updateRecord) {
        formData.append('id', updateRecord.id);
        await ContractAPI.updateContract(formData);
      } else {
        await ContractAPI.createNewContract(formData);
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

  const handleSubmit1 = async (values) => {
    const formData = new FormData();
    const { nickname, contractno, contractappendixno, service, note, begintime, expiretime } = values;
    formData.append('nickname', nickname?.value);
    formData.append('contractno', contractno?.value);
    formData.append('contractappendixno', contractappendixno);
    formData.append('service', service?.value);
    formData.append('note', note);
    formData.append('begintime', begintime);
    formData.append('expiretime', expiretime);
    formData.append('file', file);
    try {
      setLoading(true);
      if (updateRecord1) {
        formData.append('id', updateRecord1.id);
        await ContractAPI.updateContractAppendix(formData);
      } else {
        await ContractAPI.createNewContractAppendix(formData);
      }
      addToast({
        message: updateRecord1 ? Message.UPDATE_SUCCESS : Message.CREATE_SUCCESS,
        type: 'success',
      });

      if (getList1) {
        await getList1();
      }
      setLoading(false);
      handleClose();
    } catch (error) {
      setLoading(false);
    }
  };

  const handleClose = () => {
    formRef.current.resetForm();
    // setContract(null)
    close && close();
  };

  const getListData = useCallback(async () => {
    const listAPI = [
      PartnerDetailAPI.getPartner, 
      ContractAPI.getServiceList, 
      ContractAPI.getContractNoList
    ];
    try {
      setLoading(true);
      const response = await Promise.all(listAPI.map((api) => api()));
      setListData((prev) => ({
        ...prev,
        nicknames: getListOption(response[0]?.data, 'nickname', 'nickname'),
        services: getListOption(response[1]?.data, 'name', 'name'),
        contractnos: getListOption(response[2]?.data, 'contractno', 'contractno'),
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
        toggle={toggle}
        onClosed={handleClose}
        modalClassName='flip'
        centered
        size='lg'
      >
        <ModalHeader>
          {isViewMode
            ? 'Xem'
            : updateRecord
            ? 'Cập nhật'
            : 'Thêm mới'}
          <Button
            type='button'
            onClick={handleClose}
            className='btn-close'
            aria-label='Close'
          ></Button>
          </ModalHeader>
          <div className="modal-content border-0 mt-3">
              <Nav className="nav-tabs nav-tabs-custom nav-primary p-2 pb-0 bg-light">
                <NavItem>
                  <NavLink
                    href="#"
                    className={classnames({ active: activeTab === "1" })}
                    onClick={() => {
                      toggleTab("1");
                    }}
                  >
                    Hợp đồng
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    href="#"
                    className={classnames({ active: activeTab === "2" })}
                    onClick={() => {
                      toggleTab("2");
                    }}
                  >
                    Phụ lục
                  </NavLink>
                </NavItem>
                </Nav>
          </div>
        
          <Formik
            enableReinitialize
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            innerRef={formRef}
          >
        <ModalBody>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Form action="#">
                <Row>
                  <Col lg={6}>
                    <CustomSelectComponent
                    name='nickname'
                    options={listData.nicknames}
                    label='Tên đối tác'
                    placeholder='Vui lòng chọn tên đối tác'
                  />
                  </Col>

                  {/* <Col lg={6} className='ml-4'>
                    <CustomSelectComponent
                    name='type'
                    options={TYPE_OPTION}
                    label='Loại hợp đồng'
                    placeholder='Vui lòng chọn loại hợp đồng'
                  />
                  </Col> */}

                  <Col lg={6} className='ml-4'>
                    <CustomInputComponent
                    name='contractno'
                    label='Số hợp đồng'
                    placeholder='Vui lòng điền số hợp đồng'
                  />
                  </Col>

                  <Col lg={6} className='ml-4 mt-3'>
                    <CustomSelectComponent
                    name='service'
                    options={listData.services}
                    label='Dịch vụ'
                    placeholder='Vui lòng chọn loại dịch vụ'
                  />
                  </Col>
                
                  <Col lg={6} className='mt-3'>
                    <Label htmlFor='begintime' className='form-label'>
                    Ngày bắt đầu
                    </Label>

                    <SingleCalendarComponent
                      name='begintime'
                      placeholder='Chọn ngày bắt đầu'
                   />
                 </Col>

                  <Col lg={6} className='mt-3 ml-4'>
                    <Label htmlFor='expiretime' className='form-label'>
                    Ngày kết thúc
                    </Label>
                    <SingleCalendarComponent
                      name='expiretime'
                      placeholder='Chọn ngày kết thúc'
                    />
                  </Col> 
                  {/* {updateRecord &&( */}
                  <Col lg={6} className='mt-3'>
                    <Label className='form-label'>Upload Hợp đồng</Label>
                    <UploadContractComponent setContract={setContract}/>
                  </Col>
                  {/* )} */}
                  <Col lg={6} className='mt-3 ml-4'>
                    <CustomInputComponent
                    name='note'
                    label='Ghi chú'
                    placeholder='Vui lòng nhập ghi chú'
                  />
                  </Col>
                
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
                </TabPane>
              </TabContent>
            </ModalBody>
          </Formik>
        
          <Formik
            enableReinitialize
            validationSchema={validationSchema1}
            initialValues={initialValues1}
            onSubmit={handleSubmit1}
            innerRef={formRef}
          >
        <ModalBody>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="2">
              <Form action="#">
                <Row>
                  <Col lg={6} className="mb-3">
                    <CustomSelectComponent
                    name='nickname'
                    options={listData.nicknames}
                    label='Tên đối tác'
                    placeholder='Vui lòng chọn tên đối tác'
                  />
                  </Col>

                  {/* <Col lg={6} className='ml-4'>
                    <CustomSelectComponent
                    name='type'
                    options={TYPE_OPTION}
                    label='Loại hợp đồng'
                    placeholder='Vui lòng chọn loại hợp đồng'
                  />
                  </Col> */}

                  <Col lg={6} className='ml-4'>
                    <CustomSelectComponent
                    name='contractno'
                    options={listData.contractnos}
                    label='Hợp đồng'
                    placeholder='Vui lòng chọn hợp đồng'
                  />
                  </Col>

                  <Col lg={6} className='ml-4 mt-3'>
                    <CustomInputComponent
                    name='contractappendixno'
                    label='Mã phụ lục'
                    placeholder='Vui lòng nhập mã phụ lục'
                  />
                  </Col>

                  <Col lg={6} className='mt-3'>
                    <CustomSelectComponent
                    name='service'
                    options={listData.services}
                    label='Dịch vụ'
                    placeholder='Vui lòng chọn loại dịch vụ'
                  />
                  </Col>
                
                  <Col lg={6} className='mt-3 ml-4'>
                    <Label htmlFor='begintime' className='form-label'>
                    Ngày bắt đầu
                    </Label>

                    <SingleCalendarComponent
                      name='begintime'
                      placeholder='Chọn ngày bắt đầu'
                   />
                 </Col>

                  <Col lg={6} className='mt-3 ml-4'>
                    <Label htmlFor='expiretime' className='form-label'>
                    Ngày kết thúc
                    </Label>
                    <SingleCalendarComponent
                      name='expiretime'
                      placeholder='Chọn ngày kết thúc'
                    />
                  </Col> 
                  {!updateRecord1 && (
                  <Col lg={6} className='mt-3'>
                    <Label className='form-label'>Upload Phụ lục</Label>
                    <UploadContractComponent setContract={setContract}/>
                  </Col>
                  )}
                  <Col lg={6} className='mt-3'>
                    <CustomInputComponent
                    name='note'
                    label='Ghi chú'
                    placeholder='Vui lòng nhập ghi chú'
                  />
                  </Col>
                
                {!isViewMode1 && (
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
                </TabPane>
              </TabContent>
            </ModalBody>
          </Formik>
      </Modal>
    </>
  );
}

AddContract.propTypes = {
  openModal: PropTypes.bool,
  getList: PropTypes.func,
  close: PropTypes.func,
  updateRecord: PropTypes.any,
};

export default React.memo(AddContract);
