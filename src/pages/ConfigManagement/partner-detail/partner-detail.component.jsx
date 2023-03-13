import { Form, Formik } from 'formik';
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useLayoutEffect,
} from 'react';
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
import { PartnerDetailAPI } from '../../../api/partnerdetail.api';
import { ReportAPI } from '../../../api/report.api';
import { PartnerAPI } from '../../../api/customer-management.api';
import addToast from '../../../Components/Common/add-toast.component';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import SearchComponent from '../../../Components/Common/search.component';
import { Message } from '../../../shared/const/message.const';
import AddPartnerDetailComponent from './components/add-partner-detail/add-partner-detail.component';
import ShowHideColumnComponent from '../../../Components/Common/show-hide-column.component';
import { generateOption, getListOption } from '../../../helpers/array.helper';
import CustomSelectComponent from '../../../Components/Common/custom-select/custom-select.component';

const PartnerDetailList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [selectedIP, setSelectedIP] = useState('');
  const [selectedPartner, setSelectedPartner] = useState('');
  const [openModal, setOpenModal] = useState({
    isOpen: false,
    updateRecord: null,
  });
  const [listData, setListData] = useState({
    ips: [],
    partners: [],
  });
  const validationSchema = useRef(
    Yup.object({
      partner: Yup.object().nullable(),
      account: Yup.object().nullable(),
      ip: Yup.object().nullable(),
    })
  ).current;
  const [listAccount, setListAccount] = useState({
    accounts: [],
  });
  const [listIp, setListIp] = useState([]);
  const formRef = useRef();
  const [openDelete, setOpenDelete] = useState(false);
  const recordId = useRef(null);
  // const validation = useFormik({
  //   // enableReinitialize : use this flag when initial values needs to be changed
  //   enableReinitialize: true,

  //   initialValues: {
  //     ip: {},
  //     telco: '',
  //     partner: '',
  //     account: '',
  //     mapping: '',
  //     routing: '',
  //     type: '',
  //   },
  //   validationSchema: Yup.object({
  //     ip: Yup.object().required('Please Enter Vos Ip'),
  //     telco: Yup.string(),
  //     partner: Yup.string().required('Please Enter Partner'),
  //     account: Yup.string().required('Please Enter Account'),
  //     mapping: Yup.string().required('Please Enter Mapping'),
  //     routing: Yup.string().required('Please Enter Routing'),
  //     type: Yup.string(),
  //   }),
  //   onSubmit: async (values) => {
  //     try {
  //       setLoading(true);

  //       if (openModal.updateRecord) {
  //         await PartnerDetailAPI.updatePartnerDetail({
  //           ...values,
  //           id: openModal.updateRecord,
  //         });
  //       } else {
  //         await PartnerDetailAPI.createNewPartnerDetail(values);
  //       }
  //       addToast({
  //         message: openModal.updateRecord
  //           ? Message.UPDATE_SUCCESS
  //           : Message.CREATE_SUCCESS,
  //         type: 'success',
  //       });
  //       await getPartnerDetailList();
  //       close();
  //     } catch (error) {
  //       setLoading(false);
  //     }
  //   },
  // });

  const initialValues = useRef({
    partner: null,
    ip: null,
    account: null,
  }).current;

  const handleOpenDelete = (openDelete, row = null) => {
    if (openDelete) recordId.current = row.id;
    setOpenDelete(openDelete);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await PartnerDetailAPI.deletePartnerDetail(recordId.current);
      addToast({ message: Message.DELETE_SUCCESS, type: 'success' });
      await getPartnerDetailList();
      handleOpenDelete(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleMultipleDelete = async (ids) => {
    //TODO: Call api to delete multiple row
    try {
      setLoading(true);
      await PartnerDetailAPI.deletePartnerDetail(ids)
      addToast({ message: Message.DELETE_SUCCESS, type: 'success' });
      await getPartnerDetailList();
      console.log(ids);
    } catch (error) {
      setLoading(false)
    }
  };

  const getPartnerDetailList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await PartnerDetailAPI.getListPartnerDetail();
      setData(response.data);
      setSearchData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getPartnerDetailList();
  }, [getPartnerDetailList]);

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

  const getListData = useCallback(async () => {
    const listAPI = [PartnerDetailAPI.getListIP, PartnerAPI.getListPartner];
    try {
      setLoading(true);
      const response = await Promise.all(listAPI.map((api) => api()));
      setListData((prev) => ({
        ...prev,
        ips: getListOption(response[0]?.data, 'name', 'name'),
        partners: getListOption(response[1]?.data, 'nickname', 'nickname'),
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
      const listAPI = [ReportAPI.getVosIp];
      try {
        setLoading(true);
        const response = await Promise.all(
          listAPI.map((api) => api(selectedPartner))
        );
        setListIp(getListOption(response[0]?.data, 'name', 'name'));
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    if (formRef.current) {
      formRef.current.setFieldValue('ip', null);
    }
    if (selectedPartner) {
      handleCallAPI();
    } else {
      setListIp([]);
    }
  }, [selectedPartner]);

  useLayoutEffect(() => {
    const handleCallAPI = async () => {
      const listAPI1 = [ReportAPI.getAccountReport];
      try {
        setLoading(true);
        const response = await Promise.all(
          listAPI1.map((api) => api(selectedPartner, selectedIP))
        );
        setListAccount({
          accounts: getListOption(response[0]?.data, 'name', 'name'),
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    if (formRef.current) {
      formRef.current.setFieldValue('account', null);
    }
    if (selectedPartner && selectedIP) {
      handleCallAPI();
    } else {
      setListAccount({ accounts: [] });
    }
  }, [selectedPartner, selectedIP]);

  const handleChangeSelectedPartner = (value) => {
    setSelectedPartner(value);
  };

  const handleChangeSelectedIP = (value) => {
    setSelectedIP(value);
  };

  const [columnConfig, setColumnConfig] = useState([
    {
      field: 'createdtime',
      headerName: 'Thời gian',
      hide: true,
      flex: 1,
    },
    {
      field: 'name',
      headerName: 'VOS',
      flex: 1,
    },
    {
      field: 'telco',
      headerName: 'Nhà mạng',
      flex: 0.75,
    },
    {
      field: 'partner',
      headerName: 'Đối tác',
      flex: 0.75,
    },
    {
      field: 'account',
      headerName: 'Tài khoản',
      flex: 1,
    },
    {
      field: 'mapping',
      headerName: 'Mapping gateway',
      flex: 1,
    },
    {
      field: 'routing',
      headerName: 'Routing gateway',
      flex: 1,
    },
    {
      field: 'type',
      headerName: 'Kiểu gọi',
      flex: 0.5,
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

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const { partner, ip, account } = values;
      const response = await PartnerDetailAPI.findPartnerDetailList(
        partner?.value || '',
        ip?.value || '',
        account?.value || ''
      );
      setData(response.data);
      setSearchData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  document.title = 'Partner Detail List';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='Partner Detail' pageTitle='Partner Management' />
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
                    options={listData.partners}
                    name='partner'
                    placeholder='Chọn đối tác'
                    onChange={handleChangeSelectedPartner}
                  />
                </Col>

                <Col lg={3}>
                  <CustomSelectComponent
                    options={listIp}
                    name='ip'
                    placeholder='Chọn Server VOS'
                    onChange={handleChangeSelectedIP}
                  />
                </Col>

                <Col lg={3}>
                  <CustomSelectComponent
                    options={listAccount.accounts}
                    name='account'
                    placeholder='Chọn tài khoản'
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
                    Danh sách chi tiết Partner
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
                      <Col className='col-sm d-flex gap-2 justify-content-end'>
                        <SearchComponent data={data} onSearch={onSearch} />
                        <ShowHideColumnComponent
                          columns={columnConfig}
                          setColumns={setColumnConfig}
                        />
                      </Col>
                    </Row>

                    <DataGridComponent
                      columns={columnConfig}
                      rows={searchData}
                      onMultipleDelete={handleMultipleDelete}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <AddPartnerDetailComponent
        isOpen={openModal.isOpen}
        close={close}
        updateRecord={openModal.updateRecord}
        refreshListData={getPartnerDetailList}
        isViewMode={openModal.viewMode}
      />

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
    </React.Fragment>
  );
};

export default PartnerDetailList;
