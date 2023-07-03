import React from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
} from 'reactstrap';
import ParticlesAuth from '../AuthenticationInner/ParticlesAuth';
// import addToast from '../../Components/Common/add-toast.component';
// import { Message } from '../../shared/const/message.const';

//redux
import { useDispatch, useSelector } from 'react-redux';

import { Link, withRouter } from 'react-router-dom';

// Formik validation
import { useFormik } from 'formik';
import * as Yup from 'yup';

//Social Media Imports
// import TwitterLogin from "react-twitter-auth"
// actions
import { loginSuccess, socialLogin } from '../../store/actions';

import logoLight from '../../assets/images/logo-its.png';
//Import config
import { useState } from 'react';
import { AuthenticationAPI } from '../../api/authentication.api';
import LoadingComponent from '../../Components/Common/loading.component';
import { ACCESS_TOKEN } from '../../shared/const/message.const';
import { UserRole } from '../../shared/const/user-role.const';
//import images

const Login = (props) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, handleShowPassword] = useState(false);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Vui lòng nhập tên đăng nhập'),
      password: Yup.string().required('Vui lòng nhập passwword'),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const result = await AuthenticationAPI.login(
          values.email,
          values.password
        );
        localStorage.setItem('authUser', JSON.stringify(result));
        localStorage.setItem(ACCESS_TOKEN, result.token);
        dispatch(loginSuccess(result));
        props.history.push('/home');
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    },
  });

  const { error } = useSelector((state) => ({
    error: state.Login.error,
  }));

  const signIn = (res, type) => {
    if (type === 'google' && res) {
      const postData = {
        name: res.profileObj.name,
        email: res.profileObj.email,
        token: res.tokenObj.access_token,
        idToken: res.tokenId,
      };
      dispatch(socialLogin(postData, props.history, type));
    } else if (type === 'facebook' && res) {
      const postData = {
        name: res.name,
        email: res.email,
        token: res.accessToken,
        idToken: res.tokenId,
      };
      dispatch(socialLogin(postData, props.history, type));
    }
  };

  //handleGoogleLoginResponse
  const googleResponse = (response) => {
    signIn(response, 'google');
  };

  //handleTwitterLoginResponse
  // const twitterResponse = e => {}

  //handleFacebookLoginResponse
  const facebookResponse = (response) => {
    signIn(response, 'facebook');
  };

  const handleChangeShowPassword = () => {
    handleShowPassword((isShow) => !isShow);
  };
  document.title = 'ITS Report';
  return (
    <React.Fragment>
      <LoadingComponent open={loading} />
      <ParticlesAuth>
        <div className='auth-page-content'>
          <Container>
            <Row>
              <Col lg={12}>
                <div className='text-center mt-sm-5 mb-4 text-white-50'>
                  <div>
                    <Link to='/' className='d-inline-block auth-logo'>
                      <img src={logoLight} alt='' height='120' />
                    </Link>
                  </div>
                  <p className='mt-3 fs-15 fw-medium'></p>
                </div>
              </Col>
            </Row>

            <Row className='justify-content-center'>
              <Col md={8} lg={6} xl={5}>
                <Card className='mt-4'>
                  <CardBody className='p-4'>
                    <div className='text-center mt-2'>
                      <h4 className='text-primary'>Chào mừng quay trở lại !</h4>
                      {/* <p className='text-muted'> Đăng nhập để truy cập vào Leeon Technology CRM</p> */}
                    </div>
                    <div className='p-2 mt-4'>
                      <Form
                        onSubmit={(e) => {
                          e.preventDefault();
                          validation.handleSubmit();
                          return false;
                        }}
                        action='#'
                      >
                        <div className='mb-3'>
                          <Label htmlFor='email' className='form-label'>
                            Tên đăng nhập
                          </Label>
                          <Input
                            name='email'
                            className='form-control'
                            placeholder='Vui lòng nhập tên đăng nhập'
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ''}
                            invalid={
                              validation.touched.email &&
                              validation.errors.email
                                ? true
                                : false
                            }
                          />
                          {validation.touched.email &&
                          validation.errors.email ? (
                            <FormFeedback type='invalid'>
                              {validation.errors.email}
                            </FormFeedback>
                          ) : null}
                        </div>

                        <div className='mb-3'>
                          <div className="float-end">
                            <Link to="/forgot-password" className="text-muted">Quên mật khẩu?</Link>
                          </div>
                          <Label
                            className='form-label'
                            htmlFor='password-input'
                          >
                            Mật khẩu
                          </Label>
                          <div className='position-relative auth-pass-inputgroup mb-3'>
                            <Input
                              name='password'
                              value={validation.values.password || ''}
                              type={showPassword ? 'text' : 'password'}
                              // type='password'
                              className='form-control pe-5'
                              placeholder='Vui lòng nhập mật khẩu'
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              invalid={
                                validation.touched.password &&
                                validation.errors.password
                                  ? true
                                  : false
                              }
                            />
                            {validation.touched.password &&
                            validation.errors.password ? (
                              <FormFeedback type='invalid'>
                                {validation.errors.password}
                              </FormFeedback>
                            ) : null}
                            <button
                              className='btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted shadow-none'
                              type='button'
                              id='password-addon'
                              onClick={handleChangeShowPassword}
                            >
                              <i className='ri-eye-fill align-middle'></i>
                            </button>
                          </div>
                        </div>
                        
                        <div className='form-check'>
                          <Input
                            className='form-check-input'
                            type='checkbox'
                            value=''
                            id='auth-remember-check'
                          />
                          <Label
                            className='form-check-label'
                            htmlFor='auth-remember-check'
                          >
                            Ghi nhớ
                          </Label>
                        </div>

                        <div className='mt-4'>
                          <Button                           
                            color='success'
                            className='btn btn-success w-100'
                            type='submit'
                          >
                            Đăng nhập
                          </Button>
                        </div>

                        {/* <div className="mt-4 text-center">
                                                    <div className="signin-other-title">
                                                        <h5 className="fs-13 mb-4 title">Sign In with</h5>
                                                    </div>
                                                    <div>
                                                        <FacebookLogin
                                                            appId={facebook.APP_ID}
                                                            autoLoad={false}
                                                            callback={facebookResponse}
                                                            render={renderProps => (
                                                                <Button color="primary"
                                                                    className="btn-icon me-1"
                                                                    onClick={renderProps.onClick}
                                                                >
                                                                    <i className="ri-facebook-fill fs-16" />
                                                                </Button>
                                                            )}
                                                        />
                                                        <GoogleLogin
                                                            clientId={
                                                                google.CLIENT_ID ? google.CLIENT_ID : ""
                                                            }
                                                            render={renderProps => (
                                                                <Button color="danger"
                                                                    to="#"
                                                                    className="btn-icon me-1"
                                                                    onClick={renderProps.onClick}
                                                                >
                                                                    <i className="ri-google-fill fs-16" />
                                                                </Button>
                                                            )}
                                                            onSuccess={googleResponse}
                                                            onFailure={() => {

                                                            }}
                                                        />
                                                        <Button color="dark" className="btn-icon"><i className="ri-github-fill fs-16"></i></Button>{" "}
                                                        <Button color="info" className="btn-icon"><i className="ri-twitter-fill fs-16"></i></Button>
                                                    </div>
                                                </div> */}
                      </Form>
                    </div>
                  </CardBody>
                </Card>

                {/* <div className="mt-4 text-center">
                                    <p className="mb-0">Don't have an account ? <Link to="/register" className="fw-semibold text-primary text-decoration-underline"> Signup </Link> </p>
                                </div> */}
              </Col>
            </Row>
          </Container>
        </div>
      </ParticlesAuth>
    </React.Fragment>
  );
};

export default withRouter(Login);
