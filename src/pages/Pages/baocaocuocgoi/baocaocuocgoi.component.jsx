import { useFormik } from 'formik';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from 'reactstrap';
import * as Yup from 'yup';
import { BaoCaoAPI } from '../../../api/baocaocuocgoi.api';
import addToast from '../../../Components/Common/add-toast.component';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import DataGridComponent from '../../../Components/Common/data-grid/data-grid.component';
import LoadingComponent from '../../../Components/Common/loading.component';
import SearchComponent from '../../../Components/Common/search.component';
import { Message } from '../../../shared/const/message.const';


const BaoCaoCuocGoi = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const recordId = useRef(null);
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      customername: '',
      extension: '',
      hotline: '',
      calleegatewayid: '',
      duration: '',
      ip: '',
      tongcall: '',
      tongcall480: '',
      status: '',
    },
  });
  const getListBaoCao = useCallback(async () => {
    try {
      setLoading(true);
      const response = await BaoCaoAPI.getBaoCaoList();
      setData(response.data);
      setSearchData(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListBaoCao();
  }, [getListBaoCao]);

  // const close = () => {
  //   validation.resetForm();
  //   setOpenModal({
  //     updateRecord: false,
  //     isOpen: false,
  //   });
  // };

  // const open = (updateRecord, row = null) => {
  //   if (updateRecord) {
  //     validation.setValues({
  //       ip: row.ip || '',
  //       name: row.name || '',
  //       type: row.type || '',
  //     });
  //   }

  //   setOpenModal({
  //     updateRecord,
  //     isOpen: true,
  //   });
  // };

  const COLUMN_CONFIG = useRef([
    {
      field: 'customername',
      headerName: 'Customer Name',
      flex: 1,
    },
    {
      field: 'extension',
      headerName: 'EXtension',
      flex: 1,
    },
    {
      field: 'hotline',
      headerName: 'Hotline',
      flex: 1,
    },
    {
      field: 'calleegatewayid',
      headerName: 'Side',
      flex: 1,
    },
    {
      field: 'duration',
      headerName: 'Duration',
      flex: 0.5,
    },
    {
      field: 'ip',
      headerName: 'IP',
      flex: 1,
    },
    {
      field: 'tongcall',
      headerName: 'Total Call',
      flex: 1,
    },
    {
      field: 'tongcall480',
      headerName: 'Total Call 480',
      flex: 1,
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
    },

    // {
    //   field: 'action',
    //   headerName: 'Action',
    //   flex: 0.3,
    //   sortable: false,
    //   renderCell: (cellValues) => (
    //     <>
    //       <Button
    //         color='soft-warning'
    //         onClick={() => open(cellValues.row.id, cellValues.row)}
    //       >
    //         <i className='ri-pencil-fill'></i>
    //       </Button>
    //       <Button
    //         style={{ marginLeft: 8 }}
    //         color='soft-danger'
    //         onClick={() => {
    //           handleOpenDelete(true, cellValues.row);
    //         }}
    //       >
    //         <i className='ri-delete-bin-2-line'></i>
    //       </Button>
    //     </>
    //   ),
    // },
  ]).current;

  const onSearch = (search) => {
    setSearchData(search);
  };


  document.title = 'Total Call List';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='Report Call' pageTitle='Alert' />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <h4 className='card-title mb-0 flex-grow-1'>
                  Báo cáo tổng hợp cuộc gọi khách hàng thực hiện trong 15 phút full
                  </h4>
                </CardHeader>

                <CardBody>
                  <div id='table-gridjs'>
                    <Row className='g-4 mb-3'>
                      {/* <Col className='col-sm-auto'>
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
                      </Col> */}
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

      {/* <Modal
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
      </Modal> */}

      {/* <Modal
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
      </Modal> */}
    </React.Fragment>
  );
};

export default BaoCaoCuocGoi;
