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
import { NumberMemberAPI } from '../../../api/number-member.api';
import { ReportAPI } from '../../../api/report.api';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import CustomSelectComponent from '../../../Components/Common/custom-select/custom-select.component';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import SearchComponent from '../../../Components/Common/search.component';
import { generateOption, getListOption } from '../../../helpers/array.helper';
import { formatNumberComparator } from '../../../helpers/sort-table.helper';

const NumberITS = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState('');
  const searchValues = useRef({});
  const formRef = useRef();
  const [listData, setListData] = useState({
    nicknames: [],
  });
  const validationSchema = useRef(
    Yup.object({
      nickname: Yup.object().nullable().required('Vui lòng chọn đối tác'),
      mapping: Yup.object().nullable().required('Vui lòng chọn hướng nhà mạng'),
    })
  ).current;

  const [listMapping, setListMapping] = useState({
    mappings: [],
  });

  const initialValues = useRef({
    nickname: null,
    mapping: null,
  }).current;
  const COLUMN_CONFIG = useRef([
    {
      field: 'mapping',
      headerName: 'Đối tác',
      flex: 1,
      minWidth: 100,
    },
    {
      field: 'isdn',
      headerName: 'Số điện thoại',
      flex: 1,
      minWidth: 300,
    },
  ]).current;

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

  useLayoutEffect(() => {
    const handleCallAPI = async () => {
      const listAPI = [NumberMemberAPI.getMappingPartner];
      try {
        setLoading(true);
        const response = await Promise.all(
          listAPI.map((api) => api(selectedPartner))
        );
        setListMapping({
          mappings: getListOption(response[0]?.data, 'mapping', 'mapping'),
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    if (formRef.current) {
      formRef.current.setFieldValue('mapping', null);
    }
    if (selectedPartner) {
      handleCallAPI();
    } else {
      setListMapping({ mappings: [] });
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
      const { selectedAccount } = convertParams(values);
      const response = await NumberMemberAPI.findISDN(
        selectedAccount
      );
      searchValues.current = values;
      setData(response?.data);
      setSearchData(response?.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const convertParams = (values) => {
    const selectedPartner = values.nickname?.value ?? '';
    const selectedAccount = values.mapping?.value ?? '';
    return {
      selectedPartner,
      selectedAccount
    };
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      const result = await ReportAPI.downloadISDN(
        convertParams(searchValues.current)
      );
      const url = window.URL.createObjectURL(result.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'list_isdn';
      link.click();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  document.title = 'ITS ISDN';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='Quản lý số' pageTitle='Quản lý' />

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
                  <CustomSelectComponent
                    options={listData.nicknames}
                    name='nickname'
                    placeholder='Chọn đối tác'
                    onChange={handleChangeSelectedPartner}
                  />
                </Col>

                <Col lg={3}>
                  <CustomSelectComponent
                    options={listMapping.mappings}
                    name='mapping'
                    placeholder='Chọn hướng nhà mạng'
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
              </Row>
            </Form>
          </Formik>

          <Row className='mt-3'>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <Col className='col-sm d-flex gap-2 justify-content-end'>
                    {/* <ShowHideColumn1Component
                      columns={columnConfig}
                      setColumns={setColumnConfig}
                    /> */}
                    <h3 className='card-title mb-0 flex-grow-1'>
                      Danh sách Số
                    </h3>
                    <SearchComponent data={data} onSearch={onSearch} />
                  </Col>
                </CardHeader>

                <CardBody>
                  <div id='table-gridjs'>
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

export default NumberITS;
