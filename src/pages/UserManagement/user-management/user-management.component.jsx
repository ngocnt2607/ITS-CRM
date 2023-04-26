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
import { UserListAPI } from '../../../api/user-list.api';
import addToast from '../../../Components/Common/add-toast.component';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import SearchComponent from '../../../Components/Common/search.component';
import { Message } from '../../../shared/const/message.const';
import AddUserComponent from './components/add-user.component';

const UserList  = () => {
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
      await UserListAPI.deleteUser(recordId.current);
      addToast({ message: Message.DELETE_SUCCESS, type: 'success' });
      await getListUser ();
      handleOpenDelete(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getListUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await UserListAPI.getUserList();
      setData(response.data);
      setSearchData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListUser();
  }, [getListUser]);

  const COLUMN_CONFIG = useRef([
    {
      field: 'username',
      headerName: 'Tên đăng nhập',
      flex: 0.75,
      minWidth: 140,
    },
    {
      field: 'fullname',
      headerName: 'Họ và tên',
      flex: 0.75,
      minWidth: 150,
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 0.75,
      minWidth: 160,
    },
    {
      field: 'phonenumber',
      headerName: 'Số điện thoại',
      flex: 0.7,
      minWidth: 120,
    },
    {
      field: 'group',
      headerName: 'Quyền',
      flex: 0.75,
      minWidth: 190,
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      flex: 0.7,
      minWidth: 120,
    },
    {
      field: 'action',
      headerName: 'Thao tác',
      flex: 0.71,
      minWidth: 200,
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

  document.title = 'Danh sách người dùng';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='Danh sách người dùng' pageTitle='Quản lý người dùng' />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className='card-title mb-0 flex-grow-1'>
                    Danh sách người dùng
                  </h4>
                </CardHeader>

                <CardBody>
                  <div id='table-gridjs'>
                    <Row className='g-4 mb-3'>
                      <Col className='col-sm-auto'>
                        <div className='d-flex gap-1'>
                          <Button
                            color='success'
                            className='add-btn'
                            onClick={() => open(null)}
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

      <AddUserComponent
        isOpen={openModal.isOpen}
        close={close}
        getList={getListUser}
        getList1={getListUser}
        updateRecord={openModal.updateRecord}
        updateRecord1={openModal.updateRecord}
        isViewMode={openModal.viewMode}
        isViewMode1={openModal.viewMode}
      />
    </React.Fragment>
  );
};

export default UserList;
