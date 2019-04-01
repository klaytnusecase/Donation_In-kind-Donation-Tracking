import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,

  LOGIN_FAILURE,
  LOGOUT_SUCCESS,

  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILURE,

  FETCH_INFORMATION_REQUEST,
  FETCH_INFORMATION_SUCCESS,
  FETCH_INFORMATION_FAILURE,

  CHANGE_INFORMATION_REQUEST,
  CHANGE_INFORMATION_SUCCESS,
  CHANGE_INFORMATION_FAILURE,


} from '../actions/user';

// The auth reducer. The starting state sets authentication
// based on a token being in local storage. In a real app,
// we would also want a util to check if the token is expired.
export default function auth(
  state = {
    isFetching: false,
    isAuthenticated: false,
    isRegister: false,
  },
  action,
) {
  switch (action.type) {
    /* login actions */
    case LOGIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
        isAuthenticated: false,
        user: action.creds,
      });
    case LOGIN_SUCCESS:
      console.log(action);
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: true,
        org_type: action.org_type,
        name: action.name,
        affiliation: action.affiliation,
        errorMessage: '',
      });
    case LOGIN_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        isAuthenticated: false,
        errorMessage: action.message,
      });
    /* logout actions */
    case LOGOUT_SUCCESS:
      return Object.assign({}, state, {
        isAuthenticated: false,
      });
    /* register actions */
    case REGISTER_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case REGISTER_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.message,
        message: null,
      });
    case REGISTER_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: null,
        message: '회원 등록에 성공하였습니다.',
      });

    /* fetch detail information */
    case FETCH_INFORMATION_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_INFORMATION_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: '정보 받아오기에 실패했습니다. 관리자에게 문의해주세요',
        message: null,
      });
    case FETCH_INFORMATION_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: null,
        message: null,
        details: action.posts
      });

    /* change password actions */
    case CHANGE_INFORMATION_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case CHANGE_INFORMATION_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.message,
        message: null,
      });
    case CHANGE_INFORMATION_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: null,
        message: '비밀번호 변경에 성공하였습니다',
      });

    default:
      return state;
  }
}
