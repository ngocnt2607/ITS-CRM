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
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import CalendarComponent from '../../../Components/Common/calendar/calendar.component';
import CustomSelectComponent from '../../../Components/Common/custom-select/custom-select.component';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import SearchComponent from '../../../Components/Common/search.component';
import { generateOption, getListOption } from '../../../helpers/array.helper';
import ShowHideColumn1Component from '../../../Components/Common/show-hide-column-report-detail.component';
import { formatNumberComparator } from '../../../helpers/sort-table.helper';

const ReportDetailCustomer = () => {
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const searchValues = useRef({});
  const formRef = useRef();
  const [listData, setListData] = useState({
    nicknames: [],
  });
  const validationSchema = useRef(
    Yup.object({
      date: Yup.object({
        startDate: Yup.string().required('Vui lòng chọn ngày bắt đầu'),
        endDate: Yup.string().required('Vui lòng chọn ngày kết thúc'),
      }),
      nickname: Yup.object().nullable().required('Vui lòng chọn đối tác'),
    })
  ).current;
  const initialValues = useRef({
    date: { startDate: '', endDate: '' },
    nickname: null,
  }).current;
  const [columnConfig, setColumnConfig] = useState([
    {
      field: 'startTime',
      headerName: 'Thời gian bắt đầu',
      width: 180,
    },
    {
      field: 'stopTime',
      headerName: 'Thời gian kết thúc',
      width: 180,
    },
    {
      field: 'caller',
      headerName: 'Số gọi',
      width: 140,
    },
    {
      field: 'callerTelcoId',
      headerName: 'Nhà mạng gọi đi',
      width: 150,
    },
    {
      field: 'callee',
      headerName: 'Số nhận cuộc gọi',
      width: 150,
    },
    {
      field: 'calleeTelcoid',
      headerName: 'Nhà mạng nhận cuộc gọi',
      width: 200,
    },
    {
      field: 'callerRtpIp',
      headerName: 'Ip RTP gọi đi',
      width: 150,
    },
    {
      field: 'billTime',
      headerName: 'Thời gian tính tiền',
      width: 200,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'billAmount',
      headerName: 'Thành tiền',
      width: 120,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'callercallid',
      headerName: 'Id của người gọi',
      width: 300,
    },
    {
      field: 'brandName',
      headerName: 'Định danh',
      width: 150,
    },
    {
      field: 'cdrId',
      headerName: 'Cdr Id',
      width: 120,
    },
    {
      field: 'isMnp',
      headerName: 'Qua MNP',
      width: 120,
    },
    {
      field: 'callType',
      headerName: 'Loại cuộc gọi',
      width: 220,
    },
    {
      field: 'isBrand',
      headerName: 'Dịch vụ',
      width: 150,
    },
    {
      field: 'endReason',
      headerName: 'Mã lỗi',
      width: 150,
    },
    {
      field: 'partner01',
      headerName: 'Đối tác cấp 1',
      width: 150,
      hide: true,
    },
    {
      field: 'partner02',
      headerName: 'Đối tác cấp 2',
      width: 150,
      hide: true,
    },
    {
      field: 'partner03',
      headerName: 'Đối tác cấp 3',
      width: 150,
      hide: true,
    },
    {
      field: 'partner04',
      headerName: 'Đối tác cấp 4',
      width: 150,
      hide: true,
    },
  ]);

  const convertData = (data) => {
    return (
      data?.map((item) => {
        const nf = new Intl.NumberFormat('en-US');
        return {
          ...item,
          billAmount: nf.format(item?.['billAmount']),
          billTime: nf.format(item?.['billTime']),
        };
      }) || []
    );
  };

  const getInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const { starttime, endtime, selectedPartner } = searchValues.current;
      const hasSearch = starttime && endtime;
      const response = await (hasSearch
        ? ReportAPI.findReportDetailList({
          starttime: starttime,
          endtime: endtime,
          nickname: selectedPartner,
          offset: page,
        })
        : ReportAPI.getReportDetail(page));
      const mapData = convertData(response?.data);
      setTotalPage(response?.total_page);
      setData(mapData);
      setSearchData(mapData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    getInitialData();
  }, [getInitialData]);

  const getListData = useCallback(async () => {
    const listAPI = [PartnerAPI.getListPartner];
    try {
      setLoading(true);
      const response = await Promise.all(listAPI.map((api) => api()));
      setListData((prev) => ({
        ...prev,
        nicknames: getListOption(response[0]?.data, 'nickname', 'nickname'),
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
    const converted = convertParams(values);
    searchValues.current = converted;

    if (page !== 1) {
      setPage(1);
      return;
    }

    try {
      setLoading(true);
      const { starttime, endtime, selectedPartner } = converted;
      const response = await ReportAPI.findReportDetailList({
        starttime,
        endtime,
        nickname: selectedPartner,
        offset: 1,
      });
      const mapData1 = convertData(response?.data);
      setTotalPage(response?.total_page);
      setData(mapData1);
      setSearchData(mapData1);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const convertParams = (values) => {
    const { startDate, endDate } = values.date || {};
    const selectedPartner = values.nickname?.value ?? '';
    return {
      starttime: startDate ?? '',
      endtime: endDate ?? '',
      selectedPartner,
    };
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      const result = await ReportAPI.downloadReportDetail(searchValues.current);
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
          <BreadCrumb title='Chi tiết cước' pageTitle='Báo cáo' />

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
                  <Button
                    color='success'
                    className='download'
                    onClick={handleDownload}
                  >
                    Tải về
                  </Button>
                </Col>

                <Col className='col-sm d-flex gap-2 justify-content-end'>
                  <ShowHideColumn1Component
                    columns={columnConfig}
                    setColumns={setColumnConfig}
                  />
                </Col>
              </Row>
            </Form>
          </Formik>

          <Row className='mt-3'>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  {/* <Col className='col-sm d-flex gap-2 justify-content-end'>
                    <ShowHideColumn1Component
                      columns={columnConfig}
                      setColumns={setColumnConfig}
                    />
                  </Col> */}
                </CardHeader>

                <CardBody>
                  <div id='table-gridjs'>
                    <DataGridComponent
                      isDisplayPagination
                      columns={columnConfig}
                      rows={searchData}
                      totalPage={totalPage}
                      handleChangePage={(newPage) => setPage(newPage)}
                      page={page}
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

export default ReportDetailCustomer;
