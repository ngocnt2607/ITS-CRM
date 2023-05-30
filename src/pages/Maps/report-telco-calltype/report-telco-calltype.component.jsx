import { Form, Formik } from 'formik';
import React, { useCallback, useEffect, useRef, useState, useLayoutEffect } from 'react';
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

const ReportTelcoCallType = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState('');
  const searchValues = useRef({});
  const formRef = useRef();
  const [listData, setListData] = useState({
    telco_groups: [],
  });
  const validationSchema = useRef(
    Yup.object({
      date: Yup.object({
        startDate: Yup.string().required('Vui lòng chọn ngày bắt đầu'),
        endDate: Yup.string().required('Vui lòng chọn ngày kết thúc'),
      }),
      telco_group: Yup.object().nullable(),
      callType: Yup.object().nullable(),
    })
  ).current;

  const TYPE_OPTION = useRef([
    { label: 'VTL', value: 'VTL' },
    { label: 'MBF', value: 'MBF' },
    { label: 'VNP', value: 'VNP' },
    { label: 'GMB', value: 'GMB' },
    { label: 'VNM', value: 'VNM' },
    { label: 'GTEL', value: 'GTEL' },
    { label: 'DIGITEL', value: 'DIGITEL' },
  ]).current;

  const [listCalltype, setListCalltype] = useState({
    callTypes: [],
  });

  const initialValues = useRef({
    date: { startDate: '', endDate: '' },
    telco_group: null,
    callType: null,
  }).current;
  const COLUMN_CONFIG = useRef([
    {
      field: 'dateTime',
      headerName: 'Thời gian',
      flex: 0.5,
      width: 100,
    },
    {
      field: 'telco_group',
      headerName: 'Nhà mạng',
      flex: 0.5,
      width: 160,
    },
    {
      field: 'callType',
      headerName: 'Hướng cuộc gọi',
      flex: 1,
      width: 200,
    },
    {
      field: 'totalDuration',
      headerName: 'Tổng phút gọi',
      flex: 0.5,
      width: 140,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'totalAmount',
      headerName: 'Thành tiền',
      flex: 0.5,
      width: 140,
      sortComparator: formatNumberComparator,
    },
  ]).current;

  const convertData = (data) => {
    return (
      data?.map((item) => {
        const nf = new Intl.NumberFormat('en-US');
        return {
          ...item,
          totalDuration: nf.format(item?.['totalDuration']),
          totalAmount: nf.format(item?.['totalAmount']),
        };
      }) || []
    );
  };

  const getInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Promise.all([
        ReportAPI.getReportTelcoCallTypeList(),
      ]);
      const mapData = convertData(response[0]?.data);
      setData(mapData);
      setSearchData(mapData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    getInitialData();
  }, [getInitialData]);


  useEffect(() => {
    getInitialData();
  }, [getInitialData]);

  // const getListData = useCallback(async () => {
  //   const listAPI = [ReportAPI.getReportTelcoCallTypeList];
  //   try {
  //     setLoading(true);
  //     const response = await Promise.all(listAPI.map((api) => api()));
  //     setListData((prev) => ({
  //       ...prev,
  //       telco_groups: getListOption(response[0]?.data, 'telco_group', 'telco_group'),
  //     }));
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   getListData();
  // }, [getListData]);

  useLayoutEffect(() => {
    const handleCallAPI = async () => {
      const listAPI = [ReportAPI.getCallTypeTelco];
      try {
        setLoading(true);
        const response = await Promise.all(
          listAPI.map((api) => api(selectedPartner))
        );
        setListCalltype({
          callTypes: getListOption(response[0]?.data, 'callType', 'callType'),
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    if (formRef.current) {
      formRef.current.setFieldValue('callType', null);
    }
    if (selectedPartner) {
      handleCallAPI();
    } else {
      setListCalltype({ callTypes: [] });
    }
  }, [selectedPartner]);

  const handleChangeSelectedPartner = (value) => {
    setSelectedPartner(value);
  };

  const onSearch = (search) => {
    setSearchData(search);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const { date, telco_group, callType } = values;
      const response = await ReportAPI.findReportCallTypeTelco(
        date.startDate,
        date.endDate,
        telco_group?.value || '',
        callType?.value || '',
      );
      const mapData1 = convertData(response?.data);
      setData(mapData1);
      setSearchData(mapData1);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  document.title = 'Report Telco CallType';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='Report theo hướng nhà mạng' pageTitle='Báo cáo' />

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
                    options={TYPE_OPTION}
                    name='telco_group'
                    placeholder='Chọn nhà mạng'
                    onChange={handleChangeSelectedPartner}
                  />
                </Col>

                <Col lg={3}>
                  <CustomSelectComponent
                    options={listCalltype.callTypes}
                    name='callType'
                    placeholder='Chọn hướng cuộc gọi'
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
                  {/* <Col className='col-sm d-flex gap-2 justify-content-end'>
                    <ShowHideColumn1Component
                      columns={columnConfig}
                      setColumns={setColumnConfig}
                    />
                  </Col> */}
                </CardHeader>

                <DataGridComponent
                  columns={COLUMN_CONFIG}
                  rows={searchData}
                />
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ReportTelcoCallType;
