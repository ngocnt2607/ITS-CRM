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
import { SmsBrandAPI } from '../../../api/sms-brand.api';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import CalendarComponent from '../../../Components/Common/calendar/calendar.component';
import CustomSelectComponent from '../../../Components/Common/custom-select/custom-select.component';
import CustomInputComponent from '../../../Components/Common/custom-input.component';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import { generateOption, getListOption } from '../../../helpers/array.helper';
import ShowHideColumnComponent from '../../../Components/Common/show-hide-column.component';
import './sms-brand-log.style.scss';

const SmsLogBrand = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const formRef = useRef();
  const validationSchema = useRef(
    Yup.object({
      date: Yup.object({
        startDate: Yup.string().required('Please pick Date'),
        endDate: Yup.string().required('Please pick Date'),
      }),
      recordStatus: Yup.object().nullable(),
      isdn : Yup.string().nullable(),
    
    })
  ).current;
  const initialValues = useRef({
    date: { startDate: '', endDate: '' },
    recordStatus: '',
    isdn: '',  
  }).current;

  const TYPE_OPTION = useRef([
    { label: 'Thành công', value: '1' },
    { label: 'Thất bại', value: '0' },
    { label: 'Chưa gửi', value: '2' },
  ]).current;

  const [columnConfig, setColumnConfig] = useState([
    {
      field: 'created_time',
      headerName: 'Thời gian',
      width: 180,
    },
    {
      field: 'customer_name',
      headerName: 'Khách hàng',
      width: 150,
    },
    {
      field: 'isdn',
      headerName: 'Isdn',
      width: 150,
    },
    {
      field: 'brand',
      headerName: 'Brand',
      width: 150,
    },
    {
      field: 'message',
      headerName: 'Nội dung',
      width: 250,
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 150,
    },
    {
      field: 'brand_type',
      headerName: 'Loại dịch vụ',
      width: 150,
    },
    {
      field: 'brand_price',
      headerName: 'Giá',
      width: 150,
    },
    {
      field: 'partner_name',
      headerName: 'Đối tác',
      width: 150,
    },
    {
      field: 'unicode',
      headerName: 'Unicode',
      width: 150,
    },
    {
      field: 'telco',
      headerName: 'Nhà mạng',
      width: 150,
    },
    {
      field: 'requestId',
      headerName: 'requestId',
      width: 150,
    },
  ]);

  const getInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Promise.all([
        SmsBrandAPI.getSmsLogBrandList(),
      ]);
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
      const { date, recordStatus, isdn } = values;
      const response = await SmsBrandAPI.findSMSLogBrandList(
        date.startDate,
        date.endDate,
        recordStatus?.value || '',
        isdn || '',
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
          <BreadCrumb title='Báo cáo nội dung SMS' pageTitle='Báo cáo SMS Log' />

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
                  <CustomSelectComponent   
                    name='recordStatus'
                    options={TYPE_OPTION}
                    placeholder='Vui lòng chọn trạng thái'
                  />
                </Col>

                <Col lg={3}>
                  <CustomInputComponent   
                    name='isdn'
                    placeholder='Vui lòng nhập số điện thoại'
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
                  {/* <h3 className='card-title mb-0 flex-grow-1'>
                    Chi tiết Doanh thu
                  </h3> */}
                  <Col className='col-sm d-flex gap-2 justify-content-end'>
                        {/* <SearchComponent data={data} onSearch={onSearch} /> */}
                        <h2 className='card-title mb-0 flex-grow-1'>
                          Chi tiết Nội Dung SMS
                        </h2>
                        <ShowHideColumnComponent
                          columns={columnConfig}
                          setColumns={setColumnConfig}
                        />
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
                      columns={columnConfig}
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

export default SmsLogBrand;
