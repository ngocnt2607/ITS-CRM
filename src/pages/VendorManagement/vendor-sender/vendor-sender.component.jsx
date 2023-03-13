import { Form, Formik } from 'formik';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from 'reactstrap';
import * as Yup from 'yup';
import { SMSVendorAPI } from '../../../api/sms-vendor.api';
import addToast from '../../../Components/Common/add-toast.component';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import { Message } from '../../../shared/const/message.const';
import CalendarComponent from '../../../Components/Common/calendar/calendar.component';
import CustomSelectComponent from '../../../Components/Common/custom-select/custom-select.component';
import { generateOption, getListOption } from '../../../helpers/array.helper';
import CustomInputComponent from '../../../Components/Common/custom-input.component';
import AddSmsSenderComponent from './components/add-smssender.component';


const VendorSenderList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const formRef = useRef();
  const [openModal, setOpenModal] = useState({
    isOpen: false,
    viewMode: false,
    updateRecord: null,
  });

  const open = (updateRecord, viewMode = false) => {
    setOpenModal({
      viewMode,
      updateRecord,
      isOpen: true,
    });
  };

  const close = () => {
    setOpenModal({
      updateRecord: null,
      isOpen: false,
      viewMode: false,
    });
  };
  const initialValues = useRef({
    date: { startDate: '', endDate: '' },
    sender_name: null,
    TYPES: null,
  }).current;
  const validationSchema = useRef(
    Yup.object({
      date: Yup.object({
        startDate: Yup.string(),
        endDate: Yup.string(),
      }),
      sender_name: Yup.object().nullable(),
      TYPES: Yup.object().nullable(),
    })
  ).current;
  const TYPE_OPTION = useRef([
    { label: 'Y Tế, Giáo dục', value: '1' },
    { label: 'Điện lực', value: '2' },
    { label: 'Ngân hàng', value: '3' },
    { label: 'Tài chính, Chứng khoán', value: '4' },
    { label: 'Thương mại điện tử', value: '5' },
    { label: 'Hành chính công', value: '6' },
    { label: 'Lĩnh vực khác', value: '7' },
    { label: 'Quốc tế, OTT, MXH', value: '8' },
  ]).current;

  const convertData = (data) => {
    return (
      data?.map((item) => {
        const nf = new Intl.NumberFormat('en-US');
        return {
          ...item,
          fts: nf.format(item?.['fts']),
          gapit: nf.format(item?.['gapit']),
        };
      }) || []
    );
  };

  const getListVendorSender = useCallback(async () => {
    try {
      setLoading(true);
      const response = await SMSVendorAPI.getSMSSenderList();
      const mapData = convertData(response?.data);
      setData(mapData);
      setSearchData(mapData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListVendorSender();
  }, [getListVendorSender]);

  // const getListData = useCallback(async () => {
  //   const listAPI = [
  //     SMSVendorAPI.getVendorSendorList,
  //   ];
  //   try {
  //     setLoading(true);
  //     const response = await Promise.all(listAPI.map((api) => api()));
  //     setListData((prev) => ({
  //       ...prev,
  //       sender_names: getListOption(response[0]?.data, 'sender_name', 'sender_name'),
  //     }));
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   getListData();
  // }, [getListData]);

  const COLUMN_CONFIG = useRef([
    {
      field: 'updated_time',
      headerName: 'Thời gian',
      flex: 0.75,
    },
    {
      field: 'sender_name',
      headerName: 'Sender',
      flex: 0.75,
    },
    {
      field: 'braxis',
      headerName: 'Braxis',
      flex: 0.65,
    },
    {
      field: 'fts',
      headerName: 'Fts',
      flex: 0.65,
    },
    {
      field: 'gapit',
      headerName: 'Gapit',
      flex: 0.65,
    },
    {
      field: 'gtel',
      headerName: 'Gtel',
      flex: 0.65,
    },
    {
      field: 'imedia',
      headerName: 'Imedia',
      flex: 0.65,
    },
    {
      field: 'vmg',
      headerName: 'VMG',
      flex: 0.65,
    },
    {
      field: 'TYPES',
      headerName: 'Loại OTP',
      flex: 0.75,
    },
    {
      field: 'action',
      headerName: 'Thao tác',
      flex: 0.85,
      sortable: false,
      renderCell: (cellValues) => (
        <>
          <Button
            color='info'
            size='small'
            onClick={() => open(cellValues.row, true)}
          >
            Xem
          </Button>
          <Button
            color='success'
            size='small'
            onClick={() => open(cellValues.row)}
            style={{ marginLeft: 8 }}
          >
            Sửa
          </Button>
          {/* <Button
            style={{ marginLeft: 8 }}
            color='danger'
            onClick={() => {
              handleOpenDelete(true, cellValues.row);
            }}
          >
            Xóa
          </Button> */}
        </>
      ),
    },
  ]).current;

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const { date, sender_name, TYPES } = values;
      const response = await SMSVendorAPI.findSMSVendorSenderList(
        date.startDate || '',
        date.endDate || '',
        sender_name || '',
        TYPES?.value || '',
      );
      const mapData1 = convertData(response?.data);
      setData(mapData1);
      setSearchData(mapData1);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  document.title = 'Vendor Sender List';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='Vendor Sender' pageTitle='Thống kê Sender' />
          
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            innerRef={formRef}
            onSubmit={handleSubmit}
          >
            <Form>
              <Row>
                <Col lg={3}>
                  <CalendarComponent name='date' placeholder='Chọn ngày' />
                </Col>

                <Col lg={3}>
                  <CustomInputComponent
                    name='sender_name'
                    placeholder='Nhập tên Sender'
                  />
                </Col>

                <Col lg={3}>
                  <CustomSelectComponent
                    options={TYPE_OPTION}
                    name='TYPES'
                    placeholder='Chọn Loại OTP'
                  />
                </Col>

                <Col lg={3}>
                  <Button
                    color='primary'
                    className='mt-3 submit-button btn-label'
                    type='submit'
                  >
                    <i className='ri-search-line label-icon align-middle fs-16 me-2'></i>
                    Tìm kiếm
                  </Button>
                </Col>
              </Row>
            </Form>
          </Formik>

          <Row className='mt-3'>
            <Col lg={12}>
              <Card>
                <CardHeader>
                <Row className='g-4 mb-3'>
              <Col className='col-sm-auto'>
                 <div className='d-flex gap-1'>
                    <Button
                      color='success'
                      className='add-btn'
                      onClick={() => open(false)}
                      id='create-btn'
                      >
                      <i className='ri-add-line align-bottom me-1'></i>{' '}
                        Thêm mới
                      </Button>
                  </div>
                </Col>
                </Row>  
                  <Col className='col-sm d-flex gap-2 justify-content-end'>
                        {/* <SearchComponent data={data} onSearch={onSearch} /> */}
                        <h2 className='card-title mb-0 flex-grow-1'>
                          Chi tiết giá của các Sender
                        </h2>
                      </Col>
                </CardHeader>

                <CardBody>
                  <div id='table-gridjs'>
                   <DataGridComponent
                       columns={COLUMN_CONFIG}
                       rows={searchData}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <AddSmsSenderComponent
        isOpen={openModal.isOpen}
        close={close}
        getList={getListVendorSender}
        updateRecord={openModal.updateRecord}
        isViewMode={openModal.viewMode}
      />
    </React.Fragment>
  );
};

export default VendorSenderList;
