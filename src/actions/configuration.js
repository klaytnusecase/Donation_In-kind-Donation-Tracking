export const REGISTER_RECIPIENT_CATEGORY_REQUEST = 'REGISTER_RECIPIENT_CATEGORY_REQUEST';
export const REGISTER_RECIPIENT_CATEGORY_SUCCESS = 'REGISTER_RECIPIENT_CATEGORY_SUCCESS';
export const REGISTER_RECIPIENT_CATEGORY_FAILURE = 'REGISTER_RECIPIENT_CATEGORY_FAILURE';

export const FETCH_RECIPIENT_CATEGORY_REQUEST = 'FETCH_RECIPIENT_CATEGORY_REQUEST';
export const FETCH_RECIPIENT_CATEGORY_SUCCESS = 'FETCH_RECIPIENT_CATEGORY_SUCCESS';
export const FETCH_RECIPIENT_CATEGORY_FAILURE = 'FETCH_RECIPIENT_CATEGORY_FAILURE';

export const FETCH_SWITCH_REQUEST = 'FETCH_SWITCH_REQUEST';
export const FETCH_SWITCH_SUCCESS = 'FETCH_SWITCH_SUCCESS';
export const FETCH_SWITCH_FAILURE = 'FETCH_SWITCH_FAILURE';


function requestRegisterRecipientCategory(creds) {
  return {
    type: REGISTER_RECIPIENT_CATEGORY_REQUEST,
    isFetching: true,
    creds,
  };
}

export function registerRecipientCategorySuccess(){
  return {
    type: REGISTER_RECIPIENT_CATEGORY_SUCCESS,
    isFetching: false,
  }
}
export function registerRecipientCategoryError(message){
  return {
    type: REGISTER_RECIPIENT_CATEGORY_FAILURE,
    isFetching: false,
    message
  }
}

function requestFetchRecipientCategory(creds) {
  return {
    type: FETCH_RECIPIENT_CATEGORY_REQUEST,
    isFetching: true,
    creds,
  };
}

export function fetchRecipientCategorySuccess(posts){
  return {
    type: FETCH_RECIPIENT_CATEGORY_SUCCESS,
    isFetching: false,
    posts
  }
}
export function fetchRecipientCategoryError(){
  return {
    type: FETCH_RECIPIENT_CATEGORY_FAILURE,
    isFetching: false,
  }
}

function requestFetchSwitch(creds) {
  return {
    type: FETCH_SWITCH_REQUEST,
    isFetching: true,
    creds,
  };
}

export function fetchSwitchSuccess(posts){
  return {
    type: FETCH_SWITCH_SUCCESS,
    isFetching: false,
    posts
  }
}
export function fetchSwitchError(){
  return {
    type: FETCH_SWITCH_FAILURE,
    isFetching: false,
  }
}


export function fetchRecipientCategory() {
  return dispatch => {
    dispatch(requestFetchRecipientCategory());

    return fetch('/configuration/getRecipientCategory', {
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
          dispatch(fetchRecipientCategoryError());
          return Promise.reject(posts);
        }
        dispatch(fetchRecipientCategorySuccess(posts));
        return Promise.resolve(posts);
      })
      .catch(err => console.error('Error: ', err));
  };
}



export function registerRecipientCategory(creds) {
  const stringifyData = JSON.stringify(creds.categoryArray);
  const config = {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    credentials: 'include',
    body: `stringifyData=${stringifyData}&type=${creds.type}`,
  };

  return dispatch => {
    dispatch(requestRegisterRecipientCategory(creds));

    return fetch('/configuration/registerRecipientCategory', config)
      .then(response => response.json().then(user => ({ user, response })))
      .then(({ user, response }) => {
        if (!response.ok) {
          dispatch(registerRecipientCategoryError(user.message));
          return Promise.reject(user);
        }
        dispatch(registerRecipientCategorySuccess());
        return Promise.resolve(user);
      })
      .catch(err => console.error('Error: ', err));
  };
}


export function fetchSwitch() {
  return dispatch => {
    dispatch(requestFetchSwitch());

    return fetch('/configuration/switch', {
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
          dispatch(fetchSwitchError());
          return Promise.reject(posts);
        }
        dispatch(fetchSwitchSuccess(posts));
        return Promise.resolve(posts);
      })
      .catch(err => console.error('Error: ', err));
  };
}
