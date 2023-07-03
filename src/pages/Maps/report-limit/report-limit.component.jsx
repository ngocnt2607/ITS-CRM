import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from 'reactstrap';
import { ReportAPI } from '../../../api/report.api';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import SearchComponent from '../../../Components/Common/search.component';
import { formatNumberComparator } from '../../../helpers/sort-table.helper';

const ReportLimit = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const searchValues = useRef({});
  const COLUMN_CONFIG = useRef([
    {
      field: 'account',
      headerName: 'Tên khách hàng',
      flex: 1,
      minWidth: 160,
    },
    {
      field: 'limitmoney',
      headerName: 'Hạn mức',
      flex: 1,
      minWidth: 160,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'money',
      headerName: 'Hạn mức đã dùng',
      flex: 1,
      minWidth: 160,
      sortComparator: formatNumberComparator,
    },
    {
      field: 'remaining',
      headerName: 'Hạn mức còn lại',
      flex: 1,
      minWidth: 160,
      sortComparator: formatNumberComparator,
    },
  ]).current;

  const onSearch = (search) => {
    setSearchData(search);
  };

  const convertData = (data) => {
    return (
      data?.map((item) => {
        const nf = new Intl.NumberFormat('en-US');
        return {
          ...item,
          limitmoney: nf.format(item?.['limitmoney']),
          money: nf.format(item?.['money']),
          remaining: nf.format(item?.['remaining']),
        };
      }) || []
    );
  };

  const getInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Promise.all([
        ReportAPI.getReportLimit(),
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

  document.title = 'Report Limit';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='Check hạn mức' pageTitle='Báo cáo' />
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
                  <Col className='col-sm'>
                    <SearchComponent data={data} onSearch={onSearch} />
                  </Col>
                </CardHeader>

                <CardBody>
                  <div id='table-gridjs'>
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

export default ReportLimit;
