import React from 'react';
import { Container, Row } from 'reactstrap';

import Section from './Section';
import TicketDescription from './TicketDescription';
import TicketDetails from './TicketDetails';
import MetaTags from 'react-meta-tags';


const TicketsDetaiks = () => {
    document.title = "Ticket Details | Velzon - React Admin & Dashboard Template";
    return (
        <React.Fragment>
            <div className="page-content">

                <Container fluid>
                    <Row>
                        <Section />
                    </Row>
                    <Row>
                        <TicketDescription />
                        <TicketDetails />
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default TicketsDetaiks;