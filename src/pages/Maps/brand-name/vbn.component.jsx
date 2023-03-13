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
import { VbnAPI } from '../../../api/vbn.api';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import CalendarComponent from '../../../Components/Common/calendar/calendar.component';
import CustomSelectComponent from '../../../Components/Common/custom-select/custom-select.component';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import SearchComponent from '../../../Components/Common/search.component';
import { generateOption, getListOption } from '../../../helpers/array.helper';
import './brand.style.scss';

const ReportVBN = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [brands, setBrands] = useState([]);
  const formRef = useRef();
  const validationSchema = useRef(
    Yup.object({
      date: Yup.object({
        startDate: Yup.string().required('Please pick Date'),
        endDate: Yup.string().required('Please pick Date'),
      }),
      brandname: Yup.object().nullable().required('Please choose Brandname'),
    })
  ).current;
  const initialValues = useRef({
    date: { startDate: '', endDate: '' },
    brandname: null,
  }).current;
  const COLUMN_CONFIG = useRef([
    {
      field: 'Charge_Duration',
      headerName: 'Charge Duration',
      flex: 1,
    },
    {
      field: 'Customer',
      headerName: 'Customer',
      flex: 1,
    },
    {
      field: 'Date',
      headerName: 'Date',
      flex: 0.5,
    },
    {
      field: 'Tin_OTP',
      headerName: 'Tin_OTP',
      flex: 1,
    },
    {
      field: 'Total',
      headerName: 'Total',
      flex: 0.5,
    },
    {
      field: 'brandname',
      headerName: 'Brand Name',
      flex: 0.5,
    },
  ]).current;

  const getInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Promise.all([
        VbnAPI.getVbnList(),
        // VbnAPI.getVbnDurationList(),
      ]);
      setBrands(
        getListOption(response[0].data, 'callergatewayid', 'callergatewayid')
      );
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

  // const handleChangeNickname = (value) => {
  //   setAccounts(
  //     listAllAccounts.current.reduce((prev, current) => {
  //       if (current.partnerid === value) {
  //         prev.push(generateOption(current.account, current.id));
  //       }
  //       return prev;
  //     }, [])
  //   );
  // };

  const handleChangeName = (value) => {
    setBrands(value);
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const { date, brandname } = values;
      const response = await VbnAPI.getVbnDurationList(
        date.startDate,
        date.endDate,
        brandname?.value
      );
      setData(response.data);
      setSearchData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  document.title = 'Report BrandName Customers';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='Report BrandName' pageTitle='Map' />

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
                  <CalendarComponent
                    name='date'
                    placeholder='Please pick Date'
                  />
                </Col>

                <Col lg={6}>
                  <CustomSelectComponent
                    options={brands}
                    name='brandname'
                    placeholder='Please select BrandName'
                    onChange={handleChangeName}
                  />
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
                    Danh sách Report Brand
                  </h4>
                </CardHeader>

                <CardBody>
                  <div id='table-gridjs'>
                    <Row className='g-4 mb-3'>
                      <Col className='col-sm'>
                        <SearchComponent data={data} onSearch={onSearch} />
                      </Col>
                    </Row>

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

export default ReportVBN;
