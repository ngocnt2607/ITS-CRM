import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Modal,
  ModalHeader,
  Row,
} from 'reactstrap';
import { VbnAPI } from '../../../api/vbn.api';
import addToast from '../../../Components/Common/add-toast.component';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
//import SingleCalendarComponent from '../../../Components/Common/calendar/single-calendar.component';
//import CustomInputComponent from '../../../Components/Common/custom-input.component';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import SearchComponent from '../../../Components/Common/search.component';
import { Message } from '../../../shared/const/message.const';
import AddVbnComponent from './components/add-brand.component';

const VbnList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const recordId = useRef(null);
  const [openModal, setOpenModal] = useState({
    isOpen: false,
    viewMode: false,
    updateRecord: null,
  });

  const open = (updateRecord, viewMode = false) => {
    setOpenModal({
      viewMode,
      updateRecord,
      isOpen: true,
    });
  };

  const close = () => {
    setOpenModal({
      updateRecord: null,
      isOpen: false,
      viewMode: false,
    });
  };

  const handleOpenDelete = (openDelete, row = null) => {
    if (openDelete) recordId.current = row.id;
    setOpenDelete(openDelete);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await VbnAPI.deleteVBN(recordId.current);
      addToast({ message: Message.DELETE_SUCCESS, type: 'success' });
      await getListVbn();
      handleOpenDelete(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getListVbn = useCallback(async () => {
    try {
      setLoading(true);
      const response = await VbnAPI.getVbnList();
      setData(response.data);
      setSearchData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListVbn();
  }, [getListVbn]);

  const COLUMN_CONFIG = useRef([
    {
      field: 'name',
      headerName: 'Tên brand',
      flex: 0.75,
    },
    {
      field: 'registrationnumber',
      headerName: 'Số đăng ký',
      flex: 0.75,
    },
    {
      field: 'registerby',
      headerName: 'Đơn vị đăng ký',
      flex: 0.75,
    },
    {
      field: 'register',
      headerName: 'Dịch vụ',
      flex: 0.75,
    },
    {
      field: 'begintime',
      headerName: 'Ngày bắt đầu',
      flex: 0.75,
    },
    {
      field: 'expiretime',
      headerName: 'Ngày hết hạn',
      flex: 0.75,
    },
    {
      field: 'action',
      headerName: 'Thao tác',
      flex: 0.85,
      sortable: false,
      renderCell: (cellValues) => (
        <>
          <Button
            color='info'
            size='small'
            onClick={() => open(cellValues.row, true)}
          >
            Xem
          </Button>
          <Button
            color='success'
            size='small'
            onClick={() => open(cellValues.row)}
            style={{ marginLeft: 8 }}
          >
            Sửa
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            color='danger'
            onClick={() => {
              handleOpenDelete(true, cellValues.row);
            }}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ]).current;

  const onSearch = (search) => {
    setSearchData(search);
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      const result = await VbnAPI.downloadVbn();
      const url = window.URL.createObjectURL(result.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'brand_name';
      link.click();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  document.title = 'Quản lý tên định danh';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='Danh sách tên định danh' pageTitle='Quản lý tên định danh' />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className='card-title mb-0 flex-grow-1'>Danh sách tên định danh</h4>
                </CardHeader>

                <CardBody>
                  <div id='table-gridjs'>
                    <Row className='g-4 mb-3'>
                      <Col className='col-sm-auto'>
                        <div className='d-flex gap-1'>
                          <Button
                            color='success'
                            className='add-btn'
                            onClick={() => open(false)}
                            id='create-btn'
                          >
                            <i className='ri-add-line align-bottom me-1'></i>{' '}
                            Thêm mới
                          </Button>

                          <Button
                            color='primary'
                            className='add-btn'
                            onClick={handleDownload}
                          >
                            Tải về
                          </Button>
                        </div>
                      </Col>
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

      <Modal
         isOpen={openDelete}
         toggle={() => handleOpenDelete(false)}
         id='firstmodal'
         modalClassName='flip'
         centered
      >         
        <ModalHeader>
          Xóa bản ghi
          <Button
            type='button'
            className='btn-close'
            onClick={() => handleOpenDelete(false)}
            aria-label='Close'
          ></Button>
        </ModalHeader>
        <div className='modal-body text-center p-5'>
          <lord-icon
            src='https://cdn.lordicon.com/tdrtiskw.json'
            trigger='loop'
            colors='primary:#ffbe0b,secondary:#4b38b3'
            style={{ width: '130px', height: '130px' }}
          ></lord-icon>
          <div className='mt-4 pt-4'>
            <h4>Xóa bản ghi?</h4>
            <p className='text-muted'>
              {' '}
              Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa bản
              ghi này?
            </p>

            <Button color='danger' onClick={handleDelete}>
              Xóa
            </Button>
          </div>
        </div>
      </Modal>

      <AddVbnComponent
        isOpen={openModal.isOpen}
        close={close}
        getList={getListVbn}
        updateRecord={openModal.updateRecord}
        isViewMode={openModal.viewMode}
      />
    </React.Fragment>
  );
};

export default VbnList;