import React, { useLayoutEffect, useRef } from 'react';
import { Form, Formik } from 'formik';
import { Button, Col, Modal, ModalHeader, Row } from 'reactstrap';
import * as Yup from 'yup';
import { useCallback } from 'react';
import { useState } from 'react';
import { PartnerDetailAPI } from '../../../../../api/partnerdetail.api';
import { useEffect } from 'react';
import {
  generateOption,
  getListOption,
} from '../../../../../helpers/array.helper';
import LoadingComponent from '../../../../../Components/Common/loading.component';
import CustomSelectComponent from '../../../../../Components/Common/custom-select/custom-select.component';

const INIT = {
  ip: null,
  partner: null,
  account: null,
  telco: null,
  mapping: [],
  routing: [],
  type: null,
};

const AddPartnerDetailModal = ({
  isOpen,
  close,
  updateRecord,
  refreshListData,
  isViewMode,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedIP, setSelectedIP] = useState('');
  const [selectedTelco, setSelectedTelco] = useState('');
  const [listData, setListData] = useState({
    ips: [],
    telcos: [],
    partners: [],
  });
  const [listMappingRouting, setListMappingRouting] = useState({
    mappings: [],
    routings: [],
  });
  const [listAccount, setListAccount] = useState([]);
  const formRef = useRef();
  const schema = useRef(
    Yup.object({
      ip: Yup.object().nullable().required('Required'),
      partner: Yup.object().nullable().required('Required'),
      account: Yup.object().nullable().required('Required'),
      telco: Yup.object().nullable(),
      mapping: Yup.array(),
      routing: Yup.array(),
      type: Yup.object().nullable(),
    })
  ).current;
  const [initialValues, setInitialValues] = useState(INIT);
  const TYPE_OPTION = useRef([
    { label: 'Call in', value: 'callin' },
    { label: 'Call out', value: 'callout' },
  ]).current;

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const data = {
        ip: values.ip?.value,
        telco: values.telco?.value || '',
        partner: values.partner?.value,
        account: values.account?.value,
        mapping: values.mapping?.map((item) => item?.value)?.join(','),
        type: values.type?.value || '',
        routing: values.routing?.map((item) => item?.value)?.join(','),
      };
      if (updateRecord) {
        await PartnerDetailAPI.updatePartnerDetail({
          ...data,
          id: updateRecord.id,
        });
      } else {
        await PartnerDetailAPI.createNewPartnerDetail(data);
      }

      await refreshListData();
      close();
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const getListData = useCallback(async () => {
    const listAPI = [
      PartnerDetailAPI.getListIP,
      PartnerDetailAPI.getPartner,
      PartnerDetailAPI.getTelco,
    ];
    try {
      setLoading(true);
      const response = await Promise.all(listAPI.map((api) => api()));
      setListData((prev) => ({
        ...prev,
        ips: getListOption(response[0]?.data, 'ip', 'ip'),
        partners: getListOption(response[1]?.data, 'nickname', 'nickname'),
        telcos: getListOption(response[2]?.data, 'name', 'name'),
      }));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListData();
  }, [getListData]);

  useLayoutEffect(() => {
    const handleCallAPI = async () => {
      const listAPI1 = [
        PartnerDetailAPI.getMapping,
        PartnerDetailAPI.getRouting,
      ];
      try {
        setLoading(true);
        const response = await Promise.all(
          listAPI1.map((api) => api(selectedIP, selectedTelco))
        );
        setListMappingRouting({
          mappings: getListOption(response[0]?.data, 'name', 'name'),
          routings: getListOption(response[1]?.data, 'name', 'name'),
        });
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    if (formRef.current) {
      formRef.current.setFieldValue('routing', []);
      formRef.current.setFieldValue('mapping', []);
    }
    if (selectedIP && selectedTelco) {
      handleCallAPI();
    } else {
      setListMappingRouting({
        mappings: [],
        routings: [],
      });
    }
  }, [selectedIP, selectedTelco]);

  useLayoutEffect(() => {
    const handleCallAPI = async () => {
      const listAPI2 = [PartnerDetailAPI.getAccount];
      try {
        setLoading(true);
        const response = await Promise.all(
          listAPI2.map((api) => api(selectedIP))
        );
        setListAccount(getListOption(response[0]?.data, 'name', 'name'));
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    if (formRef.current) {
      formRef.current.setFieldValue('account', null);
    }
    if (selectedIP) {
      handleCallAPI();
    } else {
      setListAccount([]);
    }
  }, [selectedIP]);

  useEffect(() => {
    if (updateRecord) {
      const { account, ip, mapping, partner, routing, telco, type } =
        updateRecord;
      setSelectedIP(ip);
      setSelectedTelco(telco);
      setInitialValues({
        ip: generateOption(ip, ip),
        account: generateOption(account, account),
        mapping:
          mapping?.split(',')?.map((item) => generateOption(item, item)) || [],
        partner: generateOption(partner, partner),
        routing:
          routing?.split(',').map((item) => generateOption(item, item)) || [],
        telco: generateOption(telco, telco),
        type: generateOption(type, type),
      });
    }
  }, [updateRecord]);

  const handleClose = () => {
    formRef.current.resetForm();
    setInitialValues(INIT);
    close();
  };

  const handleChangeSelectedIP = (value) => {
    setSelectedIP(value);
  };

  const handleChangeSelectedTelco = (value) => {
    setSelectedTelco(value);
  };

  return (
    <>
      <LoadingComponent open={loading} />
      <Modal
        isOpen={isOpen}
        onClosed={handleClose}
        modalClassName='flip'
        centered
      >
        <ModalHeader>
          {isViewMode? 'Xem chi tiết Partner'
            : updateRecord ? 'Update Partner Detail' : 'Create New Partner Detail'}
          <Button
            type='button'
            onClick={handleClose}
            className='btn-close'
            aria-label='Close'
          ></Button>
        </ModalHeader>
        <div className='modal-body'>
          <Formik
            enableReinitialize={true}
            innerRef={formRef}
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={handleSubmit}
          >
            {
              <Form>
                <Row>
                  <Col xs='12' className='mb-3'>
                    <CustomSelectComponent
                      name='ip'
                      options={listData.ips}
                      label='IP VOS'
                      onChange={handleChangeSelectedIP}
                    />
                  </Col>

                  <Col xs='12' className='mb-3'>
                    <CustomSelectComponent
                      name='partner'
                      options={listData.partners}
                      label='Đối tác'
                    />
                  </Col>

                  <Col xs='12' className='mb-3'>
                    <CustomSelectComponent
                      name='account'
                      options={listAccount}
                      label='Tài khoản'
                    />
                  </Col>

                  <Col xs='12' className='mb-3'>
                    <CustomSelectComponent
                      name='telco'
                      options={listData.telcos}
                      label='Nhà mạng'
                      onChange={handleChangeSelectedTelco}
                    />
                  </Col>

                  <Col xs='12' className='mb-3'>
                    <CustomSelectComponent
                      name='mapping'
                      options={listMappingRouting.mappings}
                      label='Mapping gateway'
                      isAll
                      isMulti
                    />
                  </Col>

                  <Col xs='12' className='mb-3'>
                    <CustomSelectComponent
                      name='routing'
                      options={listMappingRouting.routings}
                      label='Routing gateway'
                      isAll
                      isMulti
                    />
                  </Col>

                  <Col xs='12' className='mb-3'>
                    <CustomSelectComponent
                      name='type'
                      options={TYPE_OPTION}
                      label='Kiểu gọi'
                    />
                  </Col>

                {!isViewMode && (
                  <Col xs='12'>
                    <div className='hstack gap-2 justify-content-end'>
                      <Button color='light' onClick={handleClose} type='button'>
                        Close
                      </Button>
                      <Button color='primary' type='submit'>
                        Submit
                      </Button>
                    </div>
                  </Col>
                )}
                </Row>
              </Form>
            }
          </Formik>
        </div>
      </Modal>
    </>
  );
};

export default React.memo(AddPartnerDetailModal);
