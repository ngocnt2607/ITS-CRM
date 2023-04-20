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
import { TotalReportAPI } from '../../../api/totalreport.api';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import CalendarComponent from '../../../Components/Common/calendar/calendar.component';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import SearchComponent from '../../../Components/Common/search.component';
import WidgetsComponent from '../../../Components/Common/widgets.component';
import {
  generateOption,
  get30DaysValue,
  getListOption,
} from '../../../helpers/array.helper';
import { reportWidgets } from '../../../shared/const/widget.const';
import BarChartComponent from '../../../Components/Common/bar-chart.component';
import './totalreport.style.scss';
import { formatNumberComparator } from '../../../helpers/sort-table.helper';

const TotalReport = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [widgetsData, setWidgetsData] = useState({});
  const formRef = useRef();
  const [chartValue, setChartValue] = useState({
    labels: [],
    revenues: [],
  });
  const validationSchema = useRef(
    Yup.object({
      date: Yup.object({
        startDate: Yup.string().required('Please pick Date'),
        endDate: Yup.string().required('Please pick Date'),
      }),
    })
  ).current;
  const initialValues = useRef({
    date: { startDate: '', endDate: '' },
  }).current;
  const COLUMN_CONFIG = useRef([
    {
      field: 'date',
      headerName: 'Thời gian',
      flex: 1,
      minWidth: 120,
    },
    {
      field: 'calltotal',
      headerName: 'Tổng call',
      flex: 1,
      minWidth: 120,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'callsuccess',
      headerName: 'Call Success',
      flex: 1,
      minWidth: 120,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'callmiss',
      headerName: 'Call Error',
      flex: 1,
      minWidth: 120,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'callrate',
      headerName: 'Tỉ lệ cuộc gọi lỗi',
      flex: 1,
      minWidth: 150,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'voicetime',
      headerName: 'Phút thoại',
      flex: 1,
      minWidth: 120,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'revenue',
      headerName: 'Doanh thu',
      flex: 1,
      minWidth: 120,
      sortComparator: formatNumberComparator,
    },
  ]).current;

  const convertData = (data) => {
    return (
      data?.map((item) => {
        const nf = new Intl.NumberFormat('en-US');
        return {
          ...item,
          calltotal: nf.format(item?.['calltotal']),
          callsuccess: nf.format(item?.['callsuccess']),
          callmiss: nf.format(item?.['callmiss']),
          voicetime: nf.format(item?.['voicetime']),
          revenue: nf.format(item?.['revenue']),
        };
      }) || []
    );
  };

  const getInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Promise.all([TotalReportAPI.getTotalReportList()]);
      const mapData = convertData(response[0]?.data);
      setData(mapData);
      setSearchData(mapData);
      setChartValue(get30DaysValue(response[0]?.data, 'date', 'revenue'));
      setWidgetsData(response[0]?.total?.[0]);
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
      const { date } = values;
      const response = await TotalReportAPI.findTotalReportList(
        date.startDate,
        date.endDate
      );
      const mapData1 = convertData(response?.data);
      console.log(mapData1);
      setData(mapData1);
      setSearchData(mapData1);
      setWidgetsData(response.total?.[0]);
      setChartValue(get30DaysValue(response?.data, 'date', 'revenue'));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  document.title = 'Report Tổng';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='Báo cáo tổng' pageTitle='Báo cáo' />
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <h4 className='card-title mb-0'>Biểu đồ doanh thu</h4>
                </CardHeader>
                <CardBody>
                  <BarChartComponent
                    dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]'
                    title='Doanh thu'
                    labels={chartValue.labels}
                    columnData={chartValue.revenues}
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>

          <WidgetsComponent widgets={reportWidgets} data={widgetsData} />

          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            innerRef={formRef}
            onSubmit={handleSubmit}
          >
            <Form>
              <Row>
                <Col lg={6}>
                  <CalendarComponent name='date' placeholder='Chọn ngày' />
                </Col>

                <Col lg={4}>
                  <Button
                    color='primary'
                    className='mt-3 submit-button btn-label'
                    type='submit'
                  >
                    <i className='ri-search-line label-icon align-middle fs-16 me-2'></i>
                    Search
                  </Button>
                </Col>
              </Row>
            </Form>
          </Formik>

          <Row className='mt-3'>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className='card-title mb-0 flex-grow-1'>
                    Danh sách Report Tổng
                  </h4>
                </CardHeader>

                <CardBody>
                  <div id='table-gridjs'>
                    {/* <Row className='g-4 mb-3'>
                      <Col className='col-sm'>
                        <SearchComponent data={data} onSearch={onSearch} />
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

export default TotalReport;
