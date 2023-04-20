import { Form, Formik } from 'formik';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
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
import { PartnerDetailAPI } from '../../../api/partnerdetail.api';
import { ReportAPI } from '../../../api/report.api';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import CalendarComponent from '../../../Components/Common/calendar/calendar.component';
import CustomSelectComponent from '../../../Components/Common/custom-select/custom-select.component';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import SearchComponent from '../../../Components/Common/search.component';
import WidgetsComponent from '../../../Components/Common/widgets.component';
import { generateOption, getListOption } from '../../../helpers/array.helper';
import { reportWidgets } from '../../../shared/const/widget.const';
import './report.style.scss';
import ShowHideColumnComponent from '../../../Components/Common/show-hide-column.component';
import { formatNumberComparator } from '../../../helpers/sort-table.helper';

const Report = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [widgetsData, setWidgetsData] = useState({});
  const [listData, setListData] = useState({
    telcos: [],
    nicknames: [],
  });
  const formRef = useRef();
  const validationSchema = useRef(
    Yup.object({
      date: Yup.object({
        startDate: Yup.string().required('Vui lòng chọn ngày bắt đầu'),
        endDate: Yup.string().required('Vui lòng chọn ngày kết thúc'),
      }),
      nickname: Yup.object().nullable(),
      telco: Yup.object().nullable(),
    })
  ).current;
  const initialValues = useRef({
    date: { startDate: '', endDate: '' },
    nickname: null,
    telco: null,
  }).current;
  const [columnConfig, setColumnConfig] = useState([
    {
      field: 'createdtime',
      headerName: 'Thời gian',
      flex: 0.5,
      minWidth: 110,
    },
    {
      field: 'nickname',
      headerName: 'Mã đối tác',
      flex: 0.5,
      minWidth: 110,
    },
    {
      field: 'servicename',
      headerName: 'Tên dịch vụ',
      flex: 0.5,
      minWidth: 120,
    },
    {
      field: 'calltotal',
      headerName: 'Tổng call',
      flex: 0.5,
      minWidth: 100,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'callsuccess',
      headerName: 'Call Success',
      flex: 0.5,
      minWidth: 120,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'callmiss',
      headerName: 'Call Miss',
      flex: 0.4,
      minWidth: 110,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'callrate',
      headerName: 'Tỉ lệ cuộc gọi lỗi',
      flex: 0.5,
      minWidth: 160,
    },
    {
      field: 'voicetime',
      headerName: 'Phút thoại',
      flex: 0.5,
      minWidth: 110,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'revenue',
      headerName: 'Doanh thu',
      flex: 0.5,
      minWidth: 120,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'onnet_callsuccess',
      headerName: 'Cuộc gọi nội mạng thành công',
      hide: true,
      width: 270,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'onnet_voicetime',
      headerName: 'Thời gian gọi nội mạng',
      hide: true,
      width: 250,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'onnet_revenue',
      headerName: 'Doanh thu nội mạng',
      hide: true,
      width: 250,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'offnet_callsuccess',
      headerName: 'Cuộc gọi ngoại mạng thành công',
      hide: true,
      width: 270,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'offnet_voicetime',
      headerName: 'Thời gian gọi ngoại mạng',
      hide: true,
      width: 250,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'offnet_revenue',
      headerName: 'Doanh thu ngoại mạng',
      hide: true,
      width: 250,
      sortComparator: formatNumberComparator,
    },
  ]);

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
          offnet_callsuccess: nf.format(item?.['offnet_callsuccess']),
          offnet_revenue: nf.format(item?.['offnet_revenue']),
          offnet_voicetime: nf.format(item?.['offnet_voicetime']),
          onnet_callsuccess: nf.format(item?.['onnet_callsuccess']),
          onnet_revenue: nf.format(item?.['onnet_revenue']),
          onnet_voicetime: nf.format(item?.['onnet_voicetime']),
        };
      }) || []
    );
  };

  const getInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Promise.all([
        ReportAPI.getReportList(),
        ReportAPI.getTotalReport(),
      ]);
      const mapData = convertData(response[0]?.data);
      setData(mapData);
      setSearchData(mapData);
      setWidgetsData(response[1]?.data?.[0]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    getInitialData();
  }, [getInitialData]);

  const getListData = useCallback(async () => {
    const listAPI = [PartnerDetailAPI.getTelco, PartnerAPI.getListPartner];
    try {
      setLoading(true);
      const response = await Promise.all(listAPI.map((api) => api()));
      setListData((prev) => ({
        ...prev,
        telcos: getListOption(response[0]?.data, 'name', 'name'),
        nicknames: getListOption(response[1]?.data, 'nickname', 'nickname'),
      }));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListData();
  }, [getListData]);

  const onSearch = (search) => {
    setSearchData(search);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const { date, nickname, telco } = values;
      const response = await ReportAPI.findReportList(
        date.startDate,
        date.endDate,
        nickname?.value || '',
        telco?.value || '',
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
          <BreadCrumb title='Báo cáo doanh thu' pageTitle='Báo cáo' />

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
                <Col lg={2}>
                  <CalendarComponent name='date' placeholder='Chọn ngày' />
                </Col>

                <Col lg={2}>
                  <CustomSelectComponent
                    options={listData.nicknames}
                    name='nickname'
                    placeholder='Chọn đối tác'
                  />
                </Col>

                <Col lg={2}>
                  <CustomSelectComponent
                    options={listData.telcos}
                    name='telco'
                    placeholder='Chọn nhà mạng'
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
                      Chi tiết Doanh thu theo ngày
                    </h2>
                    <ShowHideColumnComponent
                      columns={columnConfig}
                      setColumns={setColumnConfig}
                    />
                  </Col>
                </CardHeader>

                <CardBody>
                  <div id='table-gridjs'>
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

export default Report;
