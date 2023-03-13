import {
  GET_PRODUCTS,
  GET_ORDERS,
  GET_SELLERS,
  GET_CUSTOMERS,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  ADD_ORDER_SUCCESS,
  ADD_ORDER_FAIL,
  DELETE_ORDER_SUCCESS,
  DELETE_ORDER_FAIL,
  UPDATE_ORDER_SUCCESS,
  UPDATE_ORDER_FAIL,

  ADD_CUSTOMER_SUCCESS,
  ADD_CUSTOMER_FAIL,
  UPDATE_CUSTOMER_SUCCESS,
  UPDATE_CUSTOMER_FAIL,
  DELETE_CUSTOMER_SUCCESS,
  DELETE_CUSTOMER_FAIL,

  DELETE_PRODUCT,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_FAIL,
} from "./actionType";

const INIT_STATE = {
  products: [],
  orders: [],
  sellers: [],
  customers: [],
  error: {},
};

const Ecommerce = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_PRODUCTS:
          return {
            ...state,
            products: action.payload.data,
          };

        case DELETE_PRODUCT:
          return {
            ...state,
            products: state.products.filter(
              product => (product.id + '') !== (action.payload.data + '')
            ),
          };

        case GET_ORDERS:
          return {
            ...state,
            orders: action.payload.data,
          };
        case GET_SELLERS:
          return {
            ...state,
            sellers: action.payload.data,
          };
        case GET_CUSTOMERS:
          return {
            ...state,
            customers: action.payload.data,
          };

        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_PRODUCTS:
          return {
            ...state,
            error: action.payload.error,
          };

        case DELETE_PRODUCT:
          return {
            ...state,
            error: action.payload.error,
          };
        case GET_ORDERS:
          return {
            ...state,
            error: action.payload.error,
          };
        case GET_SELLERS:
          return {
            ...state,
            error: action.payload.error,
          };
        case GET_CUSTOMERS:
          return {
            ...state,
            error: action.payload.error,
          };
        default:
          return { ...state };
      }

    case GET_PRODUCTS:
      return {
        ...state,
      };

    case GET_ORDERS: {
      return {
        ...state,
      };
    }
    case GET_SELLERS: {
      return {
        ...state,
      };
    }
    case GET_CUSTOMERS:
      return {
        ...state,
      };

    case DELETE_PRODUCT:
      return {
        ...state,
      };

    case ADD_ORDER_SUCCESS:
      return {
        ...state,
        orders: [...state.orders, action.payload],
      };

    case ADD_ORDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_ORDER_SUCCESS:
      return {
        ...state,
        orders: state.orders.filter(
          order => order.id.toString() !== action.payload.id.toString()
        ),        
      };

    case DELETE_ORDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_ORDER_SUCCESS:
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id.toString() === action.payload.id.toString()
            ? { order, ...action.payload }
            : order
        ),
      };

    case UPDATE_ORDER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_CUSTOMER_SUCCESS:
      return {
        ...state,
        customers: [...state.customers, action.payload],
      };

    case ADD_CUSTOMER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_CUSTOMER_SUCCESS:
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer.id.toString() === action.payload.id.toString()
            ? { customer, ...action.payload }
            : customer
        ),
      };

    case UPDATE_CUSTOMER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_CUSTOMER_SUCCESS:
      return {
        ...state,
        customers: state.customers.filter(
          customer => customer.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_CUSTOMER_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_PRODUCT_SUCCESS:
      return {
        ...state,
        products: state.products.filter(
          product => product.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_PRODUCT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return { ...state };
  }
};

export default Ecommerce;
