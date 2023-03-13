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
import { PartnerAPI } from '../../../api/customer-management.api';
import { SMSVendorAPI } from '../../../api/sms-vendor.api';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import CalendarComponent from '../../../Components/Common/calendar/calendar.component';
import CustomSelectComponent from '../../../Components/Common/custom-select/custom-select.component';
import CustomInputComponent from '../../../Components/Common/custom-input.component';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import { generateOption, getListOption } from '../../../helpers/array.helper';
import './sms-statistic.style.scss';

const ReportSMSStatistic = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [senders, setSenders] = useState([]);
  const formRef = useRef();
  const validationSchema = useRef(
    Yup.object({
      date: Yup.object({
        startDate: Yup.string().required('Please pick Date'),
        endDate: Yup.string().required('Please pick Date'),
      }),
      sender: Yup.object().nullable(),
      mobile : Yup.string(),
      message : Yup.string(),
    })
  ).current;
  const initialValues = useRef({
    date: { startDate: '', endDate: '' },
    sender: null,
    mobile: '',
    message: '',
  }).current;
  const COLUMN_CONFIG = useRef([
    {
      field: 'created_time',
      headerName: 'Thời gian',
      width: 180,
    },
    {
      field: 'nickname',
      headerName: 'Đối tác',
      width: 150,
    },
    {
      field: 'sender',
      headerName: 'Brand',
      width: 150,
    },
    {
      field: 'mobile',
      headerName: 'Số điện thoại',
      width: 150,
    },
    {
      field: 'message',
      headerName: 'Nội dung tin',
      width: 930,
    },
  ]).current;

  const getInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Promise.all([
        SMSVendorAPI.getSMSStatisticList(),
        SMSVendorAPI.getSMSStatisticList(),
      ]);
      setSenders(getListOption(response[1].data, 'sender', 'sender'));
      setData(response[0].data);
      setSearchData(response[0].data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getInitialData();
  }, [getInitialData]);

  const onSearch = (search) => {
    setSearchData(search);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const { date, sender, mobile, message } = values;
      const response = await SMSVendorAPI.findSMSStatisticList(
        date.startDate,
        date.endDate,
        sender || '',
        mobile || '',
        message || '',
      );
      setData(response?.data);
      setSearchData(response?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  document.title = 'SMS Detail List';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='Báo cáo nội dung SMS' pageTitle='Báo cáo SMS Vendor' />

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            innerRef={formRef}
            onSubmit={handleSubmit}
          >
            <Form>
              <Row>
                <Col lg={2}>
                  <CalendarComponent name='date' placeholder='Chọn ngày' />
                </Col>

                <Col lg={2}>
                  <CustomInputComponent
                    name='sender'
                    placeholder='Chọn Sender'
                  />
                </Col>

                <Col lg={2}>
                  <CustomInputComponent   
                    name='mobile'
                    placeholder='Vui lòng nhập số điện thoại'
                  />
                </Col>

                <Col lg={2}>
                  <CustomInputComponent   
                    name='message'
                    placeholder='Vui lòng nhập tin nhắn'
                  />
                </Col>

                <Col lg={2}>
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
                  {/* <h3 className='card-title mb-0 flex-grow-1'>
                    Chi tiết Doanh thu
                  </h3> */}
                  <Col className='col-sm d-flex gap-2 justify-content-end'>
                        {/* <SearchComponent data={data} onSearch={onSearch} /> */}
                        <h2 className='card-title mb-0 flex-grow-1'>
                          Chi tiết Nội Dung SMS
                        </h2>
                        {/* <ShowHideColumnComponent
                          columns={columnConfig}
                          setColumns={setColumnConfig}
                        /> */}
                      </Col>
                </CardHeader>

                <CardBody>
                  <div id='table-gridjs'>
                    {/* <Row className='g-4 mb-3'>
                      <Col className='col-sm'>
                        <SearchComponent data={data} onSearch={onSearch} />
                      </Col>
                      <Col className='col-sm d-flex gap-2 justify-content-end'>
                        <SearchComponent data={data} onSearch={onSearch} />
                        <ShowHideColumnComponent
                          columns={columnConfig}
                          setColumns={setColumnConfig}
                        />
                      </Col>
                    </Row> */}

                    <DataGridComponent
                      isBreakText
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
    </React.Fragment>
  );
};

export default ReportSMSStatistic;
