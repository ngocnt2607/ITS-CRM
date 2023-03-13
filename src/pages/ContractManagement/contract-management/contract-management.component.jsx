import { Popover } from '@mui/material';
import { useFormik } from 'formik';
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
import { ContractAPI } from '../../../api/contract.api';
import addToast from '../../../Components/Common/add-toast.component';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import SearchComponent from '../../../Components/Common/search.component';
import { Message } from '../../../shared/const/message.const';
import ShowHideColumnComponent from '../../../Components/Common/show-hide-column.component';
import AddContractComponent from './component/add-contract.component';

const ContractList = () => {
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
      await ContractAPI.deleteContract(recordId.current);
      addToast({ message: Message.DELETE_SUCCESS, type: 'success' });
      await getListContract();
      handleOpenDelete(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getListContract = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ContractAPI.getContractList();
      setData(response.data);
      setSearchData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListContract();
  }, [getListContract]);


  const openPreview = async (values) => {
    try {
      setLoading(true);
      const pdfFile = await ContractAPI.downloadPdfFile(values.file);
      const url = URL.createObjectURL(pdfFile.data);
      window.open(url, '_blank');
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const [columnConfig, setColumnConfig] = useState([
    {
      field: 'nickname',
      headerName: 'Tên khách hàng',
      width: 150,
    },
    {
      field: 'contractno',
      headerName: 'Hợp đồng số',
      width: 250,
    },
    {
      field: 'contractappendixno',
      headerName: 'Phụ lục số',
      width: 250,
    },
    {
      field: 'service',
      headerName: 'Loại DV',
      width: 150,
    },
    {
      field: 'type',
      headerName: 'Loại HĐ',
      width: 120,
    },
    {
      field: 'note',
      headerName: 'Ghi chú',
      width: 150,
    },
    {
      field: 'begintime',
      headerName: 'Ngày bắt đầu',
      width: 130,
    },
    {
      field: 'expiretime',
      headerName: 'Ngày hết hạn',
      width: 130,
    },
    {
      field: 'action',
      headerName: 'Thao tác',
      width: 250,
      sortable: false,
      renderCell: (cellValues) => (
        <>
          <Button
            color='primary'
            size='small'
            onClick={() => openPreview(cellValues.row)}
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
          color='danger'
          onClick={() => {
            handleOpenDelete(true, cellValues.row);}}
          style={{ marginLeft: 8 }}
        >
          Xóa
        </Button>
        </>
      ),
    },
  ])

  const onSearch = (search) => {
    setSearchData(search);
  };

  // const handleDownload = async () => {
  //   try {
  //     setLoading(true);
  //     const result = await VbnAPI.downloadVbn();
  //     const url = window.URL.createObjectURL(result.data);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = 'brand_name';
  //     link.click();
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //   }
  // };

  document.title = 'Quản lý hợp đồng';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='Danh sách hợp đồng' pageTitle='Quản lý hợp đồng' />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className='card-title mb-0 flex-grow-1'>Danh sách hợp đồng</h4>
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

                          {/* <Button
                            color='primary'
                            className='add-btn'
                            onClick={handleDownload}
                          >
                            Download
                          </Button> */}
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

      <AddContractComponent
        isOpen={openModal.isOpen}
        close={close}
        getList={getListContract}
        getList1={getListContract}
        updateRecord={openModal.updateRecord}
        isViewMode={openModal.viewMode}
        updateRecord1={openModal.updateRecord}
        isViewMode1={openModal.viewMode}
      />
    </React.Fragment>
  );
};

export default ContractList;
