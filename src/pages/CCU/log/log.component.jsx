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
import { LogAPI } from '../../../api/log.api';
import { UserListAPI } from '../../../api/user-list.api';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import CalendarComponent from '../../../Components/Common/calendar/calendar.component';
import CustomSelectComponent from '../../../Components/Common/custom-select/custom-select.component';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import SearchComponent from '../../../Components/Common/search.component';
import WidgetsComponent from '../../../Components/Common/widgets.component';
import { generateOption, getListOption } from '../../../helpers/array.helper';
import { reportWidgets } from '../../../shared/const/widget.const';
import './log.style.scss';
import ShowHideColumnComponent from '../../../Components/Common/show-hide-column.component';

const Log = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [names, setNames] = useState([]);
  const [widgetsData, setWidgetsData] = useState({});
  const formRef = useRef();
  const validationSchema = useRef(
    Yup.object({
      date: Yup.object({
        startDate: Yup.string().required('Please pick Date'),
        endDate: Yup.string().required('Please pick Date'),
      }),
      name: Yup.object().nullable(),
    })
  ).current;
  const initialValues = useRef({
    date: { startDate: '', endDate: '' },
    name: null
  }).current;
  const COLUMN_CONFIG = useRef([
    {
      field: 'createdtime',
      headerName: 'Thời gian',
      width: 200,
    },
    {
      field: 'name',
      headerName: 'Tên user',
      width: 170,
    },
    {
      field: 'api',
      headerName: 'API',
      width: 170,
    },
    {
      field: 'type',
      headerName: 'Loại tác động',
      width: 170,
    },
    {
      field: 'content',
      headerName: 'Nội dung tác động',
      width: 850,
    },

  ]).current;

  const getInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Promise.all([
        LogAPI.getLogList(),
        UserListAPI.getUserList(),
      ]);
      setNames(getListOption(response[1].data, 'username', 'username'));
      setData(response[0]?.data);
      setSearchData(response[0]?.data);
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
      const { date, name } = values;
      const response = await LogAPI.findLogList(
        date.startDate,
        date.endDate,
        name?.value || '',
      );
      setData(response.data);
      setSearchData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  document.title = 'Log';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='Log' pageTitle='Giám sát' />
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
                    options={names}
                    name='name'
                    placeholder='Chọn người dùng'
                    // onChange={handleChangeNickname}
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
                  <h4 className='card-title mb-0 flex-grow-1'>
                    Chi tiết log tác động
                  </h4>
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

export default Log;
