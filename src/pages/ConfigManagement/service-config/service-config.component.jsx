import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Form, Formik } from 'formik';
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
import * as Yup from 'yup';
import CustomSelectComponent from '../../../Components/Common/custom-select/custom-select.component';
import { ServiceConfigAPI } from '../../../api/service-config.api';
import CalendarComponent from '../../../Components/Common/calendar/calendar.component';
import { PartnerDetailAPI } from '../../../api/partnerdetail.api';
import addToast from '../../../Components/Common/add-toast.component';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import SearchComponent from '../../../Components/Common/search.component';
import { Message } from '../../../shared/const/message.const';
import ShowHideColumnComponent from '../../../Components/Common/show-hide-column.component';
import AddServiceConfigComponent from './components/add-serviceconfig.component';
import { generateOption, getListOption } from '../../../helpers/array.helper';

const ServiceConfigList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const formRef = useRef();
  const [searchData, setSearchData] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const recordId = useRef(null);
  const [openModal, setOpenModal] = useState({
    isOpen: false,
    viewMode: false,
    updateRecord: null,
  });
  const [listData, setListData] = useState({
    nicknames: [],
  });
  const validationSchema = useRef(
    Yup.object({
      date: Yup.object({
        startDate: Yup.string().required('Please pick Date'),
        endDate: Yup.string().required('Please pick Date'),
      }),
      nickname : Yup.object().nullable(),
      
    })
  ).current;
  const initialValues = useRef({
    date: { startDate: '', endDate: '' },
    customer_code: '',
  }).current;

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
      await ServiceConfigAPI.deleteServiceConfig(recordId.current);
      addToast({ message: Message.DELETE_SUCCESS, type: 'success' });
      await getListServiceConfig();
      handleOpenDelete(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getListServiceConfig = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ServiceConfigAPI.getServiceConfigList();
      setData(response.data);
      setSearchData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListServiceConfig();
  }, [getListServiceConfig]);


  const [columnConfig, setColumnConfig] = useState([
    {
      field: 'createAt',
      headerName: 'Thời gian',
      width: 200,
    },
    {
      field: 'nickname',
      headerName: 'Đối tác',
      width: 150,
    },
    {
      field: 'packetName',
      headerName: 'Gói cước',
      width: 150,
    },
    {
      field: 'callType',
      headerName: 'Loại cuộc gọi',
      width: 250,
    },
    {
      field: 'price',
      headerName: 'Giá tiền',
      width: 120,
    },
    {
      field: 'startDuration',
      headerName: 'Phút thoại bắt đầu',
      width: 150,  
    },
    {
      field: 'endDuration',
      headerName: 'Phút thoại kết thúc',
      width: 180,     
    },
    {
      field: 'isBrand',
      headerName: 'Loại dịch vụ',
      width: 150,  
    },
    {
      field: 'action',
      headerName: 'Thao tác',
      width: 250,
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
  ])

  const onSearch = (search) => {
    setSearchData(search);
  };

  const getListData = useCallback(async () => {
    const listAPI = [PartnerDetailAPI.getPartner];
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

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const { date, nickname } = values;
      const response = await ServiceConfigAPI.findServiceConfigList(
        date.startDate,
        date.endDate,
        nickname?.value || '',
      );
      setData(response.data);
      setSearchData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };


  document.title = 'Service Config';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='Service Config' pageTitle='Quản lý Config' />

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
                    name='nickname'
                    options={listData.nicknames}
                    placeholder='Vui lòng chọn đối tác'
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
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className='card-title mb-0 flex-grow-1'>
                    Danh sách Service Config
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

      <AddServiceConfigComponent
        isOpen={openModal.isOpen}
        close={close}
        getList={getListServiceConfig}
        updateRecord={openModal.updateRecord}
        isViewMode={openModal.viewMode}
      />
    </React.Fragment>
  );
};

export default ServiceConfigList;
