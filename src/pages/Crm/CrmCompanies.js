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
  ModalBody,
  Label,
  Input,
  Modal,
  ModalHeader,
  Form,
  ModalFooter,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  FormFeedback
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import Select from "react-select";
import DeleteModal from "../../Components/Common/DeleteModal";
import { isEmpty } from "lodash";

//Import actions
import {
  getCompanies as onGetCompanies,
  addNewCompanies as onAddNewCompanies,
  updateCompanies as onUpdateCompanies,
  deleteCompanies as onDeleteCompanies,
} from "../../store/actions";
//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from "../../Components/Common/TableContainer";

import mail_chimp from "../../assets/images/brands/mail_chimp.png";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

const CrmCompanies = () => {
  const dispatch = useDispatch();
  const { companies } = useSelector((state) => ({
    companies: state.Crm.companies,
  }));

  useEffect(() => {
    dispatch(onGetCompanies());
  }, [dispatch]);

  useEffect(() => {
    if (companies && !companies.length) {
      dispatch(onGetCompanies());
    }
  }, [dispatch, companies]);

  useEffect(() => {
    setCompany(companies);
  }, [companies]);

  useEffect(() => {
    if (!isEmpty(companies)) {
      setCompany(companies);
      setIsEdit(false);
    }
  }, [companies]);


  const [isEdit, setIsEdit] = useState(false);
  const [company, setCompany] = useState([]);

  //delete Company
  const [deleteModal, setDeleteModal] = useState(false);
  const [modal, setModal] = useState(false);

  const [sortBy, setsortBy] = useState("Owner");
  const [industryType, setindustryType] = useState(null);

  function handleIndustryType(industryType) {
    setindustryType(industryType);
  }

  function handlesortBy(sortBy) {
    setsortBy(sortBy);
  }

  const sortbyname = [
    {
      options: [
        { label: "Owner", value: "Owner" },
        { label: "Company", value: "Company" },
        { label: "Location", value: "Location" },
      ],
    },
  ];

  const industrytype = [
    {
      options: [
        { label: "Select industry type", value: "Select industry type" },
        { label: "Computer Industry", value: "Computer Industry" },
        { label: "Chemical Industries", value: "Chemical Industries" },
        { label: "Health Services", value: "Health Services" },
        {
          label: "Telecommunications Services",
          value: "Telecommunications Services",
        },
        {
          label: "Textiles: Clothing, Footwear",
          value: "Textiles: Clothing, Footwear",
        },
      ],
    },
  ];

  const toggle = useCallback(() => {
    if (modal) {
      setModal(false);
      setCompany(null);
    } else {
      setModal(true);
    }
  }, [modal]);

  // Delete Data
  const handleDeleteCompany = () => {
    if (company.id) {
      dispatch(onDeleteCompanies(company));
      setDeleteModal(false);
    }
  };

  const onClickDelete = (company) => {
    setCompany(company);
    setDeleteModal(true);
  };

  // Add Data
  const handleCompanyClicks = () => {
    setCompany("");
    setIsEdit(false);
    toggle();
  };

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      companyName: (company && company.companyName) || '',
      owner: (company && company.owner) || '',
      industryType: (company && company.industryType) || '',
      rating: (company && company.rating) || '',
      location: (company && company.location) || '',
    },
    validationSchema: Yup.object({
      companyName: Yup.string().required("Please Enter Company Name"),
      owner: Yup.string().required("Please Enter Owner name"),
      industryType: Yup.string().required("Please Enter Industry Type"),
      rating: Yup.string().required("Please Enter Rating"),
      location: Yup.string().required("Please Enter Location")
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateCompany = {
          id: company ? company.id : 0,
          companyName: values.companyName,
          owner: values.owner,
          industryType: values.industryType,
          rating: values.rating,
          location: values.location,
        };
        // update Company
        dispatch(onUpdateCompanies(updateCompany));
        validation.resetForm();
      } else {
        const newCompany = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          companyName: values["companyName"],
          owner: values["owner"],
          industryType: values["industryType"],
          rating: values["rating"],
          location: values["location"]
        };
        // save new Company
        dispatch(onAddNewCompanies(newCompany));
        validation.resetForm();
      }
      toggle();
    },
  });

  // Update Data
  const handleCompanyClick = useCallback((arg) => {
    const company = arg;

    setCompany({
      id: company.id,
      companyName: company.companyName,
      owner: company.owner,
      industryType: company.industryType,
      rating: company.rating,
      location: company.location
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
        Header: "Company Name",
        Cell: (company) => (
          <>
            <div className="d-flex align-items-center">
              <div className="flex-shrink-0">
                {company.row.original.img ? <img
                  src={company.row.original.img}
                  alt=""
                  className="avatar-xxs rounded-circle"
                /> : <div className="flex-shrink-0 avatar-xs me-2">
                  <div className="avatar-title bg-soft-success text-success rounded-circle fs-13">
                    {company.row.original.companyName.charAt(0)}
                  </div>
                </div>}
              </div>
              <div className="flex-grow-1 ms-2 name">
                {company.row.original.companyName}
              </div>
            </div>
          </>
        ),
      },
      {
        Header: "Owner",
        accessor: "owner",
        filterable: false,
      },
      {
        Header: "Industry Type",
        accessor: "industryType",
        filterable: false,
      },
      {
        Header: "Rating",
        accessor: "rating",
        filterable: false,
      },
      {
        Header: "Location",
        accessor: "location",
        filterable: false,
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
              <li className="list-inline-item" title="View">
                <Link to="#"
                  onClick={() => { const companyData = cellProps.row.original; setInfo(companyData); }}
                >
                  <i className="ri-eye-fill align-bottom text-muted"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Edit">
                <Link className="edit-item-btn" to="#"
                  onClick={() => { const companyData = cellProps.row.original; handleCompanyClick(companyData); }}
                >
                  <i className="ri-pencil-fill align-bottom text-muted"></i>
                </Link>
              </li>
              <li className="list-inline-item" title="Delete">
                <Link
                  className="remove-item-btn"
                  onClick={() => { const companyData = cellProps.row.original; onClickDelete(companyData); }}
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
    [handleCompanyClick]
  );

  // SideBar Company Deatail
  const [info, setInfo] = useState([]);
  document.title = "Companies | Velzon - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={handleDeleteCompany}
          onCloseClick={() => setDeleteModal(false)}
        />

        <Container fluid>
          <BreadCrumb title="Companies" pageTitle="CRM" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader>
                  <div className="d-flex align-items-center flex-wrap gap-2">
                    <div className="flex-grow-1">
                      <button className="btn btn-info add-btn" onClick={() => { setIsEdit(false); toggle(); }}>
                        <i className="ri-add-fill me-1 align-bottom"></i> Add Company
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
                            className="btn-soft-info btn-icon"
                            tag="button"
                          >
                            <i className="ri-more-2-fill"></i>
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-end">
                            <DropdownItem className="dropdown-item" href="#">
                              All
                            </DropdownItem>
                            <DropdownItem className="dropdown-item" href="#">
                              Last Week
                            </DropdownItem>
                            <DropdownItem className="dropdown-item" href="#">
                              Last Month
                            </DropdownItem>
                            <DropdownItem className="dropdown-item" href="#">
                              Last Year
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Col>
            <Col xxl={9}>
              <Card id="companyList">
                <CardHeader>
                  <Row className="g-2">
                    <Col md={3}>
                      <div className="search-box">
                        <Input
                          type="text"
                          className="form-control search"
                          placeholder="Search for company..."
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
                        ></Select>
                      </div>
                    </div>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div>

                    <TableContainer
                      columns={columns}
                      data={companies}
                      isGlobalFilter={false}
                      isAddUserList={false}
                      customPageSize={7}
                      className="custom-header-css"
                      divClass="table-responsive table-card mb-3"
                      tableClass="align-middle table-nowrap"
                      theadClass="table-light"
                      handleCompanyClick={handleCompanyClicks}
                    />

                  </div>
                  <Modal id="showModal" isOpen={modal} toggle={toggle} centered>
                    <ModalHeader className="bg-soft-info p-3" toggle={toggle}>
                      {!!isEdit ? "Edit Company" : "Add Company"}
                    </ModalHeader>
                    <Form onSubmit={(e) => {
                      e.preventDefault();
                      validation.handleSubmit();
                      return false;
                    }}>
                      <ModalBody>
                        <input type="hidden" id="id-field" />
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
                                name="companyName"
                                id="customername-field"
                                className="form-control"
                                placeholder="Enter Company Name"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.companyName || ""}
                                invalid={
                                  validation.touched.companyName && validation.errors.companyName ? true : false
                                }
                              />
                              {validation.touched.companyName && validation.errors.companyName ? (
                                <FormFeedback type="invalid">{validation.errors.companyName}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="owner-field"
                                className="form-label"
                              >
                                Owner Name
                              </Label>
                              <Input
                                name="owner"
                                id="owner-field"
                                className="form-control"
                                placeholder="Enter Owner Name"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.owner || ""}
                                invalid={
                                  validation.touched.owner && validation.errors.owner ? true : false
                                }
                              />
                              {validation.touched.owner && validation.errors.owner ? (
                                <FormFeedback type="invalid">{validation.errors.owner}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="industry_type-field"
                                className="form-label"
                              >
                                Industry Type
                              </Label>

                              <Input
                                name="industryType"
                                type="select"
                                className="form-select"
                                id="industry_type-field"
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={
                                  validation.values.industryType || ""
                                }
                              >
                                {industrytype.map((item, key) => (
                                  <React.Fragment key={key}>
                                    {item.options.map((item, key) => (<option value={item.value} key={key}>{item.label}</option>))}
                                  </React.Fragment>
                                ))}
                              </Input>
                              {validation.touched.industryType &&
                                validation.errors.industryType ? (
                                <FormFeedback type="invalid">
                                  {validation.errors.industryType}
                                </FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="star_value-field"
                                className="form-label"
                              >
                                Rating
                              </Label>
                              <Input
                                name="rating"
                                id="star_value-field"
                                className="form-control"
                                placeholder="Enter Rating"
                                type="text"
                                validate={{
                                  required: { value: true },
                                }}
                                onChange={validation.handleChange}
                                onBlur={validation.handleBlur}
                                value={validation.values.rating || ""}
                                invalid={
                                  validation.touched.rating && validation.errors.rating ? true : false
                                }
                              />
                              {validation.touched.rating && validation.errors.rating ? (
                                <FormFeedback type="invalid">{validation.errors.rating}</FormFeedback>
                              ) : null}
                            </div>
                          </Col>
                          <Col lg={12}>
                            <div>
                              <Label
                                htmlFor="location-field"
                                className="form-label"
                              >
                                location
                              </Label>
                              <Input
                                name="location"
                                id="star_value-field"
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
                        </Row>
                      </ModalBody>
                      <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                          <Button color="light" onClick={() => { setModal(false); }} > Close </Button>
                          <Button type="submit" color="success" id="add-btn" >  {!!isEdit ? "Update" : "Add Company"} </Button>
                        </div>
                      </ModalFooter>
                    </Form>
                  </Modal>
                </CardBody>
              </Card>
            </Col>
            <Col xxl={3}>
              <Card id="company-view-detail">
                <CardBody className="text-center">
                  <div className="position-relative d-inline-block">
                    <div className="avatar-md">
                      <div className="avatar-title bg-light rounded-circle">
                        <img src={info.img || mail_chimp} alt="" className="avatar-xs" />
                      </div>
                    </div>
                  </div>
                  <h5 className="mt-3 mb-1">{info.companyName || "Syntyce Solution"}</h5>
                  <p className="text-muted">{info.owner || "Michael Morris"}</p>

                  <ul className="list-inline mb-0">
                    <li className="list-inline-item avatar-xs">
                      <Link
                        to="#"
                        className="avatar-title bg-soft-success text-success fs-15 rounded"
                      >
                        <i className="ri-global-line"></i>
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
                <div className="card-body">
                  <h6 className="text-muted text-uppercase fw-semibold mb-3">
                    Information
                  </h6>
                  <p className="text-muted mb-4">
                    A company incurs fixed and variable costs such as the
                    purchase of raw materials, salaries and overhead, as
                    explained by AccountingTools, Inc. Business owners have the
                    discretion to determine the actions.
                  </p>
                  <div className="table-responsive table-card">
                    <table className="table table-borderless mb-0">
                      <tbody>
                        <tr>
                          <td className="fw-medium">
                            Industry Type
                          </td>
                          <td>{info.industryType || "Chemical Industries"}</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            Location
                          </td>
                          <td>{info.location || "Damascus, Syria"}</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            Employee
                          </td>
                          <td>10-50</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            Rating
                          </td>
                          <td>
                            {info.rating || "4.0"}{" "}
                            <i className="ri-star-fill text-warning align-bottom"></i>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            Website
                          </td>
                          <td>
                            <Link
                              to="#"
                              className="link-primary text-decoration-underline"
                            >
                              www.syntycesolution.com
                            </Link>
                          </td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            Contact Email
                          </td>
                          <td>info@syntycesolution.com</td>
                        </tr>
                        <tr>
                          <td className="fw-medium">
                            Since
                          </td>
                          <td>1995</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default CrmCompanies;
