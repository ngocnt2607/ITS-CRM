import React from 'react';
import { Container, Row } from 'reactstrap';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import KYC from './KYCVerification';
import MetaTags from 'react-meta-tags';


const KYCVerification = () => {
    document.title = "KYC Application | Velzon - React Admin & Dashboard Template";
    return (
        <React.Fragment>
            <div className="page-content">

                <Container fluid>
                    <BreadCrumb title="KYC Application" pageTitle="Crypto" />
                    <Row>
                        <KYC />
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    );
};

export default KYCVerification;