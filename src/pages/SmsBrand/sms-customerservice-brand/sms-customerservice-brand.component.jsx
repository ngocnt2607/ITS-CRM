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
import { SmsBrandAPI } from '../../../api/sms-brand.api';
import addToast from '../../../Components/Common/add-toast.component';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import SearchComponent from '../../../Components/Common/search.component';
import { Message } from '../../../shared/const/message.const';
import AddCustomerServiceBrandComponent from './components/add-customerservice-brand.component';
import ShowHideColumnComponent from '../../../Components/Common/show-hide-column.component';

const SmsCustomerServiceBrandList = () => {
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
      await SmsBrandAPI.deleteSmsBrand(recordId.current);
      addToast({ message: Message.DELETE_SUCCESS, type: 'success' });
      await getListSmsCustomerServiceBrand();
      handleOpenDelete(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const convertData = (data) => {
    return (
      data?.map((item) => {
        const nf = new Intl.NumberFormat('en-US');
        return {
          ...item,
          price: nf.format(item?.['price']),
        };
      }) || []
    );
  };

  const getListSmsCustomerServiceBrand = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Promise.all([
        SmsBrandAPI.getSmsBrandCustomerServiceList()
      ]);
      const mapData = convertData(response[0]?.data || []);
      console.log(mapData)
      setData(mapData);
      setSearchData(mapData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListSmsCustomerServiceBrand();
  }, [getListSmsCustomerServiceBrand]);

  const [columnConfig, setColumnConfig] = useState([
    {
      field: 'customer_code',
      headerName: 'Customer Code',
      width: 270,
    },
    {
      field: 'brand',
      headerName: 'Brand',
      width: 270,
    },
    {
      field: 'service_type',
      headerName: 'Dịch vụ',
      width: 270,
    },
    {
      field: 'brand_type',
      headerName: 'Loại Brand',
      width: 270,
    },
    {
      field: 'price',
      headerName: 'Đơn giá/1 tin',
      width: 270,
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 270,
    },
    {
      field: 'action',
      headerName: 'Thao tác',
      width: 270,
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
          {/* <Button
            style={{ marginLeft: 8 }}
            color='danger'
            onClick={() => {
              handleOpenDelete(true, cellValues.row);
            }}
          >
            Xóa
          </Button> */}
        </>
      ),
    },
  ]);

  const onSearch = (search) => {
    setSearchData(search);
  };

  document.title = 'Quản lý danh sách SMS Adv';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb
            title='Danh sách Customer Service'
            pageTitle='Quản lý SMS Brand'
          />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className='card-title mb-0 flex-grow-1'>
                  Danh sách Customer Service
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
                            onClick={() => open(false)}
                            id='create-btn'
                          >
                            <i className='ri-add-line align-bottom me-1'></i>{' '}
                            Thêm mới
                          </Button>

                        </div>
                      </Col>
                      <Col className='col-sm d-flex gap-2 justify-content-end'>
                        <SearchComponent data={data} onSearch={onSearch} />
                        <ShowHideColumnComponent
                          columns={columnConfig}
                          setColumns={setColumnConfig}
                        />
                      </Col>
                    </Row>

                    <DataGridComponent
                      isBreakText
                      columns={columnConfig}
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

      <AddCustomerServiceBrandComponent
        isOpen={openModal.isOpen}
        close={close}
        getList={getListSmsCustomerServiceBrand}
        updateRecord={openModal.updateRecord}
        isViewMode={openModal.viewMode}
      />
    </React.Fragment>
  );
};

export default SmsCustomerServiceBrandList;
