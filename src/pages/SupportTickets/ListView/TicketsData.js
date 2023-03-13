import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Card, CardBody, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, Form, FormFeedback, Input, Label, Modal, ModalBody, ModalHeader, Row, UncontrolledDropdown } from 'reactstrap';
//redux
import { useSelector, useDispatch } from "react-redux";
import TableContainer from '../../../Components/Common/TableContainer';
import { getTicketsList, addNewTicket, updateTicket, deleteTicket } from "../../../store/actions";

import { TicketsId, Title, Client, AssignedTo, CreateDate, DueDate, Status, Priority } from "./TicketCol";
//Import Flatepicker
import Flatpickr from "react-flatpickr";

import { isEmpty } from "lodash";

// Formik
import * as Yup from "yup";
import { useFormik } from "formik";

import DeleteModal from "../../../Components/Common/DeleteModal";

const TicketsData = () => {
    const dispatch = useDispatch();

    const { ticketsList } = useSelector((state) => ({
        ticketsList: state.Tickets.ticketsList,
    }));

    const [isEdit, setIsEdit] = useState(false);
    const [ticket, setTicket] = useState([]);

    // Delete Tickets
    const [deleteModal, setDeleteModal] = useState(false);
    const [modal, setModal] = useState(false);

    const toggle = useCallback(() => {
        if (modal) {
            setModal(false);
            setTicket(null);
        } else {
            setModal(true);
        }
    }, [modal]);

    // validation
    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            ticketId: (ticket && ticket.ticketId) || '',
            title: (ticket && ticket.title) || '',
            client: (ticket && ticket.client) || '',
            assigned: (ticket && ticket.assigned) || '',
            createDate: (ticket && ticket.createDate) || '',
            dueDate: (ticket && ticket.dueDate) || '',
            status: (ticket && ticket.status) || '',
            priority: (ticket && ticket.priority) || '',
        },
        validationSchema: Yup.object({
            ticketId: Yup.string().required("Please Enter ticketId"),
            title: Yup.string().required("Please Enter Title"),
            client: Yup.string().required("Please Enter Client Name"),
            assigned: Yup.string().required("Please Enter Assigned Name"),
            createDate: Yup.string().required("Please Enter Create Date"),
            dueDate: Yup.string().required("Please Enter Your Due Date"),
            status: Yup.string().required("Please Enter Your Joining status"),
            priority: Yup.string().required("Please Enter Your Priority")
        }),
        onSubmit: (values) => {
            if (isEdit) {

                const updateTickets = {
                    id: ticket ? ticket.id : 0,
                    ticketId: values.ticketId,
                    title: values.title,
                    client: values.client,
                    assigned: values.assigned,
                    createDate: values.createDate,
                    dueDate: values.dueDate,
                    status: values.status,
                    priority: values.priority,
                };
                // update ticket
                dispatch(updateTicket(updateTickets));
                validation.resetForm();
            } else {

                const newTicket = {
                    id: Math.floor(Math.random() * (30 - 20)) + 20,
                    ticketId: values["ticketId"],
                    title: values["title"],
                    client: values["client"],
                    assigned: values["assigned"],
                    createDate: values["createDate"],
                    dueDate: values["dueDate"],
                    status: values["status"],
                    priority: values["priority"],
                };
                // save new ticket
                dispatch(addNewTicket(newTicket));
                validation.resetForm();
            }
            toggle();
        },
    });

    // Delete Data
    const onClickDelete = (ticket) => {
        setTicket(ticket);
        setDeleteModal(true);
    };

    const handleDeleteTicket = () => {
        if (ticket.id) {
            dispatch(deleteTicket(ticket));
            setDeleteModal(false);
        }
    };

    // Update Data
    const handleTicketsClick = useCallback((arg) => {
        const ticket = arg;

        setTicket({
            id: ticket.id,
            ticketId: ticket.ticketId,
            title: ticket.title,
            client: ticket.client,
            assigned: ticket.assigned,
            createDate: ticket.createDate,
            dueDate: ticket.dueDate,
            status: ticket.status,
            priority: ticket.priority
        });

        setIsEdit(true);
        toggle();
    }, [toggle]);

    // Get Data
    useEffect(() => {
        dispatch(getTicketsList());
    }, [dispatch]);

    useEffect(() => {
        if (ticketsList && !ticketsList.length) {
            dispatch(getTicketsList());
        }
    }, [dispatch, ticketsList]);


    useEffect(() => {
        setTicket(ticketsList);
    }, [ticketsList]);

    useEffect(() => {
        if (!isEmpty(ticketsList)) {
            setTicket(ticketsList);
            setIsEdit(false);
        }
    }, [ticketsList]);

    // Add Data
    const handleTicketsClicks = () => {
        setTicket("");
        setIsEdit(false);
        toggle();
    };


    const columns = useMemo(
        () => [
            {
                Header: "#",
                Cell: () => {
                    return <Input type="checkbox" />;
                },
            },
            {
                Header: "ID",
                accessor: "ticketId",
                filterable: false,
                Cell: (cellProps) => {
                    return <TicketsId {...cellProps} />;
                },
            },
            {
                Header: "Title",
                accessor: "title",
                filterable: false,
                Cell: (cellProps) => {
                    return <Title {...cellProps} />;
                },
            },
            {
                Header: "Client",
                accessor: "client",
                filterable: false,
                Cell: (cellProps) => {
                    return <Client {...cellProps} />;
                },
            },
            {
                Header: "Assigned To",
                accessor: "assigned",
                filterable: false,
                Cell: (cellProps) => {
                    return <AssignedTo {...cellProps} />;
                },
            },
            {
                Header: "Create Date",
                accessor: "createDate",
                filterable: false,
                Cell: (cellProps) => {
                    return <CreateDate {...cellProps} />;
                },
            },
            {
                Header: "Due Date",
                accessor: "dueDate",
                filterable: false,
                Cell: (cellProps) => {
                    return <DueDate {...cellProps} />;
                },
            },
            {
                Header: "Status",
                accessor: "status",
                filterable: false,
                Cell: (cellProps) => {
                    return <Status {...cellProps} />;
                },
            },
            {
                Header: "Priority",
                accessor: "priority",
                filterable: false,
                Cell: (cellProps) => {
                    return <Priority {...cellProps} />;
                },
            },
            {
                Header: "Actions",
                Cell: (cellProps) => {
                    return (
                        <UncontrolledDropdown>
                            <DropdownToggle tag="a" className="btn btn-soft-secondary btn-sm">
                                <i className="ri-more-fill align-middle"></i>
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-end">
                                <li><DropdownItem href="/apps-tickets-details"><i className="ri-eye-fill align-bottom me-2 text-muted"></i> View</DropdownItem></li>
                                <li><DropdownItem className="edit-item-btn" href="#showModal" onClick={() => { const TicketData = cellProps.row.original; handleTicketsClick(TicketData); }}><i className="ri-pencil-fill align-bottom me-2 text-muted"></i> Edit</DropdownItem></li>
                                <li>
                                    <DropdownItem className="remove-item-btn" data-bs-toggle="modal" href="#deleteOrder"
                                        onClick={() => {
                                            const ticketData = cellProps.row.original;
                                            onClickDelete(ticketData);
                                        }}>
                                        <i className="ri-delete-bin-fill align-bottom me-2 text-muted"></i> Delete
                                    </DropdownItem>
                                </li>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    );
                },
            },
        ],
        [handleTicketsClick]
    );
    return (
        <React.Fragment>
            <Row>
                <DeleteModal
                    show={deleteModal}
                    onDeleteClick={handleDeleteTicket}
                    onCloseClick={() => setDeleteModal(false)}
                />
                <Col lg={12}>
                    <Card>
                        <CardHeader className="border-0">
                            <div className="d-flex align-items-center">
                                <h5 className="card-title mb-0 flex-grow-1">Tickets</h5>
                                <div className="flex-shrink-0">
                                    <button className="btn btn-danger add-btn" onClick={() => { setIsEdit(false); toggle(); }}><i className="ri-add-line align-bottom"></i> Create Tickets</button>
                                    {" "}<button className="btn btn-soft-danger"
                                    // onClick="deleteMultiple()"
                                    ><i className="ri-delete-bin-2-line"></i></button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="border border-dashed border-end-0 border-start-0">
                            <form>
                                <Row className="g-3">
                                    <Col xxl={5} sm={12}>
                                        <div className="search-box">
                                            <Input type="text" className="form-control search bg-light border-light" placeholder="Search for ticket details or something..." />
                                            <i className="ri-search-line search-icon"></i>
                                        </div>
                                    </Col>

                                    <Col xxl={3} sm={4}>
                                        <Flatpickr
                                            className="form-control"
                                            options={{
                                                mode: "range",
                                                dateFormat: "d M, Y"
                                            }}
                                        />
                                    </Col>

                                    <Col xxl={3} sm={4}>
                                        <div className="input-light">
                                            <select className="form-control" data-choices data-choices-search-false name="choices-single-default" id="idStatus">
                                                <option value="">Status</option>
                                                <option defaultValue="all">All</option>
                                                <option value="Open">Open</option>
                                                <option value="Inprogress">Inprogress</option>
                                                <option value="Closed">Closed</option>
                                                <option value="New">New</option>
                                            </select>
                                        </div>
                                    </Col>
                                    <Col xxl={1} sm={4}>
                                        <button type="button" className="btn btn-primary w-100"> <i className="ri-equalizer-fill me-1 align-bottom"></i>
                                            Filters
                                        </button>
                                    </Col>
                                </Row>
                            </form>
                        </CardBody>
                        <CardBody>
                            <TableContainer
                                columns={columns}
                                data={ticketsList}
                                isGlobalFilter={false}
                                isAddUserList={false}
                                customPageSize={8}
                                className="custom-header-css"
                                divClass="table-responsive table-card mb-4"
                                tableClass="align-middle table-nowrap mb-0"
                                theadClass=""
                                thClass=""
                                handleTicketClick={handleTicketsClicks}
                            />
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Modal
                isOpen={modal}
                toggle={toggle}
                centered
                size="lg"
                className="border-0"
                modalClassName="zoomIn"
            >

                <ModalHeader toggle={toggle} className="p-3 bg-soft-info">
                    {!!isEdit ? "Edit Ticket" : "Add Ticket"}
                </ModalHeader>
                <Form onSubmit={(e) => {
                    e.preventDefault();
                    validation.handleSubmit();
                    return false;
                }}>
                    <ModalBody>
                        <Row className="g-3">
                            <Col lg={12}>
                                <div id="modal-id">
                                    <Label htmlFor="orderId" className="form-label">ID</Label>
                                    <Input
                                        name="ticketId"
                                        id="orderId"
                                        className="form-control"
                                        placeholder="Enter Order Id"
                                        type="text"
                                        validate={{
                                            required: { value: true },
                                        }}
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.ticketId || ""}
                                        invalid={
                                            validation.touched.ticketId && validation.errors.ticketId ? true : false
                                        }
                                    />
                                    {validation.touched.ticketId && validation.errors.ticketId ? (
                                        <FormFeedback type="invalid">{validation.errors.ticketId}</FormFeedback>
                                    ) : null}
                                </div>
                            </Col>
                            <Col lg={12}>
                                <div>
                                    <Label htmlFor="tasksTitle-field" className="form-label">Title</Label>
                                    <Input
                                        name="title"
                                        id="tasksTitle-field"
                                        className="form-control"
                                        placeholder="Enter Title"
                                        type="text"
                                        validate={{
                                            required: { value: true },
                                        }}
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.title || ""}
                                        invalid={
                                            validation.touched.title && validation.errors.title ? true : false
                                        }
                                    />
                                    {validation.touched.title && validation.errors.title ? (
                                        <FormFeedback type="invalid">{validation.errors.title}</FormFeedback>
                                    ) : null}
                                </div>
                            </Col>
                            <Col lg={6}>
                                <div>
                                    <Label htmlFor="client_nameName-field" className="form-label">Client</Label>
                                    <Input
                                        name="client"
                                        type="text"
                                        id="client_nameName-field"
                                        placeholder="Enter Client Name"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.client || ""}
                                        invalid={
                                            validation.touched.client && validation.errors.client ? true : false
                                        }
                                    />
                                    {validation.touched.client && validation.errors.client ? (
                                        <FormFeedback type="invalid">{validation.errors.client}</FormFeedback>
                                    ) : null}
                                </div>
                            </Col>
                            <Col lg={6}>
                                <div>
                                    <Label htmlFor="assignedtoName-field" className="form-label">Assigned To</Label>
                                    <Input
                                        name="assigned"
                                        type="text"
                                        id="assignedtoName-field"
                                        placeholder="Enter Assigned Name"
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.assigned || ""}
                                        invalid={
                                            validation.touched.assigned && validation.errors.assigned ? true : false
                                        }
                                    />
                                    {validation.touched.assigned && validation.errors.assigned ? (
                                        <FormFeedback type="invalid">{validation.errors.assigned}</FormFeedback>
                                    ) : null}
                                </div>
                            </Col>
                            <Col lg={6}>
                                <Label htmlFor="date-field" className="form-label">Create Date</Label>
                                <Input
                                    name="createDate"
                                    type="date"
                                    id="date-field"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.createDate || ""}
                                    invalid={
                                        validation.touched.createDate && validation.errors.createDate ? true : false
                                    }
                                />
                                {validation.touched.createDate && validation.errors.createDate ? (
                                    <FormFeedback type="invalid">{validation.errors.createDate}</FormFeedback>
                                ) : null}
                            </Col>
                            <Col lg={6}>
                                <Label htmlFor="duedate-field" className="form-label">Due Date</Label>
                                <Input
                                    name="dueDate"
                                    type="date"
                                    id="date-field"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.dueDate || ""}
                                    invalid={
                                        validation.touched.dueDate && validation.errors.dueDate ? true : false
                                    }
                                />
                                {validation.touched.dueDate && validation.errors.dueDate ? (
                                    <FormFeedback type="invalid">{validation.errors.dueDate}</FormFeedback>
                                ) : null}
                            </Col>
                            <Col lg={6}>
                                <Label htmlFor="ticket-status" className="form-label">Status</Label>
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
                                    <option value="">Status</option>
                                    <option value="New">New</option>
                                    <option value="Inprogress">Inprogress</option>
                                    <option value="Closed">Closed</option>
                                    <option value="Open">Open</option>
                                </Input>
                                {validation.touched.status &&
                                    validation.errors.status ? (
                                    <FormFeedback type="invalid">
                                        {validation.errors.status}
                                    </FormFeedback>
                                ) : null}
                            </Col>
                            <Col lg={6}>
                                <Label htmlFor="priority-field" className="form-label">Priority</Label>
                                <Input
                                    name="priority"
                                    type="select"
                                    className="form-select"
                                    id="priority-field"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={
                                        validation.values.priority || ""
                                    }
                                >
                                    <option value="">Priority</option>
                                    <option value="High">High</option>
                                    <option value="Medium">Medium</option>
                                    <option value="Low">Low</option>
                                </Input>
                                {validation.touched.priority &&
                                    validation.errors.priority ? (
                                    <FormFeedback type="invalid">
                                        {validation.errors.priority}
                                    </FormFeedback>
                                ) : null}
                            </Col>
                        </Row>

                    </ModalBody>
                    <div className="modal-footer">
                        <div className="hstack gap-2 justify-content-end">
                            <button onClick={() => { setModal(false); }} type="button" className="btn btn-light" data-bs-dismiss="modal">Close</button>
                            <button type="submit" className="btn btn-success" id="add-btn">{!!isEdit ? "Update" : "Add Ticket"}</button>
                        </div>
                    </div>
                </Form>
            </Modal>
        </React.Fragment>
    );
};

export default TicketsData;