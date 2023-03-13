import { useFormik } from 'formik';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalHeader,
  Row,
} from 'reactstrap';
import * as Yup from 'yup';
import { AccountAPI } from '../../../api/account.api';
import addToast from '../../../Components/Common/add-toast.component';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import SearchComponent from '../../../Components/Common/search.component';
import { Message } from '../../../shared/const/message.const';


const AccountList = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [openModal, setOpenModal] = useState({
    isOpen: false,
    updateRecord: null,
  });
  const [openDelete, setOpenDelete] = useState(false);
  const recordId = useRef(null);
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      ip: '',
      name: '',
      type: '',
    },
    validationSchema: Yup.object({
      ip: Yup.string().required('Please Enter Ip'),
      name: Yup.string().required('Please Enter Name'),
      type: Yup.string().required('Please Enter Type'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);

        if (openModal.updateRecord) {
          await AccountAPI.updateAccount({
            ...values,
            id: openModal.updateRecord,
          });
        } else {
          await AccountAPI.createNewAccount(values);
        }
        addToast({
          message: openModal.updateRecord
            ? Message.UPDATE_SUCCESS
            : Message.CREATE_SUCCESS,
          type: 'success',
        });
        await getListAccount();
        close();
      } catch (error) {
        setLoading(false);
      }
    },
  });

  const handleOpenDelete = (openDelete, row = null) => {
    if (openDelete) recordId.current = row.id;
    setOpenDelete(openDelete);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await AccountAPI.deleteAccount(recordId.current);
      addToast({ message: Message.DELETE_SUCCESS, type: 'success' });
      await getListAccount();
      handleOpenDelete(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getListAccount = useCallback(async () => {
    try {
      setLoading(true);
      const response = await AccountAPI.getAccountList();
      setData(response.data);
      setSearchData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListAccount();
  }, [getListAccount]);

  const close = () => {
    validation.resetForm();
    setOpenModal({
      updateRecord: false,
      isOpen: false,
    });
  };

  const open = (updateRecord, row = null) => {
    if (updateRecord) {
      validation.setValues({
        ip: row.ip || '',
        name: row.name || '',
        type: row.type || '',
      });
    }

    setOpenModal({
      updateRecord,
      isOpen: true,
    });
  };

  const COLUMN_CONFIG = useRef([
    {
      field: 'createdtime',
      headerName: 'Thời gian',
      flex: 0.75,
    },
    {
      field: 'ip',
      headerName: 'Ip VOS',
      flex: 0.75,
    },
    {
      field: 'name',
      headerName: 'Tài khoản',
      flex: 0.75,
    },
    {
      field: 'type',
      headerName: 'Loại tài khoản',
      flex: 0.75,
    },
    {
      field: 'action',
      headerName: 'Thao tác',
      flex: 0.39,
      sortable: false,
      renderCell: (cellValues) => (
        <>
          <Button
            color='success'
            size='small' 
            onClick={() => open(cellValues.row.id, cellValues.row)}
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


  document.title = 'Account List';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='Account' pageTitle='Partner Management' />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className='card-title mb-0 flex-grow-1'>
                    Danh sách Account
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
        isOpen={openModal.isOpen}
        onClosed={close}
        modalClassName='flip'
        centered
      >
        <ModalHeader>
          {openModal.isUpdate ? 'Update Account' : 'Create New Account'}
          <Button
            type='button'
            onClick={close}
            className='btn-close'
            aria-label='Close'
          ></Button>
        </ModalHeader>

        <div className='modal-body'>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              validation.handleSubmit();
              return false;
            }}
            action='#'
          >
            <div className='mb-3'>
              <Label htmlFor='ip' className='form-label'>
                Ip
              </Label>
              <Input
                name='ip'
                className='form-control'
                placeholder='Enter Ip'
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.ip || ''}
                invalid={
                  validation.touched.ip && validation.errors.ip
                    ? true
                    : false
                }
              />
              {validation.touched.ip && validation.errors.ip ? (
                <FormFeedback type='invalid'>
                  {validation.errors.ip}
                </FormFeedback>
              ) : null}
            </div>

            <div className='mb-3'>
              <Label htmlFor='name' className='form-label'>
                Name
              </Label>
              <Input
                name='name'
                className='form-control'
                placeholder='Enter Name'
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.name || ''}
                invalid={
                  validation.touched.name && validation.errors.name
                    ? true
                    : false
                }
              />
              {validation.touched.name && validation.errors.name ? (
                <FormFeedback type='invalid'>
                  {validation.errors.name}
                </FormFeedback>
              ) : null}
            </div>

            <div className='mb-3'>
              <Label htmlFor='type' className='form-label'>
                Type
              </Label>
              <Input
                name='type'
                className='form-control'
                placeholder='Enter Type'
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.type || ''}
                invalid={
                  validation.touched.type && validation.errors.type
                    ? true
                    : false
                }
              />
              {validation.touched.type && validation.errors.type ? (
                <FormFeedback type='invalid'>
                  {validation.errors.type}
                </FormFeedback>
              ) : null}
            </div>
            <div className='hstack gap-2 justify-content-end'>
              <Button color='light' onClick={close}>
                Close
              </Button>
              <Button color='primary' type='submit'>
                Submit
              </Button>
            </div>
          </Form>
        </div>
      </Modal>

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

export default AccountList;
