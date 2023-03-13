import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import MetaTags from 'react-meta-tags';
import {
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
  Input,
  ModalHeader,
  ModalBody,
  Label,
  ModalFooter,
  Modal,
  Form,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormFeedback,
} from "reactstrap";
import BreadCrumb from "../../../Components/Common/BreadCrumb";
import Flatpickr from "react-flatpickr";
import { isEmpty } from "lodash";

//Import actions
import {
  getLeads as onGetLeads,
  addNewLead as onAddNewLead,
  updateLead as onUpdateLead,
  deleteLead as onDeleteLead,
} from "../../../store/actions";
//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../../Components/Common/TableContainer";
import DeleteModal from "../../../Components/Common/DeleteModal";
import CrmFilter from "./CrmFilter";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

const CrmLeads = () => {
  const dispatch = useDispatch();
  const { leads } = useSelector((state) => ({
    leads: state.Crm.leads,
  }));

  useEffect(() => {
    if (leads && !leads.length) {
      dispatch(onGetLeads());
    }
  }, [dispatch, leads]);

  useEffect(() => {
    dispatch(onGetLeads());
  }, [dispatch]);

  useEffect(() => {
    setLead(leads);
  }, [leads]);

  useEffect(() => {
    if (!isEmpty(leads)) {
      setLead(leads);
      setIsEdit(false);
    }
  }, [leads]);

  const [isEdit, setIsEdit] = useState(false);
  const [lead, setLead] = useState([]);

  //delete lead
  const [deleteModal, setDeleteModal] = useState(false);
  const [modal, setModal] = useState(false);

  const [isInfoDetails, setIsInfoDetails] = useState(false);


  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setLead(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  // Delete Data
  const handleDeleteLead = () => {
    if (lead.id) {
      dispatch(onDeleteLead(lead));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (lead) => {
    setLead(lead);
    setDeleteModal(true);
  };

  // Add Data
  const handleLeadClicks = () => {
    setLead("");
    setIsEdit(false);
    toggle();
  };

  const toggleInfo = () => {
    setIsInfoDetails(!isInfoDetails);
  };

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      // leadsId: (lead && lead.leadsId) || '',
      name: (lead && lead.name) || '',
      company: (lead && lead.company) || '',
      score: (lead && lead.score) || '',
      phone: (lead && lead.phone) || '',
      location: (lead && lead.location) || '',
      date: (lead && lead.date) || '',
    },
    validationSchema: Yup.object({
      // leadsId: Yup.string().required("Please Enter leads Id"),
      name: Yup.string().required("Please Enter Name"),
      company: Yup.string().required("Please Enter Company"),
      score: Yup.string().required("Please Enter Score"),
      phone: Yup.string().required("Please Enter Phone"),
      location: Yup.string().required("Please Enter Location"),
      date: Yup.string().required("Please Enter Date"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateLead = {
          id: lead ? lead.id : 0,
          // leadsId: values.leadsId,
          name: values.name,
          company: values.company,
          score: values.score,
          phone: values.phone,
          location: values.location,
          date: values.date,
        };
        // update Company
        dispatch(onUpdateLead(updateLead));
        validation.resetForm();
      } else {
        const newLead = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          // leadsId: values["leadsId"],
          name: values["name"],
          company: values["company"],
          score: values["score"],
          phone: values["phone"],
          location: values["location"],
          date: values["date"]
        };
        // save new Lead
        dispatch(onAddNewLead(newLead));
        validation.resetForm();
      }
      toggle();
    },
  });

  // Update Data
  const handleLeadClick = useCallback((arg) => {
    const lead = arg;

    setLead({
      id: lead.id,
      // leadsId: lead.leadsId,
      name: lead.name,
      company: lead.company,
      score: lead.score,
      phone: lead.phone,
      location: lead.location,
      date: lead.date,
    });

    setIsEdit(true);
    toggle();
  }, [toggle]);




  // Customber Column
  const columns = useMemo(
    () => [
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
        Header: "Leads Score",
        accessor: "score",
        filterable: false,
      },
      {
        Header: "Phone",
        accessor: "phone",
        filterable: false,
      },
      {
        Header: "Location",
        accessor: "location",
        filterable: false,
      },
      {
        Header: "Create Date",
        accessor: "date",
        filterable: false,
      },
      {
        Header: "Action",
        Cell: (cellProps) => {
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li className="list-inline-item edit" title="Call">
                <Link
                  to="#"
                  className="text-muted d-inline-block"
                // onClick={toggle}
                >
                  <i className="ri-phone-line fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item edit" title="Message">
                <Link to="#" className="text-muted d-inline-block">
                  <i className="ri-question-answer-line fs-16"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="View">
                <Link to="#">
                  <i className="ri-eye-fill align-bottom text-muted"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Edit">
                <Link className="edit-item-btn" to="#"
                  onClick={() => { const LeadData = cellProps.row.original; handleLeadClick(LeadData); }}
                >
                  <i className="ri-pencil-fill align-bottom text-muted"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Delete">
                <Link
                  className="remove-item-btn"
                  onClick={() => { const LeadData = cellProps.row.original; onClickDelete(LeadData); }}
                  to="#"
                >
                  <i className="ri-delete-bin-fill align-bottom text-muted"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    [handleLeadClick]
  );
  document.title = "Leads | Velzon - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteLead}
          onCloseClick={() => setDeleteModal(false)}
        />

        <Container fluid>
          <BreadCrumb title="Leads" pageTitle="CRM" />
          <Row>
            <Col lg={12}>
              <Card id="leadsList">
                <CardHeader className="border-0">
                  <Row className="g-4 align-items-center">
                    <Col sm={3}>
                      <div className="search-box">
                        <Input
                          type="text"
                          className="form-control search"
                          placeholder="Search for..."
                        />
                        <i className="ri-search-line search-icon"></i>
                      </div>
                    </Col>
                    <div className="col-sm-auto ms-auto">
                      <div className="hstack gap-2">
                        <button className="btn btn-soft-danger"
                        // onClick="deleteMultiple()"
                        ><i className="ri-delete-bin-2-line"></i></button>
                        <button type="button" className="btn btn-info" onClick={toggleInfo}>
                          <i className="ri-filter-3-line align-bottom me-1"></i>{" "}
                          Fliters
                        </button>
                        <button
                          type="button"
                          className="btn btn-success add-btn"
                          id="create-btn"
                          onClick={() => { setIsEdit(false); toggle(); }}
                        >
                          <i className="ri-add-line align-bottom me-1"></i> Add
                          Leads
                        </button>
                        <UncontrolledDropdown>
                          <DropdownToggle
                            className="btn btn-soft-info btn-icon fs-14"
                            type="button"
                            id="dropdownMenuButton1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="ri-settings-4-line"></i>
                          </DropdownToggle>
                          <DropdownMenu
                          >
                            <li>
                              <DropdownItem>
                                Copy
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem>
                                Move to pipline
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem>
                                Add to exceptions
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem>
                                Switch to common form view
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem>
                                Reset form view to default
                              </DropdownItem>
                            </li>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div>
                    <TableContainer
                      columns={columns}
                      data={leads}
                      isGlobalFilter={false}
                      isAddUserList={false}
                      customPageSize={10}
                      className="custom-header-css"
                      divClass="table-responsive table-card mb-3"
                      tableClass="align-middle table-nowrap"
                      theadClass="table-light"
                      handleLeadClick={handleLeadClicks}
                    />
                  </div>
                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
                    <ModalHeader className="bg-light p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Lead" : "Add Lead"}
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
                          <Col lg={6}>
                            <div>
                              <Label
                                htmlFor="leads_score-field"
                                className="form-label"
                              >
                                Leads Score
                              </Label>
                              <Input
                                name="score"
                                id="company_name-field"
                                className="form-control"
                                placeholder="Enter Score"
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
                                htmlFor="phone-field"
                                className="form-label"
                              >
                                Phone
                              </Label>
                              <Input
                                name="phone"
                                id="phone-field"
                                className="form-control"
                                placeholder="Enter Phone Number"
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
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="location-field"
                                className="form-label"
                              >
                                Location
                              </Label>
                              <Input
                                name="location"
                                id="location-field"
                                className="form-control"
                                placeholder="Enter Location"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.location || ""}
                                invalid={
                                  validation.touched.location && validation.errors.location ? true : false
                                }
                              />
                              {validation.touched.location && validation.errors.location ? (
                                <FormFeedback type="invalid">{validation.errors.location}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="date-field"
                                className="form-label"
                              >
                                Created Date
                              </Label>
                              <Input
                                name="date"
                                id="datepicker-publish-input"
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
                        </Row>
                      </ModalBody>
                      <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                          <button type="button" className="btn btn-light" onClick={() => { setModal(false); }} > Close </button>
                          <button type="submit" className="btn btn-success" id="add-btn"> {!!isEdit ? "Update" : "Add Lead"} </button>
                        </div>
                      </ModalFooter>
                    </Form>
                  </Modal>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <CrmFilter
        show={isInfoDetails}
        onCloseClick={() => setIsInfoDetails(false)}
      />
    </React.Fragment>
  );
};

export default CrmLeads;