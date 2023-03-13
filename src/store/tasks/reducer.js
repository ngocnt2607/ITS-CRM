import {
    GET_TASK_LIST,
    API_RESPONSE_SUCCESS,
    API_RESPONSE_ERROR,
    ADD_TASK_SUCCESS,
    ADD_TASK_FAIL,
    UPDATE_TASK_SUCCESS,
    UPDATE_TASK_FAIL,
    DELETE_TASK_SUCCESS,
    DELETE_TASK_FAIL,
} from "./actionType";

const INIT_STATE = {
    taskList: [],
};

const Tasks = (state = INIT_STATE, action) => {
    switch (action.type) {
        case API_RESPONSE_SUCCESS:
            switch (action.payload.actionType) {
                case GET_TASK_LIST:
                    return {
                        ...state,
                        taskList: action.payload.data,
                    };

                default:
                    return { ...state };
            }

        case API_RESPONSE_ERROR:
            switch (action.payload.actionType) {
                case GET_TASK_LIST:
                    return {
                        ...state,
                        error: action.payload.error,
                    };

                default:
                    return { ...state };
            }

        case GET_TASK_LIST: {
            return {
                ...state,
            };
        }

        case ADD_TASK_SUCCESS:
            return {
                ...state,
                taskList: [...state.taskList, action.payload],
            };

        case ADD_TASK_FAIL:
            return {
                ...state,
                error: action.payload,
            };

        case UPDATE_TASK_SUCCESS:
            return {
                ...state,
                taskList: state.taskList.map(task =>
                    task.id.toString() === action.payload.id.toString()
                        ? { task, ...action.payload }
                        : task
                ),
            };

        case UPDATE_TASK_FAIL:
            return {
                ...state,
                error: action.payload,
            };

        case DELETE_TASK_SUCCESS:
            return {
                ...state,
                taskList: state.taskList.filter(
                    task => task.id.toString() !== action.payload.id.toString()
                ),
            };

        case DELETE_TASK_FAIL:
            return {
                ...state,
                error: action.payload,
            };

        default:
            return { ...state };
    }
};

export default Tasks;