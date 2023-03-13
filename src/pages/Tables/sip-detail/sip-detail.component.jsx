import React, { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import {
  Button,
  Col,
  Container,
  FormFeedback,
  Input,
  Label,
  Row,
} from 'reactstrap';
import BreadCrumb from '../../../Components/Common/BreadCrumb';
import LoadingComponent from '../../../Components/Common/loading.component';
import * as moment from 'moment';
import { SipTotalAPI } from '../../../api/sip-detail.api';

const SipTotalDetailPage = () => {
  const [loading, setLoading] = useState(false);
  const [dateTime, setDateTime] = useState({
    startDate: '',
    endDate: '',
  });
  const [hotline, setHotline] = useState('');
  const [blurInput, setBlurInput] = useState(false);
  const [blurDatePicker, setBlurDatePicker] = useState(false);

  const handleChangeDate = (value) => {
    if (value?.length === 2) {
      setDateTime({
        startDate: moment(value[0]).format('YYYY-MM-DD'),
        endDate: moment(value[1]).format('YYYY-MM-DD'),
      });
    } else {
      if (dateTime.startDate || dateTime.endDate) {
        setDateTime({ startDate: '', endDate: '' });
      }
    }
  };

  const handleChangeName = (event) => {
    setHotline(event.target.value);
  };

  const handleSubmit = async () => {
    if (!dateTime.startDate || !dateTime.endDate || !hotline) {
      setBlurInput(true);
      setBlurDatePicker(true);
      return;
    }

    try {
      setLoading(true);
      const response = await SipTotalAPI.getSipTotalList(
        dateTime.startDate,
        dateTime.endDate,
        hotline
      );
      //TODO: Handle data here
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleBlurInput = () => {
    setBlurInput(true);
  };

  const handleBlurDatePicker = () => {
    setBlurDatePicker(true);
  };

  document.title = 'Sip Detail';

  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <div className='page-content'>
        <Container fluid>
          <BreadCrumb title='Report' pageTitle='Tables' />
          <Row>
            <Col lg={6}>
              <Label className='form-label mb-0'>Date</Label>
              <Flatpickr
                onChange={handleChangeDate}
                className='form-control'
                placeholder='Pick Date'
                onBlur={handleBlurDatePicker}
                options={{
                  mode: 'range',
                  dateFormat: 'Y-m-d',
                }}
              />
              {(!dateTime.startDate || !dateTime.endDate) && blurDatePicker ? (
                <p className='invalid-message'>Please pick Date</p>
              ) : null}
            </Col>

            <Col lg={6}>
              <Label htmlFor='hotline' className='form-label mb-0'>
                Hotline
              </Label>
              <Input
                name='hotline'
                onChange={handleChangeName}
                className='form-control'
                placeholder='Enter Hotline'
                onBlur={handleBlurInput}
                invalid={!hotline && blurInput}
              />
              {!hotline && blurInput ? (
                <FormFeedback type='invalid'>Please enter Hotline</FormFeedback>
              ) : null}
            </Col>

            <Col lg={3}>
              <Button color='primary' className='mt-3' onClick={handleSubmit}>
                Submit
              </Button>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SipTotalDetailPage;
