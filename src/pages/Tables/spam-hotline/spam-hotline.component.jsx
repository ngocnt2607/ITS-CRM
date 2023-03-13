import React, { useCallback, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Form,
  FormFeedback,
  Input,
  Label,
  Modal,
  ModalHeader,
} from 'reactstrap';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import { SpamHotlineAPI } from '../../../api/spam-hotline.api';
import { useEffect } from 'react';
import LoadingComponent from '../../../Components/Common/loading.component';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import addToast from '../../../Components/Common/add-toast.component';
import { Message } from '../../../shared/const/message.const';
import { useRef } from 'react';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import SearchComponent from '../../../Components/Common/search.component';

const SpamHotline = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [isOpen, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const recordId = useRef(null);
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      name: '',
      hotline: '',
      description: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Please Enter Name'),
      hotline: Yup.string()
        .max(10, 'Hotline smaller 10 characters')
        .required('Please Enter Hotline'),
      description: Yup.string().required('Please Enter Description'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        await SpamHotlineAPI.createSpamHotline(
          values.name,
          values.hotline,
          values.description
        );
        addToast({ message: Message.CREATE_SUCCESS, type: 'success' });
        await getSpamHotline();
        close();
      } catch (error) {
        setLoading(false);
      }
    },
  });

  const COLUMN_CONFIG = useRef([
    {
      field: 'id',
      headerName: 'Id',
      flex: 0.15,
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
    },
    {
      field: 'hotline',
      headerName: 'Hotline',
      flex: 1,
    },
    { field: 'note', headerName: 'Note', flex: 1 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 0.15,
      sortable: false,
      renderCell: (cellValues) => (
        <Button
          color='soft-danger'
          onClick={() => {
            handleOpenDelete(true, cellValues.row);
          }}
        >
          <i className='ri-delete-bin-2-line'></i>
        </Button>
      ),
    },
  ]).current;

  const close = () => {
    validation.resetForm();
    setOpen(false);
  };

  const open = () => {
    setOpen(true);
  };

  const handleOpenDelete = (openDelete, row = null) => {
    if (openDelete) recordId.current = row.id;
    setOpenDelete(openDelete);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await SpamHotlineAPI.deleteSpamHotline(recordId.current);
      addToast({ message: Message.DELETE_SUCCESS, type: 'success' });
      await getSpamHotline();
      handleOpenDelete(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getSpamHotline = useCallback(async () => {
    try {
      setLoading(true);
      const response = await SpamHotlineAPI.getSpamHotlineList();
      setData(response.hotline);
      setSearchData(response.hotline);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getSpamHotline();
  }, [getSpamHotline]);

  const onSearch = (search) => {
    setSearchData(search);
  };

  document.title = 'Spam Hotline List';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />

      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='Spam Hotline' pageTitle='Tables' />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className='card-title mb-0 flex-grow-1'>
                    Danh sách spam hotline
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
                            onClick={open}
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
                      rows={searchData}
                      columns={COLUMN_CONFIG}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Modal isOpen={isOpen} onClosed={close} modalClassName='flip' centered>
        <ModalHeader>
          Add Spam Hotline
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
              <Label htmlFor='hotline' className='form-label'>
                Hotline
              </Label>
              <Input
                name='hotline'
                className='form-control'
                placeholder='Enter Hotline'
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.hotline || ''}
                invalid={
                  validation.touched.hotline && validation.errors.hotline
                    ? true
                    : false
                }
              />
              {validation.touched.hotline && validation.errors.hotline ? (
                <FormFeedback type='invalid'>
                  {validation.errors.hotline}
                </FormFeedback>
              ) : null}
            </div>

            <div className='mb-3'>
              <Label htmlFor='description' className='form-label'>
                Description
              </Label>
              <Input
                name='description'
                className='form-control'
                placeholder='Enter Description'
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.description || ''}
                invalid={
                  validation.touched.description &&
                  validation.errors.description
                    ? true
                    : false
                }
              />
              {validation.touched.description &&
              validation.errors.description ? (
                <FormFeedback type='invalid'>
                  {validation.errors.description}
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

export default SpamHotline;
