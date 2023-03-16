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
import { ServiceConfigAPI } from '../../../api/service-config.api';
import addToast from '../../../Components/Common/add-toast.component';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import SearchComponent from '../../../Components/Common/search.component';
import { Message } from '../../../shared/const/message.const';
import AddServicePacketComponent from './components/add-servicepacket.component';

const ServicePacketList = () => {
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
      await ServiceConfigAPI.deleteServicePacket(recordId.current);
      addToast({ message: Message.DELETE_SUCCESS, type: 'success' });
      await getListServicePacket();
      handleOpenDelete(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getListServicePacket = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ServiceConfigAPI.getServicePacketList();
      setData(response.data);
      setSearchData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListServicePacket();
  }, [getListServicePacket]);

  const COLUMN_CONFIG = useRef([
    {
      field: 'createdAt',
      headerName: 'Thời gian tạo',
      width: 240,
    },
    {
      field: 'packetName',
      headerName: 'Tên gói',
      width: 300,
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 220,
    },
    {
      field: 'blockType',
      headerName: 'Block tính cước',
      width: 215,
    },
    {
      field: 'description',
      headerName: 'Mô tả',
      width: 300,
    },
    {
      field: 'action',
      headerName: 'Thao tác',
      width: 300,
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

  document.title = 'Quản lý gói';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='Danh sách gói' pageTitle='Quản lý gói' />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className='card-title mb-0 flex-grow-1'>Danh sách Gói</h4>
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

      <AddServicePacketComponent
        isOpen={openModal.isOpen}
        close={close}
        getList={getListServicePacket}
        updateRecord={openModal.updateRecord}
        isViewMode={openModal.viewMode}
      />
    </React.Fragment>
  );
};

export default ServicePacketList;