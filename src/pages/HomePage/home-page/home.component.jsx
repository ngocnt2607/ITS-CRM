import { Typography } from '@mui/material';
import { Form, Formik } from 'formik';
import { Link } from 'react-router-dom';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './home-page.style.scss';
import { Helmet } from 'react-helmet';
import WidgetsComponent from '../../../Components/Common/widgets.component';
import BarChartComponent from '../../../Components/Common/bar-chart.component';
import {
  generateOption,
  get30DaysValue,
  get30DaysValue1,
  get30DaysValue2,
  get30DaysValue3,
} from '../../../helpers/array.helper';
import { ReportAPI } from '../../../api/report.api';
import { SMSVendorAPI } from '../../../api/sms-vendor.api';
import { HomeAPI } from '../../../api/home.api';
import { TotalReportAPI } from '../../../api/totalreport.api';
import { reportWidgets } from '../../../shared/const/widget.const';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import LoadingComponent from '../../../Components/Common/loading.component';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from 'reactstrap';
import './home-page.style.scss';
import { UserRole } from '../../../shared/const/user-role.const';
import { useProfile } from '../../../Components/Hooks/UserHooks';
// import { PageName } from 'shared/const/drawer.const';

const HomePage = () => {
  const [modal_list, setmodal_list] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [data1, setData1] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [widgetsData, setWidgetsData] = useState({});
  const formRef = useRef();
  const { userProfile } = useProfile();
  const [chartValue, setChartValue] = useState({
    labels: [],
    revenues: [],
  });
  const [chartValueVoice, setChartValueVoice] = useState({
    labels: [],
    voicetimes: [],
  });
  // const [chartValueSmsVendor, setChartValueSmsVendor] = useState({
  //   labels: [],
  //   revenues: [],
  // });
  // const [chartValueSmsPartner, setChartValueSmsPartner] = useState({
  //   labels: [],
  //   revenues: [],
  // });

  const getHomePage = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Promise.all([
        HomeAPI.getHomeTop10List(),
        // SMSVendorAPI.getSMSBrandTotal(),
      ]);
      const mapData = convertData(response[0].data || []);
      // const mapData1 = convertData1(response[1].data);
      setData(mapData);
      // setData1(mapData1);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getHomePage();
  }, [getHomePage]);

  const convertData = (data) => {
    return (
      data?.map((item) => {
        const nf = new Intl.NumberFormat('en-US');
        return {
          ...item,
          calltotal: nf.format(item?.['calltotal']),
          callsuccess: nf.format(item?.['callsuccess']),
          callmiss: nf.format(item?.['callerror480']),
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

  // const convertData1 = (data1) => {
  //   return (
  //     data1?.map((item1) => {
  //       const nf1 = new Intl.NumberFormat('en-US');
  //       return {
  //         ...item1,
  //         revenues: nf1.format(item1?.['revenues']),
  //       };
  //     }) || []
  //   );
  // };

  const getInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Promise.all([
        ReportAPI.getTotalReport(),
        TotalReportAPI.getTotalReportList(),
        // SMSVendorAPI.getSMSVendorTotal(),
        // SMSVendorAPI.getSMSPartnerTotal(),
      ]);
      setWidgetsData(response[0]?.data?.[0]);
      setChartValue(get30DaysValue(response[1]?.data, 'date', 'revenue'));
      setChartValueVoice(
        get30DaysValue1(response[1]?.data, 'date', 'voicetime')
      );
      // setChartValueSmsVendor(
      //   get30DaysValue2(response[2]?.data, 'created_time', 'revenue')
      // );
      // setChartValueSmsPartner(
      //   get30DaysValue3(response[3]?.data, 'created_time', 'revenue')
      // );
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

  document.title = 'Dashboard';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          {/* <BreadCrumb title='Doanh thu ngày hiện tại' pageTitle='Dashboard' /> */}
          {(userProfile.group === UserRole.SUPER_ADMIN_GROUP ||
            userProfile.group === UserRole.CS ||
            userProfile.group === UserRole.KETOAN ||
            userProfile.group === UserRole.NOC ||
            userProfile.group === UserRole.CUSTOMER ||
            userProfile.group === UserRole.ADMIN_USER ||
            userProfile.group === UserRole.SALE ||
            userProfile.group === UserRole.SALEADMIN) && (
            <Card>
              <CardHeader>
                <h4 className='card-title mb-0'>Doanh thu ngày hiện tại</h4>
                <WidgetsComponent widgets={reportWidgets} data={widgetsData} />
              </CardHeader>
            </Card>
          )}
          <Row>
            <Col xl={6}>
              {(userProfile.group === UserRole.SUPER_ADMIN_GROUP ||
                userProfile.group === UserRole.CS ||
                userProfile.group === UserRole.KETOAN ||
                userProfile.group === UserRole.NOC ||
                userProfile.group === UserRole.CUSTOMER ||
                userProfile.group === UserRole.ADMIN_USER ||
                userProfile.group === UserRole.SALE ||
                userProfile.group === UserRole.SALEADMIN) && (
                <Card>
                  <CardHeader>
                    <h4 className='card-title mb-0'>
                      Phút thoại 30 ngày gần nhất
                    </h4>
                  </CardHeader>
                  <CardBody>
                    <BarChartComponent
                      dataColors='["--vz-success-rgb, 0.8", "--vz-success-rgb, 0.9"]'
                      title='Số phút gọi'
                      labels={chartValueVoice.labels}
                      columnData={chartValueVoice.voicetimes}
                    />
                  </CardBody>
                </Card>
              )}
            </Col>
            <Col xl={6}>
              {(userProfile.group === UserRole.SUPER_ADMIN_GROUP ||
                userProfile.group === UserRole.CS ||
                userProfile.group === UserRole.KETOAN ||
                userProfile.group === UserRole.NOC ||
                userProfile.group === UserRole.CUSTOMER ||
                userProfile.group === UserRole.ADMIN_USER ||
                userProfile.group === UserRole.SALE ||
                userProfile.group === UserRole.SALEADMIN) && (
                <Card>
                  <CardHeader>
                    <h4 className='card-title mb-0'>
                      Doanh thu 30 ngày gần nhất
                    </h4>
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
              )}
            </Col>
          </Row>

          {/* <Row>
            <Col xl={6}>
              {(userProfile.group === UserRole.SUPER_ADMIN_GROUP ||
                userProfile.group === UserRole.SALE_ADMIN_SMS) && (
                <Card>
                  <CardHeader>
                    <h4 className='card-title mb-0'>
                      Doanh thu SMS Vendor 30 ngày gần nhất
                    </h4>
                  </CardHeader>
                  <CardBody>
                    <BarChartComponent
                      dataColors='["--vz-danger-rgb, 0.8", "--vz-danger-rgb, 0.9"]'
                      title='Doanh thu'
                      labels={chartValueSmsVendor.labels}
                      columnData={chartValueSmsVendor.revenues}
                    />
                  </CardBody>
                </Card>
              )}
            </Col>
            <Col xl={6}>
              {(userProfile.group === UserRole.SUPER_ADMIN_GROUP ||
                userProfile.group === UserRole.SALE_ADMIN_SMS) && (
                <Card>
                  <CardHeader>
                    <h4 className='card-title mb-0'>
                      Doanh thu SMS Partner 30 ngày gần nhất
                    </h4>
                  </CardHeader>
                  <CardBody>
                    <BarChartComponent
                      dataColors='["--vz-warning-rgb, 0.8", "--vz-warning-rgb, 0.9"]'
                      title='Doanh thu'
                      labels={chartValueSmsPartner.labels}
                      columnData={chartValueSmsPartner.revenues}
                    />
                  </CardBody>
                </Card>
              )}
            </Col>
          </Row> */}

          <Row>
            <Col lg={12}>
              {userProfile.group === UserRole.SUPER_ADMIN_GROUP && (
                <Card>
                  <CardHeader>
                    <h4 className='card-title mb-0'>
                      Top 10 Doanh Thu Khách Hàng 7 Ngày Gần Nhất
                    </h4>
                  </CardHeader>

                  <CardBody>
                    <div id='customerList'>
                      <div className='table-responsive table-card mt-3 mb-1'>
                        <table
                          className='table align-middle table-nowrap'
                          id='customerTable'
                        >
                          <thead className='table-light'>
                            <tr>
                              <th scope='col' style={{ width: '50px' }}>
                                <div className='form-check'>
                                  <input
                                    className='form-check-input'
                                    type='checkbox'
                                    id='checkAll'
                                    value='option'
                                  />
                                </div>
                              </th>
                              <th className='sort' data-sort='top'>
                                Vị trí
                              </th>
                              <th className='sort' data-sort='nickname'>
                                Mã khách hàng
                              </th>
                              <th className='sort' data-sort='calltotal'>
                                Tổng cuộc gọi
                              </th>
                              <th className='sort' data-sort='voicetime'>
                                Tổng phút gọi
                              </th>
                              <th className='sort' data-sort='revenue'>
                                Doanh thu
                              </th>
                            </tr>
                          </thead>
                          <tbody className='list form-check-all'>
                            {data.map((item) => (
                              <tr key={item?.id}>
                                <th scope='row'></th>
                                <td className='text-primary'>
                                  <i className='ri-medal-line fs-17 align-middle'></i>
                                  Top {item?.id}
                                </td>
                                <td className='nickname'>
                                  <Link to='/report'>{item?.nickname}</Link>
                                </td>
                                <td className='calltotal'>{item?.calltotal}</td>
                                <td className='voicetime'>{item?.voicetime}</td>
                                <td className='revenue'>{item?.revenue}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              )}
            </Col>
          </Row>

          {/* <Row>
            {(userProfile.group === UserRole.SUPER_ADMIN_GROUP ||
              userProfile.group === UserRole.SALE_ADMIN_SMS) && (
              <Col lg={12}>
                <Card>
                  <CardHeader>
                    <h4 className='card-title mb-0'>
                      Top 20 Doanh Thu Khách Hàng SMS 7 Ngày Gần Nhất
                    </h4>
                  </CardHeader>

                  <CardBody>
                    <div id='customerList'>
                      <div className='table-responsive table-card mt-3 mb-1'>
                        <table
                          className='table align-middle table-nowrap'
                          id='customerTable'
                        >
                          <thead className='table-light'>
                            <tr>
                              <th scope='col' style={{ width: '50px' }}>
                                <div className='form-check'>
                                  <input
                                    className='form-check-input'
                                    type='checkbox'
                                    id='checkAll'
                                    value='option'
                                  />
                                </div>
                              </th>
                              <th className='sort' data-sort='top'>
                                Vị trí
                              </th>
                              <th className='sort' data-sort='sender_name'>
                                Sender
                              </th>
                              <th className='sort' data-sort='revenues'>
                                Doanh thu
                              </th>
                            </tr>
                          </thead>
                          {console.log(data1)}
                          <tbody className='list form-check-all'>
                            {data1.map((item1) => (
                              <tr key={item1?.ids}>
                                <th scope='row'></th>
                                <td className='text-primary'>
                                  <i className='ri-medal-line fs-17 align-middle'></i>
                                  Top {item1?.ids}
                                </td>
                                <td className='sender_name'>
                                  <Link to='/sms-brand'>
                                    {item1?.sender_name}
                                  </Link>
                                </td>
                                <td className='revenues'>{item1?.revenues}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            )}
          </Row> */}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default HomePage;
