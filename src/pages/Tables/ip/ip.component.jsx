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
import { IpAPI } from '../../../api/ip.api';
import addToast from '../../../Components/Common/add-toast.component';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import SearchComponent from '../../../Components/Common/search.component';
import { Message } from '../../../shared/const/message.const';

const IpList = () => {
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
      port: '',
      nickname: '',
      priority: '',
    },
    validationSchema: Yup.object({
      ip: Yup.string().required('Please Enter Ip'),
      port: Yup.string().required('Please Enter Port'),
      nickname: Yup.string().required('Please Enter Nick name'),
      priority: Yup.string().required('Please Enter Priority'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);

        if (openModal.updateRecord) {
          await IpAPI.updateIp({
            ...values,
            id: openModal.updateRecord,
          });
        } else {
          await IpAPI.createNewIp(values);
        }
        addToast({
          message: openModal.updateRecord
            ? Message.UPDATE_SUCCESS
            : Message.CREATE_SUCCESS,
          type: 'success',
        });
        await getListIp();
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
      await IpAPI.deleteIp(recordId.current);
      addToast({ message: Message.DELETE_SUCCESS, type: 'success' });
      await getListIp();
      handleOpenDelete(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getListIp = useCallback(async () => {
    try {
      setLoading(true);
      const response = await IpAPI.getIpList();
      setData(response.data);
      setSearchData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListIp();
  }, [getListIp]);

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
        port: row.port || '',
        nickname: row.nickname || '',
        priority: row.priority || '',
      });
    }

    setOpenModal({
      updateRecord,
      isOpen: true,
    });
  };

  const COLUMN_CONFIG = useRef([
    {
      field: 'ip',
      headerName: 'Ip',
      flex: 0.75,
    },
    {
      field: 'port',
      headerName: 'Port',
      flex: 0.75,
    },
    {
      field: 'nickname',
      headerName: 'Name',
      flex: 0.75,
    },
    {
      field: 'priority',
      headerName: 'Priority',
      flex: 0.75,
    },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0.39,
      sortable: false,
      renderCell: (cellValues) => (
        <>
          <Button
            color='success'
            size='small' 
            onClick={() => open(cellValues.row.id, cellValues.row)}
          >
            Edit
          </Button>
          <Button
            style={{ marginLeft: 8 }}
            color='danger'
            onClick={() => {
              handleOpenDelete(true, cellValues.row);
            }}
          >
            Remove
          </Button>
        </>
      ),
    },
  ]).current;

  const onSearch = (search) => {
    setSearchData(search);
  };

  document.title = 'Ip List';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='Ip' pageTitle='Tables' />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className='card-title mb-0 flex-grow-1'>
                    Danh sách Ip khách hàng
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
                            Add
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
          {openModal.isUpdate ? 'Update Ip Customer' : 'Create New Ip Customer'}
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
              <Label htmlFor='port' className='form-label'>
                Port
              </Label>
              <Input
                name='port'
                className='form-control'
                placeholder='Enter Port'
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.port || ''}
                invalid={
                  validation.touched.port && validation.errors.port
                    ? true
                    : false
                }
              />
              {validation.touched.port && validation.errors.port ? (
                <FormFeedback type='invalid'>
                  {validation.errors.port}
                </FormFeedback>
              ) : null}
            </div>

            <div className='mb-3'>
              <Label htmlFor='nickname' className='form-label'>
                Name
              </Label>
              <Input
                name='nickname'
                className='form-control'
                placeholder='Enter Name'
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.nickname || ''}
                invalid={
                  validation.touched.nickname && validation.errors.nickname
                    ? true
                    : false
                }
              />
              {validation.touched.nickname && validation.errors.nickname ? (
                <FormFeedback type='invalid'>
                  {validation.errors.nickname}
                </FormFeedback>
              ) : null}
            </div>

            <div className='mb-3'>
              <Label htmlFor='priority' className='form-label'>
                Priority
              </Label>
              <Input
                name='priority'
                className='form-control'
                placeholder='Enter Priority'
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.priority || ''}
                invalid={
                  validation.touched.priority && validation.errors.priority
                    ? true
                    : false
                }
              />
              {validation.touched.priority && validation.errors.priority ? (
                <FormFeedback type='invalid'>
                  {validation.errors.priority}
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

export default IpList;
