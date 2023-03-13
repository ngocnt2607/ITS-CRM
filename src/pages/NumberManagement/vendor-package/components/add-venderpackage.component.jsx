import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Col, Modal, ModalHeader, Row, Label } from 'reactstrap';
import * as Yup from 'yup';
import { VendorContactAPI } from '../../../../api/vendor-contact.api';
import { VendorPackageAPI } from '../../../../api/vendor-package.api';
import { PartnerDetailAPI } from '../../../../api/partnerdetail.api';
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
  vendor_name: '',
  telco: '',
  name: '',
  packagedetail: '',
  packagecode: '',
  starttime: '',
  expiredtime: '',
};

function AddVendorPackage({
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
    vendor_names: [],
    telcos: [],
  });
  const validationSchema = useRef(
    Yup.object({
      vendor_name: Yup.object().nullable().required('Vui lòng chọn công ty'),
      telco: Yup.object().nullable().required('Vui lòng chọn nhà mạng'),
      name: Yup.string().required('Vui lòng nhập tên gói'),
      packagedetail: Yup.string().required('Vui lòng nhập thông tin gói'),
      packagecode: Yup.string().required('Vui lòng nhập mã gói'),
      starttime: Yup.string().required(
        'Vui lòng chọn ngày bắt đầu sử dụng gói'
      ),
      expiredtime: Yup.string().required('Vui lòng chọn ngày kết thúc gói'),
    })
  ).current;

  useEffect(() => {
    if (updateRecord) {
      const {
        vendorname,
        telco,
        name,
        packagedetail,
        packagecode,
        starttime,
        expiredtime,
      } = updateRecord;
      setInitialValues({
        vendor_name: generateOption(vendorname, vendorname),
        telco: generateOption(telco, telco),
        name,
        packagedetail,
        packagecode,
        starttime,
        expiredtime,
      });
      return;
    }
    setInitialValues(INIT);
  }, [updateRecord]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (updateRecord) {
        await VendorPackageAPI.updateVendorPackage({
          ...values,
          vendor_name: values.vendor_name?.value,
          telco: values.telco?.value,
          id: updateRecord.id,
        });
      } else {
        await VendorPackageAPI.createNewVendorPackage({
          ...values,
          vendor_name: values.vendor_name?.value,
          telco: values.telco?.value,
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
      VendorContactAPI.getVendorNameList,
      PartnerDetailAPI.getTelco,
    ];
    try {
      setLoading(true);
      const response = await Promise.all(listAPI.map((api) => api()));
      setListData((prev) => ({
        ...prev,
        vendor_names: getListOption(response[0]?.data, 'name', 'name'),
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
                  <CustomSelectComponent
                    name='vendor_name'
                    options={listData.vendor_names}
                    label='Tên công ty'
                    placeholder='Vui lòng nhập tên Công ty'
                  />
                </div>

                <div className='mb-3'>
                  <CustomSelectComponent
                    name='telco'
                    options={listData.telcos}
                    label='Nhà mạng'
                    placeholder='Vui lòng chọn nhà mạng'
                  />
                </div>

                <div className='mb-3'>
                  <CustomInputComponent
                    name='name'
                    label='Tên gói'
                    placeholder='Nhập tên gói'
                  />
                </div>

                <div className='mb-3'>
                  <CustomInputComponent
                    name='packagedetail'
                    label='Thông tin gói'
                    placeholder='Nhập địa chỉ email'
                  />
                </div>

                <div className='mb-3'>
                  <CustomInputComponent
                    name='packagecode'
                    label='Mã gói'
                    placeholder='Nhập số mã gói'
                  />
                </div>

                <div className='mb-3'>
                  <Label htmlFor='starttime' className='form-label'>
                    Ngày bắt đầu
                  </Label>

                  <SingleCalendarComponent
                    name='starttime'
                    placeholder='Chọn ngày bắt đầu'
                  />
                </div>

                <div className='mb-3'>
                  <Label htmlFor='expiredtime' className='form-label'>
                    Ngày kết thúc
                  </Label>
                  <SingleCalendarComponent
                    name='expiredtime'
                    placeholder='Chọn ngày kết thúc'
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

AddVendorPackage.propTypes = {
  openModal: PropTypes.bool,
  getList: PropTypes.func,
  close: PropTypes.func,
  updateRecord: PropTypes.any,
};

export default React.memo(AddVendorPackage);
