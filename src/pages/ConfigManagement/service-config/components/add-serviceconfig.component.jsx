import { Form, Formik, useFormik, FieldArray } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Col, Label, Modal, ModalHeader, Row } from 'reactstrap';
import * as Yup from 'yup';
import { ServiceConfigAPI } from '../../../../api/service-config.api';
import { PartnerDetailAPI } from '../../../../api/partnerdetail.api';
import addToast from '../../../../Components/Common/add-toast.component';
import CustomInputComponent from '../../../../Components/Common/custom-input.component';
import CustomInputNumberComponent from '../../../../Components/Common/custom-input-number.component';
import CustomTextareaComponent from '../../../../Components/Common/custom-textarea.component';
import LoadingComponent from '../../../../Components/Common/loading.component';
import { Message } from '../../../../shared/const/message.const';
import CustomSelectComponent from '../../../../Components/Common/custom-select/custom-select.component';
import {
  generateOption,
  getListOption,
} from '../../../../helpers/array.helper';

const INIT = {
  info: [
    {
      nickname: '',
      packetName: '',
      callType: '',
      price: '',
      startDuration: '',
      endDuration: '',
      isBrand: '',
    },
  ],
};

function AddServiceConfig({ isOpen, getList, close, updateRecord, isViewMode }) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const [initialValues, setInitialValues] = useState(INIT);
  const [listData, setListData] = useState({
    nicknames: [],
    packetNames: [],
    callTypes: [],
    isBrands: [],
  });
  const TYPE_OPTION = useRef([
    { label: 'Sử dụng Brand', value: 'Sử dụng Brand' },
    { label: 'Không dùng Brand', value: 'Không dùng Brand' },
  ]).current;
  // const validationSchema = useRef(
  //   Yup.object({
  //     nickname1: Yup.object().nullable().required('Vui lòng chọn khách hàng'),
  //     nickname2: Yup.object().nullable(),
  //     nickname3: Yup.object().nullable(),
  //     ip: Yup.string().required('Vui lòng nhập IP của khách hàng'),
  //     recordStatus: Yup.object().nullable(),
  //     note: Yup.string(),
  //     brand_name: Yup.string(),
  //   })
  // ).current;

  useEffect(() => {
    if (updateRecord) {
      const {
        info,   
      } = updateRecord;
      const parsedTest = info?.map((item) => ({
        ...item,
        nickname: generateOption(item.nickname, item.nickname),
        packetName: generateOption(item.packetName, item.packetName),
        callType: generateOption(item.callType, item.callType),
        isBrand: generateOption(item.isBrand, item.isBrand),
      }));

      setInitialValues({
        info: parsedTest,
      });
      return;
    }
    setInitialValues(INIT);
  }, [updateRecord]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const testArray = values.info?.map((item) => ({
        ...item,
        nickname: item.nickname?.value || '',
        packetName: item.packetName?.value || '',
        callType: item.callType?.value || '',
      }));
      if (updateRecord) {
        await ServiceConfigAPI.updateServiceConfig({
          ...values,
          info: testArray,
          id: updateRecord.id,
        });
      } else {
        await ServiceConfigAPI.createNewServiceConfig({
          ...values,
          info: testArray,
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
      ServiceConfigAPI.getServiceTypeList,
      ServiceConfigAPI.getServicePacketList
    ];
    try {
      setLoading(true);
      const response = await Promise.all(listAPI.map((api) => api()));
      setListData((prev) => ({
        ...prev,
        nicknames: getListOption(response[0]?.data, 'nickname', 'nickname'),
        packetNames: getListOption(response[2]?.data, 'packetName', 'packetName'),
        callTypes: getListOption(response[1]?.data, 'callType', 'callType'),
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
        style={{ maxWidth: '45%', margin: '0 auto' }}
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
            // validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            innerRef={formRef}
            enableReinitialize
          >
            {({ values }) => {
              return (
                <Form>
                  <Row>
                    <FieldArray name='info'>
                      {({ push, remove }) => (
                        <>
                          {values.info &&
                            values.info.map((info, index) => (
                              <React.Fragment key={index}>
                                <Col lg={6} className='ml-4 mt-3'>
                                  <CustomSelectComponent
                                    name={`info[${index}].nickname`}
                                    label='Đối tác'
                                    options={listData.nicknames}
                                    placeholder='Vui lòng chọn đối tác'
                                    disabled={isViewMode || !!updateRecord}
                                  />
                                </Col>

                                  <Col lg={6} className='mt-3'>
                                      <CustomSelectComponent
                                        name={`info[${index}].packetName`}
                                        label='Gói cước'
                                        options={listData.packetNames}
                                        placeholder='Vui lòng chọn gói cước'
                                        isDisabled={
                                          isViewMode || !!updateRecord
                                        }
                                      />
                                    </Col>

                                    <Col lg={6} className='mt-3'>
                                      <CustomSelectComponent
                                        name={`info[${index}].callType`}
                                        label='Loại cuộc gọi'
                                        options={listData.callTypes}
                                        placeholder='Vui lòng chọn loại cuộc gọi'
                                        isDisabled={isViewMode || !!updateRecord}
                                      />
                                    </Col>

                                    <Col lg={6} className='ml-4 mt-3'>
                                      <CustomInputComponent
                                        name={`info[${index}].price`}
                                        label='Giá tiền'
                                        placeholder='Vui lòng nhập giá tiền'
                                        disabled={isViewMode || !!updateRecord}
                                      />
                                    </Col>

                                    <Col lg={6} className='ml-4 mt-3'>
                                      <CustomInputComponent
                                        name={`info[${index}].startDuration`}
                                        label='Phút thoại bắt đầu'
                                        placeholder='Vui lòng nhập phút thoại bắt đầu'
                                        disabled={isViewMode || !!updateRecord}
                                      />
                                    </Col>

                                    <Col lg={6} className='ml-4 mt-3'>
                                      <CustomInputComponent
                                        name={`info[${index}].endDuration`}
                                        label='Phút thoại kết thúc'
                                        placeholder='Vui lòng nhập phút thoại kết thúc'
                                        disabled={isViewMode || !!updateRecord}
                                      />
                                    </Col>

                                    <Col lg={6} className='ml-4 mt-3'>
                                      <CustomSelectComponent
                                        name={`info[${index}].isBrand`}
                                        options={TYPE_OPTION}
                                        label='Loại dịch vụ'
                                        placeholder='Loại dịch vụ'
                                        isDisabled={
                                          isViewMode || !!updateRecord
                                        }
                                      />
                                    </Col>

                                    <Col lg={6}>
                                      <Label></Label>
                                    </Col>
                                   
                                    <Col lg={1} className='ml-4 mt-3'>
                                      <Button onClick={() => remove(index)}>
                                        Delete
                                      </Button>
                                    </Col>

                                    <Col lg={9} className='ml-4 mt-3' style={{ marginLeft: '10px'}}>
                                      <Button
                                        onClick={() =>
                                        push({
                                            nickname: '',
                                            packetName: '',
                                            callType: '',
                                            price: '',
                                            startDuration: '',
                                            endDuration: '',
                                            isBrand: '',
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

AddServiceConfig.propTypes = {
  openModal: PropTypes.bool,
  getList: PropTypes.func,
  close: PropTypes.func,
  updateRecord: PropTypes.any,
};

export default React.memo(AddServiceConfig);
