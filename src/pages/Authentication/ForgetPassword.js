import PropTypes from "prop-types";
import MetaTags from "react-meta-tags";
import React from "react";
import { Row, Col, Alert, Card, CardBody, Container, FormFeedback, Input, Label, Form } from "reactstrap";

//redux
import { useSelector, useDispatch } from "react-redux";
import { useState } from 'react';

import { withRouter, Link } from "react-router-dom";
import LoadingComponent from '../../Components/Common/loading.component';
import addToast from '../../Components/Common/add-toast.component';
import { Message } from '../../shared/const/message.const';

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

// action
import { userForgetPassword } from "../../store/actions";
import { ResetAPI } from '../../api/reset-password.api';

// import images
// import profile from "../../assets/images/bg.png";
import logoLight from "../../assets/images/logo-its.png";
import ParticlesAuth from "../AuthenticationInner/ParticlesAuth";

const ForgetPasswordPage = props => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Vui lòng nhập Email"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const result = await ResetAPI.reset(
          values.email,
        );
        dispatch(userForgetPassword(result));
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    },
  });

  const { forgetError, forgetSuccessMsg } = useSelector(state => ({
    forgetError: state.ForgetPassword.forgetError,
    forgetSuccessMsg: state.ForgetPassword.forgetSuccessMsg,
  }));
  document.title = "Reset Password | ITS CRM";
  return (
    <ParticlesAuth>
      <div className="auth-page-content">

        <Container>
          <Row>
            <Col lg={12}>
              <div className="text-center mt-sm-5 mb-4 text-white-50">
                <div>
                  <Link to="/" className="d-inline-block auth-logo">
                    <img src={logoLight} alt="" height="120" />
                  </Link>
                </div>
                <p className="mt-3 fs-15 fw-medium"></p>
              </div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col md={8} lg={6} xl={5}>
              <Card className="mt-4">

                <CardBody className="p-4">
                  <div className="text-center mt-2">
                    <h5 className="text-primary">Quên mật khẩu?</h5>
                    {/* <p className="text-muted">Reset password with velzon</p> */}

                    <lord-icon
                      src="https://cdn.lordicon.com/rhvddzym.json"
                      trigger="loop"
                      colors="primary:#0ab39c"
                      className="avatar-xl"
                      style={{ width: "120px", height: "120px" }}
                    >
                    </lord-icon>

                  </div>

                  <Alert className="alert-borderless alert-warning text-center mb-2 mx-2" role="alert">
                    Nhập email của bạn và mật khẩu mới sẽ được gửi đến email của bạn!
                  </Alert>
                  <div className="p-2">
                    {forgetError && forgetError ? (
                      <Alert color="danger" style={{ marginTop: "13px" }}>
                        {forgetError}
                      </Alert>
                    ) : null}
                    {forgetSuccessMsg ? (
                      <Alert color="success" style={{ marginTop: "13px" }}>
                        {forgetSuccessMsg}
                      </Alert>
                    ) : null}
                    <Form
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        addToast({ message: Message.SEND_MAIL_SUCCESS, type: 'success' });
                        return false;
                      }}
                    >
                      <div className="mb-4">
                        <Label className="form-label">Email</Label>
                        <Input
                          name="email"
                          className="form-control"
                          placeholder="Vui lòng nhập email"
                          type="email"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.email || ""}
                          invalid={
                            validation.touched.email && validation.errors.email ? true : false
                          }
                        />
                        {validation.touched.email && validation.errors.email ? (
                          <FormFeedback type="invalid"><div>{validation.errors.email}</div></FormFeedback>
                        ) : null}
                      </div>

                      <div className="text-center mt-4">
                        <button className="btn btn-success w-100" type="submit">Đặt lại mật khẩu</button>
                      </div>
                    </Form>
                  </div>
                </CardBody>
              </Card>

              <div className="mt-4 text-center">
                <p className="mb-0">Tôi đã nhớ lại mật khẩu... <Link to="/login" className="fw-semibold text-primary text-decoration-underline"> Quay lại </Link> </p>
              </div>

            </Col>
          </Row>
        </Container>
      </div>
    </ParticlesAuth>
  );
};

ForgetPasswordPage.propTypes = {
  history: PropTypes.object,
};

export default withRouter(ForgetPasswordPage);
