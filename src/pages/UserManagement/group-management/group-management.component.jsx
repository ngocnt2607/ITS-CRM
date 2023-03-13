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
import { GroupAPI } from '../../../api/group.api';
import addToast from '../../../Components/Common/add-toast.component';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import SearchComponent from '../../../Components/Common/search.component';
import { Message } from '../../../shared/const/message.const';


const GroupList = () => {
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
      name: '',
      description: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Vui lòng nhập tên nhóm'),
      description: Yup.string().required('Vui lòng nhập mô tả'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);

        if (openModal.updateRecord) {
          await GroupAPI.updateGroup({
            ...values,
            id: openModal.updateRecord,
          });
        } else {
          await GroupAPI.createNewGroup(values);
        }
        addToast({
          message: openModal.updateRecord
            ? Message.UPDATE_SUCCESS
            : Message.CREATE_SUCCESS,
          type: 'success',
        });
        await getListGroup();
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
      await GroupAPI.deleteGroup(recordId.current);
      addToast({ message: Message.DELETE_SUCCESS, type: 'success' });
      await getListGroup();
      handleOpenDelete(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getListGroup = useCallback(async () => {
    try {
      setLoading(true);
      const response = await GroupAPI.getGroupList();
      setData(response.data);
      setSearchData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListGroup();
  }, [getListGroup]);

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
        name: row.name || '',
        description: row.description || '',
      });
    }

    setOpenModal({
      updateRecord,
      isOpen: true,
    });
  };

  const COLUMN_CONFIG = useRef([
    {
      field: 'name',
      headerName: 'Tên group',
      flex: 1,
    },
    {
      field: 'description',
      headerName: 'Mô tả',
      flex: 1,
    },
    {
      field: 'action',
      headerName: 'Thao tác',
      flex: 0.35,
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


  document.title = 'Danh sách Group';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='Danh sách Role' pageTitle='Quản lý Role' />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className='card-title mb-0 flex-grow-1'>
                    Danh sách Role
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
          {openModal.isUpdate ? 'Update Group' : 'Create New Group'}
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
                Tên group
              </Label>
              <Input
                name='name'
                className='form-control'
                placeholder='Vui lòng nhập tên group'
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
              <Label htmlFor='description' className='form-label'>
                Mô tả
              </Label>
              <Input
                name='description'
                className='form-control'
                placeholder='Vui lòng nhập mô tả'
                onChange={validation.handleChange}
                onBlur={validation.handleBlur}
                value={validation.values.description || ''}
                invalid={
                  validation.touched.description && validation.errors.description
                    ? true
                    : false
                }
              />
              {validation.touched.description && validation.errors.description ? (
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

export default GroupList;
