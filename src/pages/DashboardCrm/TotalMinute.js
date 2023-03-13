import React from 'react';
import { Card, CardBody, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { BarChart } from '../Charts/ChartsJs/ChartsJs';

const TotalMinute = () => {
  return (
    <React.Fragment>
      <Col xl={6}>
        <Card>
          <CardHeader className="align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">Tổng phút gọi theo tháng</h4>
          <div className="flex-shrink-0">
            <UncontrolledDropdown className="card-header-dropdown">
              <DropdownToggle className="text-reset dropdown-btn" tag="a" role="button">
                <span className="fw-semibold text-uppercase fs-12">Sort by: </span><span className="text-muted">Current Year<i className="mdi mdi-chevron-down ms-1"></i></span>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem>Today</DropdownItem>
                <DropdownItem>Last Week</DropdownItem>
                <DropdownItem>Last Month</DropdownItem>
                <DropdownItem>Current Year</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
          </CardHeader>
          <CardBody>
            <BarChart dataColors='["--vz-primary-rgb, 0.8", "--vz-primary-rgb, 0.9"]' />
          </CardBody>
        </Card>
      </Col>
    </React.Fragment>
  )
}

export default React.memo(TotalMinute)