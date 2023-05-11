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
import { CCUAPI } from '../../../api/ccu.api';
import { PartnerDetailAPI } from '../../../api/partnerdetail.api';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import CustomSelectComponent from '../../../Components/Common/custom-select/custom-select.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import StackAreaChartComponent from '../../../Components/Common/stack-area-chart.component';
import { getListOption, getStackAreaData, getStackAreaData1 } from '../../../helpers/array.helper';
import * as moment from 'moment';
import './ccu.style.scss';
import GradientChartComponent from '../../../Components/Common/gradient-chart.component';

const CCUReport = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [listPartner, setListPartner] = useState([]);
  const [ccuReport, setCCUReport] = useState({
    data: [],
    legendData: [],
    xAxis: [],
  });
  const [partnerChart, setPartnerChart] = useState({
    data: [],
    legendData: [],
    xAxis: [],
  });
  const initialValues = {
    partner: null,
  };

  const getNewDataCCU = async () => {
    try {
      setLoading(true);
      const response = await CCUAPI.getTimelineCCU();
      setCCUReport(getStackAreaData(response.data));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Promise.all([
        CCUAPI.getCCUList(),
        CCUAPI.getTimelineCCU(),
        PartnerDetailAPI.getPartner(),
      ]);
      const listPartner = getListOption(
        response[2].data,
        'nickname',
        'nickname'
      );
      setCCUReport(getStackAreaData(response[1].data));
      setListPartner(listPartner);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  const handleChangeNickname = async (partner) => {
    try {
      setLoading(true);
      const response = await CCUAPI.getCCUByCustomer(partner);
      // const convertData = response.data.reduce(
      //   (prev, current) => {
      //     prev.xAxis.push(
      //       moment(current.createdtime).format('HH:mm')
      //     );
      //     prev.data.push(current.ccu);
      //     return prev;
      //   },
      //   { xAxis: [], data: [] }
      // );
      // console.log(convertData);
      setPartnerChart(getStackAreaData1(response.data));
      console.log(response)
      // setPartnerChart(convertData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInitialData();
  }, [getInitialData]);

  document.title = 'CCU Tổng';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='CCU Tổng' pageTitle='CCU' />

          <Row>
            <Col lg={6} className='flex'>
              <Button
                color='primary'
                className='mt-3 submit-button btn-label'
                onClick={getNewDataCCU}
              >
                <i className='ri-refresh-line label-icon align-middle fs-16 me-2'></i>
                Reload
              </Button>
            </Col>
          </Row>

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className='card-title mb-0'>Biểu đồ CCU</h4>
                </CardHeader>
                <CardBody>
                  <StackAreaChartComponent
                    dataColors='["--vz-primary"]'
                    legendData={ccuReport.legendData}
                    xAxisData={ccuReport.xAxis}
                    data={ccuReport.data}
                  />
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Formik
                enableReinitialize
                onSubmit={() => {}}
                initialValues={initialValues}
              >
                <Form>
                  <CustomSelectComponent
                    label='Chọn partner'
                    name='partner'
                    placeholder='Vui lòng chọn partner'
                    options={listPartner}
                    onChange={handleChangeNickname}
                  />
                </Form>
              </Formik>
            </Col>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className='card-title mb-0'>CCU của khách hàng</h4>
                </CardHeader>
                <CardBody>
                <StackAreaChartComponent
                    dataColors='["--vz-primary"]'
                    legendData={partnerChart.legendData}
                    xAxisData={partnerChart.xAxis}
                    data={partnerChart.data}
                  />
                  {/* <GradientChartComponent
                    name='CCU'
                    data={partnerChart.data}
                    xAxisCategories={partnerChart.xAxisCategories}
                    dataColors='["--vz-success"]'
                    title='Time'
                    yAxisConfig={{
                      min: 0,
                      max: 10,
                      title: {
                        text: 'CCU',
                      },
                    }}
                  /> */}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CCUReport;
