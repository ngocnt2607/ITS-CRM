import axios from 'axios';
import { logoutUser } from '../../store/actions';
import { store } from '../../store';
import addToast from '../../Components/Common/add-toast.component';
import { ACCESS_TOKEN, Message } from '../../shared/const/message.const';
import { HttpMethod } from './http.type';

export class HttpService {
  commonHeader = {
    Accept: 'application/json',
    'Cache-Control': 'no-cache no-store',
    Pragma: 'no-cache',
    Expires: 0,
    'Access-Control-Allow-Origin': '*',
  };

  instance = axios.create({
    timeout: 300000,
  });

  constructor() {
    this.configInterceptor();
  }

  get(uri, options) {
    return this.request(uri, HttpMethod.GET, options);
  }

  post(uri, options) {
    return this.request(uri, HttpMethod.POST, options);
  }

  put(uri, options) {
    return this.request(uri, HttpMethod.PUT, options);
  }

  delete(uri, options) {
    return this.request(uri, HttpMethod.DELETE, options);
  }

  async request(uri, method, options) {
    const url = this.resolve(uri, options);

    try {
      const response = await this.instance.request({
        url,
        method,
        data: options?.body,
        params: options?.queryParams,
        headers: this.generateHeader(options?.headers),
        responseType: options?.responseType || 'json',
      });

      if (['blob', 'arraybuffer'].includes(options?.responseType)) {
        return {
          data: response.data,
          headers: response.headers,
        };
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw error;
      } else {
        throw new Error('Error');
      }
    }
  }

  generateHeader = (header) => {
    const token = localStorage.getItem(ACCESS_TOKEN);

    return {
      ...this.commonHeader,
      ...header,
      Authorization: `Bearer ${token}` || '',
    };
  };

  configInterceptor = () => {
    this.instance.interceptors.response.use(
      (res) => {
        return res;
      },
      (err) => {
        const { status, data } = err.response;
        if (status === 401 && !window.location.pathname.includes('login')) {
          addToast({ message: Message.LOGIN_AGAIN, type: 'error' });
          store.dispatch(logoutUser());
          window.location.href = '/login';
        } else {
          addToast({
            message: err.response?.data?.message || Message.LOGIN_ERROR,
            type: 'error',
          });
        }
        throw err;
      }
    );
  };

  // eslint-disable-next-line class-methods-use-this
  resolve = (uri, options) => {
    if (/^(http|https):\/\/.+$/.test(uri)) {
      return uri;
    }
    let baseURL = process.env.REACT_APP_BASE_API_URL;
    if (options?.baseURL) {
      baseURL = options.baseURL;
    }
    return `${baseURL}${uri}`;
  };
}

export default new HttpService();
