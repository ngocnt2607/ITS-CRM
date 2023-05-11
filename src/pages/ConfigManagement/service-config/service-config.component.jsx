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
import { PartnerAPI } from '../../../api/customer-management.api';
import addToast from '../../../Components/Common/add-toast.component';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import SearchComponent from '../../../Components/Common/search.component';
import { Message } from '../../../shared/const/message.const';
import ShowHideColumnComponent from '../../../Components/Common/show-hide-column.component';
import AddServiceConfigComponent from './components/add-serviceconfig.component';
import { generateOption, getListOption } from '../../../helpers/array.helper';
import { useLocation } from 'react-router-dom';

const ServiceConfigList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const formRef = useRef();
  const [searchData, setSearchData] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const recordId = useRef(null);
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const initialNickname = searchParams.get('nickname');
  const [openModal, setOpenModal] = useState({
    isOpen: false,
    viewMode: false,
    updateRecord: null,
  });
  const [listData, setListData] = useState({
    nicknames: [],
    callTypes: [],
    isBrands: [],
    packetNames: [],
  });

  const TYPE_OPTION = useRef([
    { label: 'Sip Trunk', value: 'Sip Trunk' },
    { label: 'Brand', value: 'Brand' },
  ]).current;

  const validationSchema = useRef(
    Yup.object({
      nickname: Yup.object().nullable(),
      callType: Yup.object().nullable(),
      isBrand: Yup.object().nullable(),
      packetName: Yup.object().nullable(),
    })
  ).current;
  const initialValues = useRef({
    nickname: initialNickname
      ? { label: initialNickname, value: initialNickname }
      : '',
    callType: '',
    isBrand: '',
    packetName: '',
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
      const response = await (initialNickname
        ? ServiceConfigAPI.findServiceConfigList(initialNickname)
        : ServiceConfigAPI.getServiceConfigList());
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

  const getListData = useCallback(async () => {
    const listAPI = [
      PartnerAPI.getListPartner,
      ServiceConfigAPI.getServicePacketList,
      ServiceConfigAPI.getServiceTypeList,
    ];
    try {
      setLoading(true);
      const response = await Promise.all(listAPI.map((api) => api()));
      setListData((prev) => ({
        ...prev,
        nicknames: getListOption(response[0]?.data, 'nickname', 'nickname'),
        packetNames: getListOption(
          response[1]?.data,
          'packetName',
          'packetName'
        ),
        callTypes: getListOption(response[2]?.data, 'callType', 'callType'),
      }));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListData();
  }, [getListData]);

  const [columnConfig, setColumnConfig] = useState([
    {
      field: 'createAt',
      headerName: 'Thời gian',
      flex: 0.95,
      minWidth: 150,
    },
    {
      field: 'nickname',
      headerName: 'Đối tác',
      flex: 0.5,
      minWidth: 100,
    },
    {
      field: 'packetName',
      headerName: 'Gói cước',
      flex: 0.7,
      minWidth: 150,
    },
    {
      field: 'callType',
      headerName: 'Loại cuộc gọi',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'price',
      headerName: 'Giá tiền',
      flex: 0.5,
      minWidth: 100,
    },
    {
      field: 'startDuration',
      headerName: 'Phút thoại bắt đầu',
      flex: 0.7,
      minWidth: 150,
    },
    {
      field: 'endDuration',
      headerName: 'Phút thoại kết thúc',
      flex: 0.8,
      minWidth: 180,
    },
    {
      field: 'isBrand',
      headerName: 'Loại dịch vụ',
      flex: 0.7,
      minWidth: 120,
    },
    {
      field: 'action',
      headerName: 'Thao tác',
      flex: 1,
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
  ]);

  const onSearch = (search) => {
    setSearchData(search);
  };

  // const getListData = useCallback(async () => {
  //   const listAPI = [PartnerDetailAPI.getPartner];
  //   try {
  //     setLoading(true);
  //     const response = await Promise.all(listAPI.map((api) => api()));
  //     setListData((prev) => ({
  //       ...prev,
  //       nicknames: getListOption(response[0]?.data, 'nickname', 'nickname'),
  //     }));
  //     setLoading(false);
  //   } catch (error) {
  //     setLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   getListData();
  // }, [getListData]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const { nickname, packetName, callType, isBrand } = values;
      const response = await ServiceConfigAPI.findServiceConfigList(
        nickname?.value || '',
        packetName?.value || '',
        callType?.value || '',
        isBrand?.value || ''
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
                <Col lg={2}>
                  <CustomSelectComponent
                    name='nickname'
                    options={listData.nicknames}
                    placeholder='Đối tác'
                  />
                </Col>

                <Col lg={2}>
                  <CustomSelectComponent
                    name='packetName'
                    options={listData.packetNames}
                    placeholder='Gói cước'
                  />
                </Col>

                <Col lg={2}>
                  <CustomSelectComponent
                    name='callType'
                    options={listData.callTypes}
                    placeholder='Loại cuộc gọi'
                  />
                </Col>

                <Col lg={2}>
                  <CustomSelectComponent
                    name='isBrand'
                    options={TYPE_OPTION}
                    placeholder='Loại dịch vụ'
                  />
                </Col>

                <Col lg={2}>
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
