import React, { useEffect, useState, useCallback, useMemo } from "react";
import MetaTags from 'react-meta-tags';
import { Link } from "react-router-dom";
import { isEmpty } from "lodash";

import {
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  ModalFooter,
  Table,
  FormFeedback
} from "reactstrap";
import Select from "react-select";

import avatar10 from "../../assets/images/users/avatar-10.jpg";

import BreadCrumb from "../../Components/Common/BreadCrumb";
import DeleteModal from "../../Components/Common/DeleteModal";

//Import actions
import {
  getContacts as onGetContacts,
  addNewContact as onAddNewContact,
  updateContact as onUpdateContact,
  deleteContact as onDeleteContact,
} from "../../store/actions";
//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../Components/Common/TableContainer";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

const CrmContacts = () => {
  const dispatch = useDispatch();
  const { crmcontacts } = useSelector((state) => ({
    crmcontacts: state.Crm.crmcontacts,
  }));

  useEffect(() => {
    if (crmcontacts && !crmcontacts.length) {
      dispatch(onGetContacts());
    }
  }, [dispatch, crmcontacts]);

  useEffect(() => {
    setContact(crmcontacts);
  }, [crmcontacts]);

  useEffect(() => {
    if (!isEmpty(crmcontacts)) {
      setContact(crmcontacts);
      setIsEdit(false);
    }
  }, [crmcontacts]);


  const [isEdit, setIsEdit] = useState(false);
  const [contact, setContact] = useState([]);


  //delete Conatct
  const [deleteModal, setDeleteModal] = useState(false);
  const [modal, setModal] = useState(false);

  const [sortBy, setsortBy] = useState(null);

  function handlesortBy(sortBy) {
    setsortBy(sortBy);
  }

  const sortbyname = [
    {
      options: [
        { label: "Owner", value: "Owner" },
        { label: "Company", value: "Company" },
        { label: "Location", value: "Location" }
      ],
    },
  ];

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setContact(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  // Delete Data
  const handleDeleteContact = () => {
    if (contact.id) {
      dispatch(onDeleteContact(contact));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (contact) => {
    setContact(contact);
    setDeleteModal(true);
  };

  // Add Data
  const handleContactClicks = () => {
    setContact("");
    setIsEdit(false);
    toggle();
  };

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      // contactId: (contact && contact.contactId) || '',
      name: (contact && contact.name) || '',
      company: (contact && contact.company) || '',
      email: (contact && contact.email) || '',
      phone: (contact && contact.phone) || '',
      score: (contact && contact.score) || '',
      date: (contact && contact.date) || '',
      time: (contact && contact.time) || '',
    },
    validationSchema: Yup.object({
      // contactId: Yup.string().required("Please Enter Contact Id"),
      name: Yup.string().required("Please Enter Name"),
      company: Yup.string().required("Please Enter Company"),
      email: Yup.string().required("Please Enter Email"),
      phone: Yup.string().required("Please Enter Phone"),
      score: Yup.string().required("Please Enter Score"),
      date: Yup.string().required("Please Enter Date"),
      time: Yup.string().required("Please Enter Time"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateContact = {
          id: contact ? contact.id : 0,
          // contactId: values.contactId,
          name: values.name,
          company: values.company,
          email: values.email,
          phone: values.phone,
          score: values.score,
          date: values.date,
          time: values.time,
        };
        // update Contact
        dispatch(onUpdateContact(updateContact));
        validation.resetForm();
      } else {
        const newContact = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          // contactId: values["contactId"],
          name: values["name"],
          company: values["company"],
          email: values["email"],
          phone: values["phone"],
          score: values["score"],
          date: values["date"],
          time: values["time"]
        };
        // save new Contact
        dispatch(onAddNewContact(newContact));
        validation.resetForm();
      }
      toggle();
    },
  });

  // Update Data
  const handleContactClick = useCallback((arg) => {
    const contact = arg;

    setContact({
      id: contact.id,
      contactId: contact.contactId,
      name: contact.name,
      company: contact.company,
      email: contact.email,
      phone: contact.phone,
      score: contact.score,
      date: contact.date,
      time: contact.time,
    });

    setIsEdit(true);
    toggle();
  }, [toggle]);


  // Customber Column
  const columns = useMemo(
    () => [
      {
        Header: "#",
        Cell: () => {
          return (
            <div className="form-check">
              <input className="form-check-input" type="checkbox" name="checkAll" value="option1" />
            </div>
          );
        },
      },
      {
        Header: "Name",
        accessor: "name",
        filterable: false,
      },
      {
        Header: "Company",
        accessor: "company",
        filterable: false,
      },
      {
        Header: "Email ID",
        accessor: "email",
        filterable: false,
      },
      {
        Header: "Phone No",
        accessor: "phone",
        filterable: false,
      },
      {
        Header: "Lead Score",
        accessor: "score",
        filterable: false,
      },
      {
        Header: "Last Contacted",
        Cell: (contact) => (
          <>
            {contact.row.original.date},{" "}
            <small className="text-muted">{contact.row.original.time}</small>
          </>
        ),
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit" title="Call">
                <Link to="#" className="text-muted d-inline-block">
                  <i className="ri-phone-line fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item edit" title="Message">
                <Link to="#" className="text-muted d-inline-block">
                  <i className="ri-question-answer-line fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item">
                <UncontrolledDropdown>
                  <DropdownToggle
                    href="#"
                    className="btn-soft-secondary btn-sm dropdown"
                    tag="button"
                  >
                    <i className="ri-more-fill align-middle"></i>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-end">
                    <DropdownItem className="dropdown-item" href="#"
                      onClick={() => { const contactData = cellProps.row.original; setInfo(contactData); }}
                    >
                      <i className="ri-eye-fill align-bottom me-2 text-muted"></i>{" "}
                      View
                    </DropdownItem>
                    <DropdownItem
                      className="dropdown-item edit-item-btn"
                      href="#"
                      onClick={() => { const contactData = cellProps.row.original; handleContactClick(contactData); }}
                    >
                      <i className="ri-pencil-fill align-bottom me-2 text-muted"></i>{" "}
                      Edit
                    </DropdownItem>
                    <DropdownItem
                      className="dropdown-item remove-item-btn"
                      href="#"
                      onClick={() => { const contactData = cellProps.row.original; onClickDelete(contactData); }}
                    >
                      <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i>{" "}
                      Delete
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </li>
            </ul>
          );
        },
      },
    ],
    [handleContactClick]
  );

  // SideBar Contact Deatail
  const [info, setInfo] = useState([]);
  document.title = "Contacts | Velzon - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteContact}
          onCloseClick={() => setDeleteModal(false)}
        />

        <Container fluid>
          <BreadCrumb title="Contacts" pageTitle="CRM" />
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <div className="flex-grow-1">
                      <button
                        className="btn btn-info add-btn"
                        onClick={() => {
                          setModal(true);
                        }}
                      >
                        <i className="ri-add-fill me-1 align-bottom"></i> Add
                        Contacts
                      </button>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="hstack text-nowrap gap-2">
                        <button className="btn btn-soft-danger"
                        // onClick="deleteMultiple()"
                        ><i className="ri-delete-bin-2-line"></i></button>
                        <button className="btn btn-danger">
                          <i className="ri-filter-2-line me-1 align-bottom"></i>{" "}
                          Filters
                        </button>
                        <button className="btn btn-soft-success">Import</button>

                        <UncontrolledDropdown>
                          <DropdownToggle
                            href="#"
                            className="btn btn-soft-info"
                            tag="button"
                          >
                            <i className="ri-more-2-fill"></i>
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-end">
                            <DropdownItem className="dropdown-item" href="#">All</DropdownItem>
                            <DropdownItem className="dropdown-item" href="#">Last Week</DropdownItem>
                            <DropdownItem className="dropdown-item" href="#">Last Month</DropdownItem>
                            <DropdownItem className="dropdown-item" href="#">Last Year</DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>

                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Col>
            <Col xxl={9}>
              <Card id="contactList">
                <CardHeader>
                  <Row className="g-3">
                    <Col md={4}>
                      <div className="search-box">
                        <Input
                          type="text"
                          className="form-control search"
                          placeholder="Search for contact..."
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </Col>
                    <div className="col-md-auto ms-auto">
                      <div className="d-flex align-items-center gap-2">
                        <span className="text-muted">Sort by: </span>
                        <Select
                          className="mb-0"
                          value={sortBy}
                          onChange={() => {
                            handlesortBy();
                          }}
                          options={sortbyname}
                          id="choices-single-default"
                        >
                        </Select>
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div>
                    <TableContainer
                      columns={columns}
                      data={crmcontacts}
                      isGlobalFilter={false}
                      isAddUserList={false}
                      customPageSize={10}
                      className="custom-header-css"
                      divClass="table-responsive table-card mb-3"
                      tableClass="align-middle table-nowrap"
                      theadClass="table-light"
                      handleContactClick={handleContactClicks}
                    />
                  </div>

                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
                    <ModalHeader className="bg-soft-info p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Contact" : "Add Contact"}
                    </ModalHeader>

                    <Form onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}>
                      <ModalBody>
                        <Input type="hidden" id="id-field" />
                        <Row className="g-3">
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="name-field"
                                className="form-label"
                              >
                                Name
                              </Label>
                              <Input
                                name="name"
                                id="customername-field"
                                className="form-control"
                                placeholder="Enter Name"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.name || ""}
                                invalid={
                                  validation.touched.name && validation.errors.name ? true : false
                                }
                              />
                              {validation.touched.name && validation.errors.name ? (
                                <FormFeedback type="invalid">{validation.errors.name}</FormFeedback>
                              ) : null}

                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="company_name-field"
                                className="form-label"
                              >
                                Company Name
                              </Label>
                              <Input
                                name="company"
                                id="company_name-field"
                                className="form-control"
                                placeholder="Enter Company Name"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.company || ""}
                                invalid={
                                  validation.touched.company && validation.errors.company ? true : false
                                }
                              />
                              {validation.touched.company && validation.errors.company ? (
                                <FormFeedback type="invalid">{validation.errors.company}</FormFeedback>
                              ) : null}

                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="email_id-field"
                                className="form-label"
                              >
                                Email ID
                              </Label>

                              <Input
                                name="email"
                                id="email_id-field"
                                className="form-control"
                                placeholder="Enter Email"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
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
                          </Col>
                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="phone-field"
                                className="form-label"
                              >
                                Phone
                              </Label>

                              <Input
                                name="phone"
                                id="phone-field"
                                className="form-control"
                                placeholder="Enter Phone No."
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
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
                          </Col>
                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="lead_score-field"
                                className="form-label"
                              >
                                Lead Score
                              </Label>

                              <Input
                                name="score"
                                id="lead_score-field"
                                className="form-control"
                                placeholder="Enter Lead Score"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.score || ""}
                                invalid={
                                  validation.touched.score && validation.errors.score ? true : false
                                }
                              />
                              {validation.touched.score && validation.errors.score ? (
                                <FormFeedback type="invalid">{validation.errors.score}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>

                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="date-field"
                                className="form-label"
                              >
                                Date
                              </Label>

                              <Input
                                name="date"
                                id="date-field"
                                className="form-control"
                                placeholder="Enter Date"
                                type="date"
                                validate={{
                                  required: { value: true },
                                }}
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
                          </Col>
                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="time-field"
                                className="form-label"
                              >
                                Time
                              </Label>

                              <Input
                                name="time"
                                id="time-field"
                                className="form-control"
                                placeholder="Enter Time"
                                type="time"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.time || ""}
                                invalid={
                                  validation.touched.time && validation.errors.time ? true : false
                                }
                              />
                              {validation.touched.time && validation.errors.time ? (
                                <FormFeedback type="invalid">{validation.errors.time}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                        </Row>
                      </ModalBody>
                      <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                          <button type="button" className="btn btn-light" onClick={() => { setModal(false); }} > Close </button>
                          <button type="submit" className="btn btn-success" id="add-btn" > {!!isEdit ? "Update" : "Add Contact"} </button>
                        </div>
                      </ModalFooter>
                    </Form>
                  </Modal>
                </CardBody>
              </Card>
            </Col>

            <Col xxl={3}>
              <Card id="contact-view-detail">
                <CardBody className="text-center">
                  <div className="position-relative d-inline-block">
                    <img
                      src={avatar10}
                      alt=""
                      className="avatar-lg rounded-circle img-thumbnail"
                    />
                    <span className="contact-active position-absolute rounded-circle bg-success">
                      <span className="visually-hidden"></span>
                    </span>
                  </div>
                  <h5 className="mt-4 mb-1">{info.name || "Tonya Noble"}</h5>
                  <p className="text-muted">{info.company || "Nesta Technologies"}</p>

                  <ul className="list-inline mb-0">
                    <li className="list-inline-item avatar-xs">
                      <Link
                        to="#"
                        className="avatar-title bg-soft-success text-success fs-15 rounded"
                      >
                        <i className="ri-phone-line"></i>
                      </Link>
                    </li>
                    <li className="list-inline-item avatar-xs">
                      <Link
                        to="#"
                        className="avatar-title bg-soft-danger text-danger fs-15 rounded"
                      >
                        <i className="ri-mail-line"></i>
                      </Link>
                    </li>
                    <li className="list-inline-item avatar-xs">
                      <Link
                        to="#"
                        className="avatar-title bg-soft-warning text-warning fs-15 rounded"
                      >
                        <i className="ri-question-answer-line"></i>
                      </Link>
                    </li>
                  </ul>
                </CardBody>
                <CardBody>
                  <h6 className="text-muted text-uppercase fw-semibold mb-3">
                    Personal Information
                  </h6>
                  <p className="text-muted mb-4">
                    Hello, I'm {info.name || "Tonya Noble"}, The most effective objective is one
                    that is tailored to the job you are applying for. It states
                    what kind of career you are seeking, and what skills and
                    experiences.
                  </p>
                  <div className="table-responsive table-card">
                    <Table className="table table-borderless mb-0">
                      <tbody>
                        <tr>
                          <td className="fw-medium">
                            Designation
                          </td>
                          <td>Lead Designer / Developer</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            Email ID
                          </td>
                          <td>{info.email || "tonyanoble@velzon.com"}</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            Phone No
                          </td>
                          <td>{info.phone || "414-453-5725"}</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            Lead Score
                          </td>
                          <td>{info.score || "154"}</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            Tags
                          </td>
                          <td>
                            <span className="badge badge-soft-primary me-1">
                              Lead
                            </span>
                            <span className="badge badge-soft-primary">
                              Partner
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            Last Contacted
                          </td>
                          <td>
                            {info.date || "15 Dec, 2021"}{" "}
                            <small className="text-muted">{info.time || "08:58AM"}</small>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CrmContacts;
