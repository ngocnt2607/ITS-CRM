import React from 'react';
import { Container, Row, Card, Col, CardHeader, CardBody } from 'reactstrap';
import BreadCrumb from '../../Components/Common/BreadCrumb';
import { BarChart } from '../Charts/ChartsJs/ChartsJs';
import BalanceOverview from './BalanceOverview';
import ClosingDeals from './ClosingDeals';
import DealsStatus from './DealsStatus';
import MyTasks from './MyTasks';
import TotalMinute from './TotalMinute';
import UpcomingActivities from './UpcomingActivities';
import Widgets from './Widgets';

const DashboardCrm = () => {
    document.title = "CRM | Velzon - React Admin & Dashboard Template";
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb title="CRM" pageTitle="Dashboards" />
                    <Row>
                        <Widgets />
                    </Row>
                    <Row>
                      <TotalMinute />
                      <BalanceOverview />
                    </Row>
                    <Row>
                        <DealsStatus />
                        <MyTasks />
                    </Row>
                    <Row>
                        <UpcomingActivities />
                        <ClosingDeals />
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default DashboardCrm;