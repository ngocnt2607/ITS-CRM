import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button, Col, Modal, ModalHeader, Row, Label, Input } from 'reactstrap';
import * as Yup from 'yup';
import { UserListAPI } from '../../../../api/user-list.api';
import { ChangePassAPI } from '../../../../api/change-pass.api';
import addToast from '../../../../Components/Common/add-toast.component';
import CustomInputComponent from '../../../../Components/Common/custom-input.component';
import LoadingComponent from '../../../../Components/Common/loading.component';
import { Message } from '../../../../shared/const/message.const';
import CustomSelectComponent from '../../../../Components/Common/custom-select/custom-select.component';
import {
  generateOption,
  getListOption,
} from '../../../../helpers/array.helper';

const INIT = {
  username: '',
  password: '',
};

function AddChange({
  isOpen,
  getList,
  close,
  updateRecord,
  isViewMode,
}) {
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const [initialValues, setInitialValues] = useState(INIT);
  const [listData, setListData] = useState({
    usernames: [],
  });
  const validationSchema = useRef(
    Yup.object({
      username: Yup.object().required('Vui lòng chọn tên đăng nhập'),
      password: Yup.string(),
    })
  ).current;

  useEffect(() => {
    if (updateRecord) {
      const {
        username,
        password,
      } = updateRecord;
      setInitialValues({
        username: generateOption(username, username),
        password,
      });
      return;
    }
    setInitialValues(INIT);
  }, [updateRecord]);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (updateRecord) {
        await UserListAPI.updateUser({
          ...values,
          username: values.username?.value,
          id: updateRecord.id,
        });
      } else {
        await ChangePassAPI.createNewPassword({
          ...values,
          username: values.username?.value,
        });
      }
      addToast({
        message: updateRecord ? Message.UPDATE_SUCCESS : Message.CHANGE_PASSWORD_SUCCESS,
        type: 'success',
      });

      if (getList) {
        await getList();
      }
      setLoading(false);
      handleClose();
    } catch (error) {
      setLoading(false);
    }
  };

  const handleClose = () => {
    formRef.current.resetForm();
    close && close();
  };

  const getListData = useCallback(async () => {
    const listAPI = [
      UserListAPI.getUserList,
    ];
    try {
      setLoading(true);
      const response = await Promise.all(listAPI.map((api) => api()));
      setListData((prev) => ({
        ...prev,
        usernames: getListOption(response[0]?.data, 'username', 'username'),
      }));
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getListData();
  }, [getListData]);

  return (
    <>
      {loading && <LoadingComponent open={loading} />}

      <Modal
        isOpen={isOpen}
        onClosed={handleClose}
        modalClassName='flip'
        centered
      >
        <ModalHeader>
          {isViewMode
            ? 'Xem tài khoản'
            : updateRecord
            ? 'Cập nhật tài khoản'
            : 'Đổi mật khẩu'}
          <Button
            type='button'
            onClick={handleClose}
            className='btn-close'
            aria-label='Close'
          ></Button>
        </ModalHeader>

        <div className='modal-body'>
          <Formik
            enableReinitialize
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            innerRef={formRef}
          >
            <Form>
              <Row>
                <div className='mb-3'>
                  <CustomSelectComponent
                    name='username'
                    options={listData.usernames}
                    label='Tên đăng nhập'
                    placeholder='Vui lòng chọn tên đăng nhập'
                    disabled={isViewMode}
                  />
                </div>

                <div className='mb-3'>
                  <CustomInputComponent
                    name='password'
                    label='Mật khẩu mới'
                    type='password'
                    className='form-control pe-5'
                    placeholder='Vui lòng nhập mật khẩu'
                    disabled={isViewMode}
                    isDisabled={isViewMode || !!updateRecord}
                  />
                </div>

                {/* <div className='mb-3'>
                <Label className='form-label' htmlFor='password-input'
                >
                  Mật khẩu
                </Label>
                <Input
                    name='password'
                    type='password'
                    className='form-control pe-5'
                    placeholder='Vui lòng điền mật khẩu'
                  />
                </div> */}
              </Row>

              {!isViewMode && (
                <div className='hstack gap-2 justify-content-end mt-3'>
                  <Button color='light' onClick={handleClose}>
                    Close
                  </Button>
                  <Button color='primary' type='submit'>
                    Submit
                  </Button>
                </div>
              )}
            </Form>
          </Formik>
        </div>
      </Modal>
    </>
  );
}

AddChange.propTypes = {
  openModal: PropTypes.bool,
  getList: PropTypes.func,
  close: PropTypes.func,
  updateRecord: PropTypes.any,
  isViewMode: PropTypes.bool,
};

export default React.memo(AddChange);
