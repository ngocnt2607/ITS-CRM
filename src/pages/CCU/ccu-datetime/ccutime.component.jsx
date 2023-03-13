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
import { CCUAPI } from '../../../api/ccu.api';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import CalendarTimeComponent from '../../../Components/Common/calendar/calendar-time.component';
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
import './ccu-time.style.scss';

const CCUTotal = () => {
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
      field: 'createdtime',
      headerName: 'Thời gian',
      flex: 1,
    },
    {
      field: 'ip',
      headerName: 'Server VOS',
      flex: 1,
    },
    {
      field: 'ccu',
      headerName: 'CCU',
      flex: 1,
    },
  ]).current;

  const convertData = (data) => {
    return (
      data?.map((item) => {
        const nf = new Intl.NumberFormat('en-US');
        return {
          ...item,
          ccu: nf.format(item?.['ccu']),
        };
      }) || []
    );
  };

  // const get30DaysValue = (data = []) => {
  //   let count = 0;
  //   const chart = {
  //     labels: [],
  //     data: [],
  //   };
  //   const tempValue = {
  //     labels: '',
  //     revenue: 0,
  //   };
  //   for (let i = 0; i < data.length; i++) {
  //     const item = data[i];
  //     if (!!i && (item.date !== tempValue.labels || i === data.length - 1)) {
  //       chart.labels.push(tempValue.labels);
  //       chart.data.push(tempValue.revenue);
  //       tempValue.revenue = 0;
  //       count += 1;
  //     }

  //     tempValue.labels = item.date;
  //     tempValue.revenue += item.revenue;

  //     if (count === 30) {
  //       break;
  //     }
  //   }
  //   return chart;
  // };

  const getInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Promise.all([CCUAPI.getCCUList()]);
      const mapData = convertData(response[0]?.data);
      setData(mapData);
      setSearchData(mapData);
      // setChartValue(get30DaysValue(response[0]?.data, 'date', 'revenue'));
      // setWidgetsData(response[0]?.total?.[0]);
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
      const response = await CCUAPI.findCCUTimeList(
        date.startDate,
        date.endDate
      );
      const mapData1 = convertData(response?.data);
      setData(mapData1);
      setSearchData(mapData1);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  document.title = 'CCU';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='CCU Real-time' pageTitle='CCU' />
            
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
                  <CalendarTimeComponent name='date' placeholder='Chọn ngày' />
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
                    Danh sách Report CCU theo giờ
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

export default CCUTotal;
