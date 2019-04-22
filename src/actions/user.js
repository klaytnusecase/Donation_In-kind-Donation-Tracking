export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

export const FETCH_INFORMATION_REQUEST = 'FETCH_INFORMATION_REQUEST';
export const FETCH_INFORMATION_SUCCESS = 'FETCH_INFORMATION_SUCCESS';
export const FETCH_INFORMATION_FAILURE = 'FETCH_INFORMATION_FAILURE';

export const CHANGE_INFORMATION_REQUEST = 'CHANGE_INFORMATION_REQUEST';
export const CHANGE_INFORMATION_SUCCESS = 'CHANGE_INFORMATION_SUCCESS';
export const CHANGE_INFORMATION_FAILURE = 'CHANGE_INFORMATION_FAILURE';


export const FETCH_MEMBERS_REQUEST = 'FETCH_MEMBERS_REQUEST';
export const FETCH_MEMBERS_SUCCESS = 'FETCH_MEMBERS_SUCCESS';
export const FETCH_MEMBERS_FAILURE = 'FETCH_MEMBERS_FAILURE';


export const FETCH_VOLUNTEERS_REQUEST = 'FETCH_VOLUNTEERS_REQUEST';
export const FETCH_VOLUNTEERS_SUCCESS = 'FETCH_VOLUNTEERS_SUCCESS';
export const FETCH_VOLUNTEERS_FAILURE = 'FETCH_VOLUNTEERS_FAILURE';


/* register action */
function requestRegister(creds) {
  return {
    type: REGISTER_REQUEST,
    isFetching: true,
    creds,
  };
}
export function registerSuccess(){
  return {
    type: REGISTER_SUCCESS,
    isFetching: false,
  }
}
export function registerError(message){
  return {
    type: REGISTER_FAILURE,
    isFetching: false,
    message
  }
}

/* login actions */
function requestLogin(creds) {
  return {
    type: LOGIN_REQUEST,
    isFetching: true,
    isAuthenticated: false,
    creds,
  };
}
export function receiveLogin(user) {
  return {
    type: LOGIN_SUCCESS,
    isFetching: false,
    isAuthenticated: true,
    id_token: user.id_token,
    org_type: user.org_type, // HK: add organization type, it will be used in app.js
    name: user.name,
    affiliation: user.affiliation
  };
}
function loginError(message) {
  return {
    type: LOGIN_FAILURE,
    isFetching: false,
    isAuthenticated: false,
    message,
  };
}

/* logout actions */
function requestLogout() {
  return {
    type: LOGOUT_REQUEST,
    isFetching: true,
    isAuthenticated: true,
  };
}

export function receiveLogout() {
  return {
    type: LOGOUT_SUCCESS,
    isFetching: false,
    isAuthenticated: false,
  };
}

/* fetch request to change Information actions*/
function requestFetchInformation(creds) {
  return {
    type: FETCH_INFORMATION_REQUEST,
    isFetching: true,
    creds,
  };
}

export function fetchInformationSuccess(posts){
  return {
    type: FETCH_INFORMATION_SUCCESS,
    isFetching: false,
    posts
  }
}
export function fetchInformationError(message){
  return {
    type: FETCH_INFORMATION_FAILURE,
    isFetching: false,
    message
  }
}

/* Change Information actions*/
function requestChangeInformation(creds) {
  return {
    type: CHANGE_INFORMATION_REQUEST,
    isFetching: true,
    creds,
  };
}

export function changeInformationSuccess(){
  return {
    type: CHANGE_INFORMATION_SUCCESS,
    isFetching: false,
  }
}
export function changeInformationError(message){
  return {
    type: CHANGE_INFORMATION_FAILURE,
    isFetching: false,
    message
  }
}

/* Fetch member list*/
function requestFetchMembers(creds) {
  return {
    type: FETCH_MEMBERS_REQUEST,
    isFetching: true,
    creds,
  };
}

export function fetchMembersSuccess(posts){
  return {
    type: FETCH_MEMBERS_SUCCESS,
    isFetching: false,
    posts
  }
}
export function fetchMembersError(message){
  return {
    type: FETCH_MEMBERS_FAILURE,
    isFetching: false,
    message
  }
}

/* Fetch volunteer list*/
function requestFetchVolunteers(creds) {
  return {
    type: FETCH_VOLUNTEERS_REQUEST,
    isFetching: true,
    creds,
  };
}

export function fetchVolunteersSuccess(posts){
  return {
    type: FETCH_VOLUNTEERS_SUCCESS,
    isFetching: false,
    posts
  }
}
export function fetchVolunteersError(message){
  return {
    type: FETCH_VOLUNTEERS_FAILURE,
    isFetching: false,
    message
  }
}

//register function
export function registerUser(creds) {
  const config = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    credentials: 'include',
    body: `login=${creds.login}&password=${creds.password}&password_rep=${creds.password_rep}&affiliation=${creds.affiliation}&org_type=${creds.org_type}`,
  };

  return dispatch => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestRegister(creds));

    return fetch('/register', config)
      .then(response => response.json().then(user => ({ user, response })))
      .then(({ user, response }) => {
        if (!response.ok) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(registerError(user.message));
          return Promise.reject(user);
        }
        dispatch(registerSuccess());
        return Promise.resolve(user);
      })
      .catch(err => console.error('Error: ', err));
  };
}

//login actions
export function loginUser(creds) {
  const config = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    credentials: 'include',
    body: `login=${creds.login}&password=${creds.password}`,
  };

  return dispatch => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestLogin(creds));

    return fetch('/login', config)
      .then(response => response.json().then(user => ({ user, response })))
      .then(({ user, response }) => {
        if (!response.ok) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(loginError(user.message));
          return Promise.reject(user);
        }
        // in posts create new action and check http status, if malign logout
        // If login was successful, set the token in local storage

        localStorage.setItem('id_token', user.id_token);
        // Dispatch the success action
        dispatch(receiveLogin(user));
        return Promise.resolve(user);
      })
      .catch(err => console.error('Error: ', err));
  };
}


// Logout function
export function logoutUser() {
  return dispatch => {
    dispatch(requestLogout());
    localStorage.removeItem('id_token');
    document.cookie = 'id_token=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    dispatch(receiveLogout());
  };
}

export function saveKeystore(){
  const config = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    credentials: 'include',
  };
  return dispatch => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestFetchInformation('key'));
    return fetch('/privateKey', config)
      .then(() => {
        console.log(config);
        dispatch(fetchInformationSuccess('key'));
        return Promise.resolve('key');
      })
      .catch(err => console.error('Error: ', err));
  };
}



export function fetchInformation(creds) {
    const config = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    credentials: 'include',
    body: `name=${creds}`,
  };

  return dispatch => {
    // We dispatch requestLogin to kickoff the call to the API
    dispatch(requestFetchInformation(creds));

    return fetch('/getInformation', config)
      .then(response => response.json().then(user => ({ user, response })))
      .then(({ user, response }) => {
        if (!response.ok) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(fetchInformationError(user.message));
          return Promise.reject(user);
        }
        dispatch(fetchInformationSuccess(user));
        return Promise.resolve(user);
      })
      .catch(err => console.error('Error: ', err));
  };
}


export function changeInformation(creds) {
  const config = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    credentials: 'include',
    body: `name=${creds.name}&password=${creds.password}&password_rep=${creds.password_rep}&affiliation=${creds.affiliation}&address=${creds.address}&representative_name=${creds.representative_name}&e_mail=${creds.e_mail}&contacts=${creds.contacts}`,
  };

  return dispatch => {
    dispatch(requestChangeInformation(creds));

    return fetch('/changeInformation', config)
      .then(response => response.json().then(user => ({ user, response })))
      .then(({ user, response }) => {
        if (!response.ok) {
          dispatch(changeInformationError(user.message));
          return Promise.reject(user);
        }
        dispatch(changeInformationSuccess());
        return Promise.resolve(user);
      })
      .catch(err => console.error('Error: ', err));
  };
}


export function fetchMembers() {
  return dispatch => {
    dispatch(requestFetchMembers());

    return fetch('/user/member_list', {
      method: 'GET'
    })
      .then(response =>
        response.json().then(responseJson => ({
          posts: responseJson,
          responseJson,
        })),
      )
      .then(({posts, responseJson}) => {
        if (!responseJson) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(fetchMembersError('Fail'));
          return Promise.reject(posts);
        }
        // Dispatch the success action
        dispatch(fetchMembersSuccess(posts));
        return Promise.resolve(posts);
      })
      .catch(err => console.error('Error: ', err));
  };
}

export function fetchVolunteers() {
  return dispatch => {
    dispatch(requestFetchVolunteers());

    return fetch('/user/volunteer_list', {
      method: 'GET'
    })
      .then(response =>
        response.json().then(responseJson => ({
          posts: responseJson,
          responseJson,
        })),
      )
      .then(({posts, responseJson}) => {
        if (!responseJson) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(fetchVolunteersError('Fail'));
          return Promise.reject(posts);
        }
        // Dispatch the success action
        dispatch(fetchVolunteersSuccess(posts));
        return Promise.resolve(posts);
      })
      .catch(err => console.error('Error: ', err));
  };
}
