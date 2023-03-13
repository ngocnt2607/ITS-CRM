import { Popover } from '@mui/material';
import { Form, Formik } from 'formik';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
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
import { ContractAPI } from '../../../api/contract.api';
import { NumberMemberAPI } from '../../../api/number-member.api';
import { PartnerDetailAPI } from '../../../api/partnerdetail.api';
import { generateOption, getListOption } from '../../../helpers/array.helper';
import addToast from '../../../Components/Common/add-toast.component';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import SearchComponent from '../../../Components/Common/search.component';
import ShowHideColumnComponent from '../../../Components/Common/show-hide-column.component';
import { Message } from '../../../shared/const/message.const';
import AddNumberMemberComponent from './components/add-numbermember.component';
import CustomSelectComponent from '../../../Components/Common/custom-select/custom-select.component';
import CustomInputComponent from '../../../Components/Common/custom-input.component';

const NumberMemberList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const recordId = useRef(null);
  const formRef = useRef();
  const [partners, setPartners] = useState([]);
  const [telcos, setTelcos] = useState([]);
  const [isdns, setIsdns] = useState([]);
  const [down, setDowns] = useState();
  const [openModal, setOpenModal] = useState({
    isOpen: false,
    updateRecord: null,
  });
  const searchValues = useRef(undefined);

  const TYPE_OPTION2 = useRef([
    { label: 'Chưa cấp', value: '0' },
    { label: 'Đã cấp', value: '1' },
    { label: 'Chặn lần 1', value: '2' },
    { label: 'Chặn lần 2', value: '3' },
    { label: 'Trả Telco', value: '4' },
  ]).current;

  const validationSchema = useRef(
    Yup.object({
      isdn: Yup.string().nullable(),
      partnerid: Yup.object().nullable(),
      telcoid: Yup.object().nullable(),
      recordStatus: Yup.object().nullable(),
    })
  ).current;
  const initialValues = useRef({
    isdn: null,
    partnerid: null,
    telcoid: null,
    recordStatus: null,
  }).current;

  const open = (updateRecord) => {
    setOpenModal({
      updateRecord,
      isOpen: true,
    });
  };

  const close = () => {
    setOpenModal({
      updateRecord: null,
      isOpen: false,
    });
  };

  const handleOpenDelete = (openDelete, row = null) => {
    if (openDelete) recordId.current = row.id;
    setOpenDelete(openDelete);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await NumberMemberAPI.deleteNumberMember(recordId.current);
      addToast({ message: Message.DELETE_SUCCESS, type: 'success' });
      await getListNumberMember();
      handleOpenDelete(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleMultipleDelete = async (ids) => {
    //TODO: Call api to delete multiple row
    try {
      setLoading(true);
      await NumberMemberAPI.deleteNumberMember(ids)
      addToast({ message: Message.DELETE_SUCCESS, type: 'success' });
      await getListNumberMember();
      console.log(ids);
    } catch (error) {
      setLoading(false)
    }
  };

  const getInitialData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await Promise.all([
        // NumberMemberAPI.getNumberMemberList(),
        PartnerDetailAPI.getPartner(),
        PartnerDetailAPI.getTelco(),
      ]);
      // setIsdns(getListOption(response[0].data, 'isdn', 'isdn'));
      setPartners(getListOption(response[0].data, 'nickname', 'id'));
      setTelcos(getListOption(response[1].data, 'name', 'id'));
      // listAllAccounts.current = response[2].data;
      // const mapData = convertData(response[0]?.data);
      setData(response[0].data);
      setSearchData(response[0].data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getInitialData();
  }, [getInitialData]);

  const getListNumberMember = useCallback(async () => {
    try {
      setLoading(true);
      const response = await NumberMemberAPI.getNumberMemberList();
      setData(response.data);
      setSearchData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListNumberMember();
  }, [getListNumberMember]);

  const [columnConfig, setColumnConfig] = useState([
    {
      field: 'telco',
      headerName: 'Nhà mạng',
      width: 250,
    },
    {
      field: 'isdn',
      headerName: 'Số thành viên',
      width: 250,
    },
    {
      field: 'cfu',
      headerName: 'CFU',
      hide: true,
      width: 250,
    },
    {
      field: 'numberowner',
      headerName: 'Số chủ',
      hide: true,
      width: 250,
    },
    {
      field: 'isdntype',
      headerName: 'Loại Thuê bao',
      hide: true,
      width: 250,
    },
    {
      field: 'brandname',
      headerName: 'Tên định danh',
      width: 250,
    },
    {
      field: 'nickname',
      headerName: 'Tên khách hàng',
      width: 250,
    },
    {
      field: 'vosip',
      headerName: 'Server VOS',
      width: 250,
    },
    {
      field: 'status',
      headerName: 'Trạng thái',
      width: 250,
    },
    {
      field: 'note',
      headerName: 'Ghi chú',
      width: 250,
    },
    {
      field: 'dateassignedtoleeon',
      headerName: 'Ngày đấu nối Leeon',
      width: 250,
    },
    {
      field: 'dateassignedtopartner',
      headerName: 'Ngày đấu nối khách hàng',
      width: 250,
    },
    {
      field: 'action',
      headerName: 'Thao tác',
      width: 200,
      sortable: false,
      renderCell: (cellValues) => (
        <>
          <Button
            color='success'
            size='small'
            onClick={() => open(cellValues.row)}
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

  const convertParams = (values) => ({
    isdn: values?.isdn || '',
    partnerid: values?.partnerid?.value || '',
    telcoid: values?.telcoid?.value || '',
    status: values?.recordStatus?.value || '',
  });

  const handleDownload = async () => {
    try {
      setLoading(true);
      const result = await NumberMemberAPI.downloadNumberMemer(
        convertParams(searchValues.current)
      );
      const url = window.URL.createObjectURL(result.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'number_member';
      link.click();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const params = convertParams(values);
      const response = await NumberMemberAPI.findNumberList(
        params.isdn,
        params.partnerid,
        params.telcoid,
        params.status,
      );
      searchValues.current = values;
      setData(response?.data || []);
      setSearchData(response?.data || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  document.title = 'List số thành viên';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='Số thành viên' pageTitle='Quản lý số' />
          <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            innerRef={formRef}
            onSubmit={handleSubmit}
          >
            <Form>
              <Row>
                <Col lg={2} md={6}>
                  <CustomInputComponent
                    // options={isdns}
                    name='isdn'
                    placeholder='Nhập số thuê bao'
                    // onChange={handleChangeNickname}
                  />
                </Col>

                <Col lg={2}>
                  <CustomSelectComponent
                    options={partners}
                    name='partnerid'
                    placeholder='Chọn đối tác'
                    // onChange={handleChangeNickname}
                  />
                </Col>

                <Col lg={2}>
                  <CustomSelectComponent
                    options={telcos}
                    name='telcoid'
                    placeholder='Chọn nhà mạng'
                  />
                </Col>

                <Col lg={2}>
                  <CustomSelectComponent
                    options={TYPE_OPTION2}
                    name='recordStatus'
                    placeholder='Chọn trạng thái'
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
                    Danh sách số thành viên
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

                          <Button
                            color='primary'
                            className='add-btn'
                            onClick={handleDownload}
                          >
                            Tải về
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

      <AddNumberMemberComponent
        isOpen={openModal.isOpen}
        close={close}
        getList={getListNumberMember}
        updateRecord={openModal.updateRecord}
      />
    </React.Fragment>
  );
};

export default NumberMemberList;
