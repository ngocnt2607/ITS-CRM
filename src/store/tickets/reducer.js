import {
    GET_TICKETS_LIST,
    API_RESPONSE_SUCCESS,
    API_RESPONSE_ERROR,

    ADD_TICKET_SUCCESS,
    ADD_TICKET_FAIL,
    UPDATE_TICKET_SUCCESS,
    UPDATE_TICKET_FAIL,
    DELETE_TICKET_SUCCESS,
    DELETE_TICKET_FAIL,
} from "./actionType";

const INIT_STATE = {
    ticketsList: [],
};

const Tickets = (state = INIT_STATE, action) => {
    switch (action.type) {
        case API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {

                case GET_TICKETS_LIST:
                    return {
                        ...state,
                        ticketsList: action.payload.data,
                    };

                default:
                    return { ...state };
            }

        case API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case GET_TICKETS_LIST:
                    return {
                        ...state,
                        error: action.payload.error,
                    };

                default:
                    return { ...state };
            }

        case GET_TICKETS_LIST: {
            return {
                ...state,
            };
        }

        case ADD_TICKET_SUCCESS:
            return {
                ...state,
                ticketsList: [...state.ticketsList, action.payload],
            };

        case ADD_TICKET_FAIL:
            return {
                ...state,
                error: action.payload,
            };

        case UPDATE_TICKET_SUCCESS:
            return {
                ...state,
                ticketsList: state.ticketsList.map(ticket =>
                    ticket.id.toString() === action.payload.id.toString()
                        ? { ticket, ...action.payload }
                        : ticket
                ),
            };

        case UPDATE_TICKET_FAIL:
            return {
                ...state,
                error: action.payload,
            };

        case DELETE_TICKET_SUCCESS:
            return {
                ...state,
                ticketsList: state.ticketsList.filter(
                    ticket => ticket.id.toString() !== action.payload.id.toString()
                ),
            };

        case DELETE_TICKET_FAIL:
            return {
                ...state,
                error: action.payload,
            };

        default:
            return { ...state };
    }
};

export default Tickets;