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
import { ReportAPI } from '../../../api/report.api';
import { PartnerDetailAPI } from '../../../api/partnerdetail.api';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import CalendarComponent from '../../../Components/Common/calendar/calendar.component';
import CustomSelectComponent from '../../../Components/Common/custom-select/custom-select.component';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import SearchComponent from '../../../Components/Common/search.component';
import WidgetsComponent from '../../../Components/Common/widgets.component';
import { generateOption, getListOption } from '../../../helpers/array.helper';
import { reportWidgets } from '../../../shared/const/widget.const';
import './report-customer.style.scss';
import ShowHideColumnComponent from '../../../Components/Common/show-hide-column.component';
import { formatNumberComparator } from '../../../helpers/sort-table.helper';

const ReportCustomer = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [partners, setPartners] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [widgetsData, setWidgetsData] = useState({});
  const searchValues = useRef(undefined);
  const formRef = useRef();
  const [listData, setListData] = useState({
    telcos: [],
    nicknames: [],
  });
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
  const listAllAccounts = useRef([]);
  const initialValues = useRef({
    date: { startDate: '', endDate: '' },
    nickname: null,
    telco: null,
  }).current;
  const [columnConfig, setColumnConfig] = useState([
    {
      field: 'createdtime',
      headerName: 'Thời gian',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'nickname',
      headerName: 'Mã đối tác',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'servicename',
      headerName: 'Tên dịch vụ',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'calltotal',
      headerName: 'Tổng call',
      flex: 1,
      minWidth: 150,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'callsuccess',
      headerName: 'Call Success',
      flex: 1,
      minWidth: 150,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'callmiss',
      headerName: 'Call Miss',
      flex: 1,
      minWidth: 150,
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
      minWidth: 150,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'revenue',
      headerName: 'Doanh thu ngày',
      flex: 1,
      minWidth: 150,
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
        // PartnerAPI.getListPartner(),
        // PartnerAPI.getListAccountByPartner(),
        ReportAPI.getTotalReport(),
      ]);
      // setPartners(getListOption(response[1].data, 'nickname', 'id'));
      // setAccounts(getListOption(response[2].data, 'account', 'id'));
      // listAllAccounts.current = response[2].data;
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

  // const handleChangeNickname = (value) => {
  //   formRef.current?.setFieldValue('account', null);
  //   setAccounts(
  //     listAllAccounts.current.reduce((prev, current) => {
  //       if (current.partnerid === value) {
  //         prev.push(generateOption(current.account, current.id));
  //       }
  //       return prev;
  //     }, [])
  //   );
  // };

  // const handleSubmit = async (values) => {
  //   try {
  //     setLoading(true);
  //     const { date, nickname, account } = values;
  //     const response = await ReportAPI.findReportList(
  //       date.startDate,
  //       date.endDate,
  //       nickname?.value || '',
  //       account?.value || ''
  //     );
  //     const mapData1 = convertData(response?.data);
  //     setData(mapData1);
  //     setSearchData(mapData1);
  //     setWidgetsData(response.total?.[0]);
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //   }
  // };
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const { starttime, endtime, selectedPartner, selectedAccount } = convertParams(values);
      const response = await ReportAPI.findReportList(starttime, endtime, selectedPartner, selectedAccount);
      searchValues.current = values;
      const mapData1 = convertData(response?.data);
      setData(mapData1);
      setSearchData(mapData1);
      setWidgetsData(response.total?.[0]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  
  const convertParams = (values) => {
    const { startDate, endDate } = values.date || {};
    const selectedPartner = values.nickname?.value ?? '';
    const selectedAccount = values.telco?.value ?? '';
    return {
      starttime: startDate ?? '',
      endtime: endDate ?? '',
      selectedPartner,
      selectedAccount
    };
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      const result = await ReportAPI.downloadReport(
        convertParams(searchValues.current)
      );
      const url = window.URL.createObjectURL(result.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'report';
      link.click();
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
                <Col lg={3}>
                  <CalendarComponent name='date' placeholder='Chọn ngày' />
                </Col>

                <Col lg={3}>
                  <CustomSelectComponent
                    options={listData.nicknames}
                    name='nickname'
                    placeholder='Chọn đối tác'
                    // onChange={handleChangeNickname}
                  />
                </Col>

                <Col lg={3}>
                  <CustomSelectComponent
                    options={listData.telcos}
                    name='telco'
                    placeholder='Chọn nhà mạng'
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

                <Col lg={3}>
                  <Button
                     color='success'
                     className='add-btn'
                     onClick={handleDownload}
                   >
                     Tải về
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

export default ReportCustomer;
