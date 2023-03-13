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
  const [selectedIP, setSelectedIP] = useState('');
  const [selectedPartner, setSelectedPartner] = useState('');
  const [widgetsData, setWidgetsData] = useState({});
  const [listData, setListData] = useState({
    vosips: [],
    nicknames: [],
  });
  const formRef = useRef();
  const validationSchema = useRef(
    Yup.object({
      date: Yup.object({
        startDate: Yup.string().required('Please pick Date'),
        endDate: Yup.string().required('Please pick Date'),
      }),
      nickname: Yup.object().nullable(),
      account: Yup.object().nullable(),
      vosip: Yup.object().nullable(),
    })
  ).current;
  const [listAccount, setListAccount] = useState({
    accounts: [],
  });
  const [listIp, setListIp] = useState([]);
  const initialValues = useRef({
    date: { startDate: '', endDate: '' },
    nickname: null,
    vosip: null,
    account: null,
  }).current;
  const [columnConfig, setColumnConfig] = useState([
    {
      field: 'createdtime',
      headerName: 'Thời gian',
      width: 100,
    },
    {
      field: 'nickname',
      headerName: 'Mã đối tác',
      width: 160,
    },
    {
      field: 'name',
      headerName: 'Tài khoản',
      width: 160,
    },
    {
      field: 'servicename',
      headerName: 'Tên dịch vụ',
      width: 160,
    },
    {
      field: 'calltotal',
      headerName: 'Tổng call',
      width: 100,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'callsuccess',
      headerName: 'Call Success',
      width: 120,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'callmiss',
      headerName: 'Call Miss',
      width: 100,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'callrate',
      headerName: 'Tỉ lệ cuộc gọi lỗi',
      width: 150,
    },
    {
      field: 'voicetime',
      headerName: 'Phút thoại',
      width: 120,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'revenue',
      headerName: 'Doanh thu ngày',
      width: 150,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'onnet_callsuccess',
      headerName: 'Cuộc gọi nội mạng thành công',
      // hide: true,
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
          callmiss: nf.format(item?.['callerror480']),
          // callrate: nf.format(item?.['callerror503']),
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
    const listAPI = [PartnerDetailAPI.getListIP, PartnerAPI.getListPartner];
    try {
      setLoading(true);
      const response = await Promise.all(listAPI.map((api) => api()));
      setListData((prev) => ({
        ...prev,
        vosips: getListOption(response[0]?.data, 'name', 'name'),
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

  useLayoutEffect(() => {
    const handleCallAPI = async () => {
      const listAPI = [ReportAPI.getVosIp];
      try {
        setLoading(true);
        const response = await Promise.all(
          listAPI.map((api) => api(selectedPartner))
        );
        setListIp(getListOption(response[0]?.data, 'name', 'name'));
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    if (formRef.current) {
      formRef.current.setFieldValue('vosip', null);
    }
    if (selectedPartner) {
      handleCallAPI();
    } else {
      setListIp([]);
    }
  }, [selectedPartner]);

  useLayoutEffect(() => {
    const handleCallAPI = async () => {
      const listAPI1 = [ReportAPI.getAccountReport];
      try {
        setLoading(true);
        const response = await Promise.all(
          listAPI1.map((api) => api(selectedPartner, selectedIP))
        );
        setListAccount({
          accounts: getListOption(response[0]?.data, 'name', 'name'),
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    if (formRef.current) {
      formRef.current.setFieldValue('account', null);
    }
    if (selectedPartner && selectedIP) {
      handleCallAPI();
    } else {
      setListAccount({ accounts: [] });
    }
  }, [selectedPartner, selectedIP]);

  const handleChangeSelectedPartner = (value) => {
    setSelectedPartner(value);
  };

  const handleChangeSelectedIP = (value) => {
    setSelectedIP(value);
  };

  const onSearch = (search) => {
    setSearchData(search);
  };

  // const handleChangeNickname = (value) => {
  //   formRef.current?.setFieldValue('account', null);
  //   formRef.current?.setFieldValue('vosip', null);
  //   setAccounts(
  //     listAllAccounts.current.reduce((prev, current) => {
  //       if (current.partnerid === value.partnerid && current.vosip === value.vosip) {
  //         prev.push(generateOption(current.account, current.id));
  //       }
  //       return prev;
  //     }, [])
  //   );
  //   setVosips(
  //     listAllVosips.current.reduce((prev, current) => {
  //       if (current.partnerid === value) {
  //         prev.push(generateOption(current.vosip, current.vosip));
  //       }
  //       return prev;
  //     }, [])
  //   );
  // };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const { date, nickname, vosip, account } = values;
      const response = await ReportAPI.findReportList(
        date.startDate,
        date.endDate,
        nickname?.value || '',
        vosip?.value || '',
        account?.value || ''
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
                    onChange={handleChangeSelectedPartner}
                  />
                </Col>

                <Col lg={2}>
                  <CustomSelectComponent
                    options={listIp}
                    name='vosip'
                    placeholder='Chọn Server VOS'
                    onChange={handleChangeSelectedIP}
                  />
                </Col>

                <Col lg={2}>
                  <CustomSelectComponent
                    options={listAccount.accounts}
                    name='account'
                    placeholder='Chọn tài khoản'
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

export default Report;
