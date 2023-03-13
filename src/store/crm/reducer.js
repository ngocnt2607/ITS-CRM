import {
  GET_CONTACTS,
  GET_COMPANIES,
  GET_DEALS,
  GET_LEADS,
  API_RESPONSE_SUCCESS,
  API_RESPONSE_ERROR,

  ADD_COMPANIES_SUCCESS,
  ADD_COMPANIES_FAIL,
  UPDATE_COMPANIES_SUCCESS,
  UPDATE_COMPANIES_FAIL,
  DELETE_COMPANIES_SUCCESS,
  DELETE_COMPANIES_FAIL,

  ADD_CONTACT_SUCCESS,
  ADD_CONTACT_FAIL,
  UPDATE_CONTACT_SUCCESS,
  UPDATE_CONTACT_FAIL,
  DELETE_CONTACT_SUCCESS,
  DELETE_CONTACT_FAIL,

  ADD_LEAD_SUCCESS,
  ADD_LEAD_FAIL,
  UPDATE_LEAD_SUCCESS,
  UPDATE_LEAD_FAIL,
  DELETE_LEAD_SUCCESS,
  DELETE_LEAD_FAIL,
} from "./actionType";

const INIT_STATE = {
  crmcontacts: [],
  companies: [],
  deals: [],
  leads: [],
  error: {},
};

const Crm = (state = INIT_STATE, action) => {
  switch (action.type) {
    case API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case GET_CONTACTS:
          return {
            ...state,
            crmcontacts: action.payload.data,
          };
        case GET_COMPANIES:
          return {
            ...state,
            companies: action.payload.data,
          };
        case GET_DEALS:
          return {
            ...state,
            deals: action.payload.data,
          };
        case GET_LEADS:
          return {
            ...state,
            leads: action.payload.data,
          };
        default:
          return { ...state };
      }
    case API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case GET_CONTACTS:
          return {
            ...state,
            error: action.payload.error,
          };
        case GET_COMPANIES:
          return {
            ...state,
            error: action.payload.error,
          };
        case GET_DEALS:
          return {
            ...state,
            error: action.payload.error,
          };
        case GET_LEADS:
          return {
            ...state,
            error: action.payload.error,
          };
        default:
          return { ...state };
      }
    case GET_COMPANIES: {
      return {
        ...state,
      };
    }
    case GET_DEALS: {
      return {
        ...state,
      };
    }
    case GET_LEADS:
      return {
        ...state,
      };
    case ADD_COMPANIES_SUCCESS:
      return {
        ...state,
        companies: [...state.companies, action.payload],
      };

    case ADD_COMPANIES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_COMPANIES_SUCCESS:
      return {
        ...state,
        companies: state.companies.map(company =>
          company.id.toString() === action.payload.id.toString()
            ? { company, ...action.payload }
            : company
        ),
      };

    case UPDATE_COMPANIES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_COMPANIES_SUCCESS:
      return {
        ...state,
        companies: state.companies.filter(
          company => company.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_COMPANIES_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case ADD_CONTACT_SUCCESS:
      return {
        ...state,
        crmcontacts: [...state.crmcontacts, action.payload],
      };

    case ADD_CONTACT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_CONTACT_SUCCESS:
      return {
        ...state,
        crmcontacts: state.crmcontacts.map(contact =>
          contact.id.toString() === action.payload.id.toString()
            ? { contact, ...action.payload }
            : contact
        ),
      };

    case UPDATE_CONTACT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_CONTACT_SUCCESS:
      return {
        ...state,
        crmcontacts: state.crmcontacts.filter(
          contact => contact.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_CONTACT_FAIL:
      return {
        ...state,
        error: action.payload,
      };

      case ADD_LEAD_SUCCESS:
      return {
        ...state,
        leads: [...state.leads, action.payload],
      };

    case ADD_LEAD_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case UPDATE_LEAD_SUCCESS:
      return {
        ...state,
        leads: state.leads.map(lead =>
          lead.id.toString() === action.payload.id.toString()
            ? { lead, ...action.payload }
            : lead
        ),
      };

    case UPDATE_LEAD_FAIL:
      return {
        ...state,
        error: action.payload,
      };

    case DELETE_LEAD_SUCCESS:
      return {
        ...state,
        leads: state.leads.filter(
          lead => lead.id.toString() !== action.payload.id.toString()
        ),
      };

    case DELETE_LEAD_FAIL:
      return {
        ...state,
        error: action.payload,
      };


    default:
      return { ...state };
  }
};

export default Crm;
