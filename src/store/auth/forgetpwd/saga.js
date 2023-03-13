import { takeEvery, fork, put, all, call } from "redux-saga/effects"

// Login Redux States
import { FORGET_PASSWORD } from "./actionTypes"
import { userForgetPasswordSuccess, userForgetPasswordError } from "./actions"

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper"
import {
  postFakeForgetPwd,
  postJwtForgetPwd,
} from "../../../helpers/fakebackend_helper"

const fireBaseBackend = getFirebaseBackend()

//If user is send successfully send mail link then dispatch redux action's are directly from here.
function* forgetUser({ payload: { user, history } }) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response = yield call(fireBaseBackend.forgetPassword, user.email)
      if (response) {
        yield put(
          userForgetPasswordSuccess(
            "Mật khẩu mới đã được gửi về email của bạn"
          )
        )
      }
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      const response = yield call(postJwtForgetPwd, "/jwt-forget-pwd", {
        email: user.email,
      })
      if (response) {
        yield put(
          userForgetPasswordSuccess(
            "Mật khẩu mới đã được gửi về email của bạn"
          )
        )
      }
    } else {
      const response = yield call(postFakeForgetPwd, "/fake-forget-pwd", {
        email: user.email,
      })
      if (response) {
        yield put(
          userForgetPasswordSuccess(
            "Mật khẩu mới đã được gửi về email của bạn"
          )
        )
      }
    }
  } catch (error) {
    yield put(userForgetPasswordError(error))
  }
}

export function* watchUserPasswordForget() {
  yield takeEvery(FORGET_PASSWORD, forgetUser)
}

function* forgetPasswordSaga() {
  yield all([fork(watchUserPasswordForget)])
}

export default forgetPasswordSaga
