import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Modal,
  Form,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Label,
  Input,
  FormFeedback
} from "reactstrap";
import Select from "react-select";
import { Link } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import MetaTags from 'react-meta-tags';
import { isEmpty } from "lodash";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";


//Import Breadcrumb
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import DeleteModal from "../../../Components/Common/DeleteModal";

import {
  getCustomers as onGetCustomers,
  addNewCustomer as onAddNewCustomer,
  updateCustomer as onUpdateCustomer,
  deleteCustomer as onDeleteCustomer,
} from "../../../store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../../Components/Common/TableContainer";

const EcommerceCustomers = () => {

  const [customerStatus, setcustomerStatus] = useState(null);
  const [customerModalStatus, setcustomerModalStatus] = useState(null);

  function handlecustomerStatus(customerStatus) {
    setcustomerStatus(customerStatus);
  }

  function handlemodalcustomerStatus(customerModalStatus) {
    setcustomerModalStatus(customerModalStatus);
  }

  const dispatch = useDispatch();

  const { customers } = useSelector((state) => ({
    customers: state.Ecommerce.customers,
  }));

  const [isEdit, setIsEdit] = useState(false);
  const [customer, setCustomer] = useState([]);
  // const [customerList, setcustomerList] = useState([]);

  // Delete customer
  const [deleteModal, setDeleteModal] = useState(false);
  const [modal, setModal] = useState(false);

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setCustomer(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  const customerstatus = [
    {
      options: [
        { label: "Status", value: "Status" },
        { label: "All", value: "All" },
        { label: "Active", value: "Active" },
        { label: "Block", value: "Block" },
      ],
    },
  ];

  const customermocalstatus = [
    {
      options: [
        { label: "Status", value: "Status" },
        { label: "Active", value: "Active" },
        { label: "Block", value: "Block" },
      ],
    },
  ];

  // Delete Data
  const onClickDelete = (customer) => {
    setCustomer(customer);
    setDeleteModal(true);
  };

  // useEffect(() => {
  //   setcustomerList(customers);
  // }, [customers]);


  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      customer: (customer && customer.customer) || '',
      email: (customer && customer.email) || '',
      phone: (customer && customer.phone) || '',
      date: (customer && customer.date) || '',
      status: (customer && customer.status) || '',
    },
    validationSchema: Yup.object({
      customer: Yup.string().required("Please Enter Customer Name"),
      email: Yup.string().required("Please Enter Your Email"),
      phone: Yup.string().required("Please Enter Your Phone"),
      date: Yup.string().required("Please Enter Your Joining Date"),
      status: Yup.string().required("Please Enter Your Status")
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateCustomer = {
          id: customer ? customer.id : 0,
          customer: values.customer,
          email: values.email,
          phone: values.phone,
          date: values.date,
          status: values.status,
        };
        // update customer
        dispatch(onUpdateCustomer(updateCustomer));
        validation.resetForm();
      } else {
        const newCustomer = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          customer: values["customer"],
          email: values["email"],
          phone: values["phone"],
          date: values["date"],
          status: values["status"]
        };
        // save new customer
        dispatch(onAddNewCustomer(newCustomer));
        validation.resetForm();
      }
      toggle();
    },
  });

  // Delete Data
  const handleDeleteCustomer = () => {
    if (customer.id) {
      dispatch(onDeleteCustomer(customer));
      setDeleteModal(false);
    }
  };

  // Update Data
  const handleCustomerClick = useCallback((arg) => {
    const customer = arg;

    setCustomer({
      id: customer.id,
      customer: customer.customer,
      email: customer.email,
      phone: customer.phone,
      date: customer.date,
      status: customer.status
    });

    setIsEdit(true);
    toggle();
  }, [toggle]);

  // Get Data
  useEffect(() => {
    dispatch(onGetCustomers());
  }, [dispatch]);

  // useEffect(() => {
  //   if (!isEmpty(customers)) setcustomerList(customers);
  // }, [customers]);

  useEffect(() => {
    if (customers && !customers.length) {
      dispatch(onGetCustomers());
    }
  }, [dispatch, customers]);


  useEffect(() => {
    setCustomer(customers);
  }, [customers]);

  useEffect(() => {
    if (!isEmpty(customers)) {
      setCustomer(customers);
      setIsEdit(false);
    }
  }, [customers]);

  // Add Data
  const handleCustomerClicks = () => {
    setCustomer("");
    setIsEdit(false);
    toggle();
  };


  // Customber Column
  const columns = useMemo(
    () => [
      {
        Header: "#",
        Cell: () => {
          return <input type="checkbox" />;
        },
      },
      {
        Header: '',
        accessor: 'id',
        hiddenColumns: true,
        Cell: (cell) => {
          return <input type="hidden" value={cell.value} />;
        }
      },
      {
        Header: "Customer",
        accessor: "customer",
        filterable: false,
      },
      {
        Header: "Email",
        accessor: "email",
        filterable: false,
      },
      {
        Header: "Phone",
        accessor: "phone",
        filterable: false,
      },
      {
        Header: "Date",
        accessor: "date",
        filterable: false,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: (cell) => {
          switch (cell.value) {
            case "Active":
              return <span className="badge text-uppercase badge-soft-success"> {cell.value} </span>;
            case "Block":
              return <span className="badge text-uppercase badge-soft-danger"> {cell.value} </span>;
            default:
              return <span className="badge text-uppercase badge-soft-info"> {cell.value} </span>;
          }
        }
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit" title="Edit">
                <Link
                  to="#"
                  className="text-primary d-inline-block edit-item-btn"
                  onClick={() => { const customerData = cellProps.row.original; handleCustomerClick(customerData); }}
                >

                  <i className="ri-pencil-fill fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Remove">
                <Link
                  to="#"
                  className="text-danger d-inline-block remove-item-btn"
                  onClick={() => { const customerData = cellProps.row.original; onClickDelete(customerData); }}
                >
                  <i className="ri-delete-bin-5-fill fs-16"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    [handleCustomerClick]
  );
  document.title = "Customers | Velzon - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteCustomer}
          onCloseClick={() => setDeleteModal(false)}
        />
        <Container fluid>
          <BreadCrumb title="Customers" pageTitle="Ecommerce" />

          <Row>
            <Col lg={12}>
              <Card id="customerList">
                <CardHeader className="border-bottom-dashed">
                  <Row className="g-4 align-items-center">
                    <div className="col-sm">
                      <div>
                        <h5 className="card-title mb-0">Customer List</h5>
                      </div>
                    </div>
                    <div className="col-sm-auto">
                      <div>
                        <button className="btn btn-soft-danger me-1"
                        // onClick="deleteMultiple()"
                        ><i className="ri-delete-bin-2-line"></i></button>
                        <button
                          type="button"
                          className="btn btn-success add-btn"
                          id="create-btn"
                          onClick={() => { setIsEdit(false); toggle(); }}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add
                          Customer
                        </button>{" "}
                        <button type="button" className="btn btn-info">
                          <i className="ri-file-download-line align-bottom me-1"></i>{" "}
                          Import
                        </button>
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody className="border-bottom-dashed border-bottom">
                  <form>
                    <Row className="g-3">
                      <Col xl={6}>
                        <div className="search-box">
                          <input
                            type="text"
                            className="form-control search /"
                            placeholder="Search for customer, email, phone, status or something..."
                          />
                          <i className="ri-search-line search-icon"></i>
                        </div>
                      </Col>

                      <Col xl={6}>
                        <Row className="g-3">
                          <Col sm={4}>
                            <div className="">
                              <Flatpickr
                                className="form-control"
                                id="datepicker-publish-input"
                                placeholder="Select a date"
                                options={{
                                  altInput: true,
                                  altFormat: "F j, Y",
                                  mode: "multiple",
                                  dateFormat: "d.m.y",
                                }}
                              />
                            </div>
                          </Col>

                          <Col sm={4}>
                            <div>
                              <Select
                                value={customerStatus}
                                onChange={() => {
                                  handlecustomerStatus();
                                }}
                                options={customerstatus}
                                name="choices-single-default"
                                id="idStatus"
                              ></Select>
                            </div>
                          </Col>

                          <Col sm={4}>
                            <div>
                              <button
                                type="button"
                                className="btn btn-primary w-100"
                              >
                                {" "}
                                <i className="ri-equalizer-fill me-2 align-bottom"></i>
                                Filters
                              </button>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </form>
                </CardBody>
                <div className="card-body">
                  <div>
                    <TableContainer
                      columns={columns}
                      data={customers}
                      isGlobalFilter={false}
                      isAddUserList={false}
                      customPageSize={10}
                      className="custom-header-css"
                      handleCustomerClick={handleCustomerClicks}
                    />
                  </div>

                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Customer" : "Add Customer"}
                    </ModalHeader>
                    <Form onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}>
                      <ModalBody>
                        <input type="hidden" id="id-field" />

                        <div
                          className="mb-3"
                          id="modal-id"
                          style={{ display: "none" }}
                        >
                          <Label htmlFor="id-field1" className="form-label">
                            ID
                          </Label>
                          <Input
                            type="text"
                            id="id-field1"
                            className="form-control"
                            placeholder="ID"
                            readOnly
                          />
                        </div>

                        <div className="mb-3">
                          <Label
                            htmlFor="customername-field"
                            className="form-label"
                          >
                            Customer Name
                          </Label>
                          <Input
                            name="customer"
                            id="customername-field"
                            className="form-control"
                            placeholder="Enter Name"
                            type="text"
                            validate={{
                              required: { value: true },
                            }}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.customer || ""}
                            invalid={
                              validation.touched.customer && validation.errors.customer ? true : false
                            }
                          />
                          {validation.touched.customer && validation.errors.customer ? (
                            <FormFeedback type="invalid">{validation.errors.customer}</FormFeedback>
                          ) : null}
                        </div>

                        <div className="mb-3">
                          <Label htmlFor="email-field" className="form-label">
                            Email
                          </Label>
                          <Input
                            name="email"
                            type="email"
                            id="email-field"
                            placeholder="Enter Email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={
                              validation.touched.email && validation.errors.email ? true : false
                            }
                          />
                          {validation.touched.email && validation.errors.email ? (
                            <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                          ) : null}

                        </div>

                        <div className="mb-3">
                          <Label htmlFor="phone-field" className="form-label">
                            Phone
                          </Label>
                          <Input
                            name="phone"
                            type="text"
                            id="phone-field"
                            placeholder="Enter Phone no."
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.phone || ""}
                            invalid={
                              validation.touched.phone && validation.errors.phone ? true : false
                            }
                          />
                          {validation.touched.phone && validation.errors.phone ? (
                            <FormFeedback type="invalid">{validation.errors.phone}</FormFeedback>
                          ) : null}

                        </div>

                        <div className="mb-3">
                          <Label htmlFor="date-field" className="form-label">
                            Joining Date
                          </Label>

                          <Input
                            name="date"
                            type="date"
                            id="date-field"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.date || ""}
                            invalid={
                              validation.touched.date && validation.errors.date ? true : false
                            }
                          />
                          {validation.touched.date && validation.errors.date ? (
                            <FormFeedback type="invalid">{validation.errors.date}</FormFeedback>
                          ) : null}
                        </div>

                        <div>
                          <Label htmlFor="status-field" className="form-label">
                            Status
                          </Label>

                          <Input
                            name="status"
                            type="select"
                            className="form-select"
                            id="status-field"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={
                              validation.values.status || ""
                            }
                          >
                            {customermocalstatus.map((item, key) => (
                              <React.Fragment key={key}>
                                {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                              </React.Fragment>
                            ))}
                          </Input>
                          {validation.touched.status &&
                            validation.errors.status ? (
                            <FormFeedback type="invalid">
                              {validation.errors.status}
                            </FormFeedback>
                          ) : null}
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                          <button type="button" className="btn btn-light" onClick={() => { setModal(false); }}> Close </button>

                          <button type="submit" className="btn btn-success"> {!!isEdit ? "Update" : "Add Customer"} </button>
                        </div>
                      </ModalFooter>
                    </Form>
                  </Modal>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EcommerceCustomers;
