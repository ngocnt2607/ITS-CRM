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
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import SearchComponent from '../../../Components/Common/search.component';
import WidgetsComponent from '../../../Components/Common/widgets.component';
import { generateOption, getListOption } from '../../../helpers/array.helper';
import { smsWidgets3 } from '../../../shared/const/widgetbrand.const';
import './sms-brand.style.scss';
import { formatNumberComparator } from '../../../helpers/sort-table.helper';

const ReportSMSBrand = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [brands, setBrands] = useState([]);
  const [widgetsData, setWidgetsData] = useState({});
  const formRef = useRef();
  const validationSchema = useRef(
    Yup.object({
      date: Yup.object({
        startDate: Yup.string().required('Please pick Date'),
        endDate: Yup.string().required('Please pick Date'),
      }),
      sender_name: Yup.object().nullable(),
    })
  ).current;
  const listAllAccounts = useRef([]);
  const initialValues = useRef({
    date: { startDate: '', endDate: '' },
    sender_name: null,
  }).current;
  const COLUMN_CONFIG = useRef([
    {
      field: 'created_time',
      headerName: 'Thời gian',
      width: 105,
    },
    {
      field: 'sender_name',
      headerName: 'Sender',
      width: 290,
    },
    {
      field: 'vendor_sent',
      headerName: 'Vendor gửi',
      width: 290,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'sent_telco',
      headerName: 'Gửi G-Mobile',
      width: 290,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'sent_partner_otp',
      headerName: 'Gửi Partner OTP',
      width: 290,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'revenue',
      headerName: 'Doanh thu',
      width: 290,
      sortComparator: formatNumberComparator,
    },
  ]).current;

  const convertData = (data) => {
    return (
      data?.map((item) => {
        const nf = new Intl.NumberFormat('en-US');
        return {
          ...item,
          sent_partner_otp: nf.format(item?.['sent_partner_otp']),
          sent_telco: nf.format(item?.['sent_telco']),
          vendor_sent: nf.format(item?.['vendor_sent']),
          revenue: nf.format(item?.['revenue']),
        };
      }) || []
    );
  };

  const get30DaysValue = (data = []) => {
    let count = 0;
    const chart = {
      labels: [],
      data: [],
    };
    const tempValue = {
      labels: '',
      revenue: 0,
    };
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (
        !!i &&
        (item.createdtime !== tempValue.labels || i === data.length - 1)
      ) {
        chart.labels.push(tempValue.labels);
        chart.data.push(tempValue.revenue);
        tempValue.revenue = 0;
        count += 1;
      }

      tempValue.labels = item.createdtime;
      tempValue.revenue += item.revenue;

      if (count === 30) {
        break;
      }
    }
    return chart;
  };

  const getInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Promise.all([
        SMSVendorAPI.getSMSBrandList(),
        SMSVendorAPI.getSMSBrandList(),
        PartnerAPI.getListAccountByPartner(),
        SMSVendorAPI.getSMSBrandList(),
      ]);
      setBrands(getListOption(response[1].data, 'sender_name', 'sender_name'));
      const mapData = convertData(response[0]?.data);
      setData(mapData);
      setSearchData(mapData);
      setWidgetsData(response[3]?.total?.[0]);
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
      const { date, sender_name } = values;
      const response = await SMSVendorAPI.findSMSBrandList(
        date.startDate,
        date.endDate,
        sender_name?.value || '',
      );
      const mapData1 = convertData(response?.data);
      setData(mapData1);
      setSearchData(mapData1);
      setWidgetsData(response.total?.[0]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  document.title = 'Report List';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='Báo cáo doanh thu SMS' pageTitle='Báo cáo SMS Vendor' />

          <WidgetsComponent widgets={smsWidgets3} data={widgetsData} />

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
                    options={brands}
                    name='sender_name'
                    placeholder='Chọn Sender'
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
                          Chi tiết Doanh thu SMS Brand theo ngày
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

export default ReportSMSBrand;
