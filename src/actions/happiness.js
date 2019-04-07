export const CREATE_COLLECTION_INITIAL = 'CREATE_COLLECTION_INITIAL';
export const CREATE_COLLECTION_REQUEST = 'CREATE_COLLECTION_REQUEST';
export const CREATE_COLLECTION_SUCCESS = 'CREATE_COLLECTION_SUCCESS';
export const CREATE_COLLECTION_FAILURE = 'CREATE_COLLECTION_FAILURE';

export const FETCH_COLLECTIONS_REQUEST = 'FETCH_COLLECTIONS_REQUEST';
export const FETCH_COLLECTIONS_FAILURE = 'FETCH_COLLECTIONS_FAILURE';
export const FETCH_COLLECTIONS_SUCCESS = 'FETCH_COLLECTIONS_SUCCESS';

export const MODIFY_COLLECTION_INITIAL = 'MODIFY_COLLECTION_INITIAL';
export const MODIFY_COLLECTION_REQUEST = 'MODIFY_COLLECTION_REQUEST';
export const MODIFY_COLLECTION_SUCCESS = 'MODIFY_COLLECTION_SUCCESS';
export const MODIFY_COLLECTION_FAILURE = 'MODIFY_COLLECTION_FAILURE';

export const REMOVE_COLLECTION_INITIAL = 'REMOVE_COLLECTION_INITIAL';
export const REMOVE_COLLECTION_REQUEST = 'REMOVE_COLLECTION_REQUEST';
export const REMOVE_COLLECTION_SUCCESS = 'REMOVE_COLLECTION_SUCCESS';
export const REMOVE_COLLECTION_FAILURE = 'REMOVE_COLLECTION_FAILURE';


export const FETCH_COLLECTION_DISTRIBUTION_REQUEST = 'FETCH_COLLECTION_DISTRIBUTION_REQUEST';
export const FETCH_COLLECTION_DISTRIBUTION_SUCCESS = 'FETCH_COLLECTION_DISTRIBUTION_SUCCESS';
export const FETCH_COLLECTION_DISTRIBUTION_FAILURE = 'FETCH_COLLECTION_DISTRIBUTION_FAILURE';

export const UPDATE_COLLECTION_DISTRIBUTION_INITIAL = 'UPDATE_COLLECTION_DISTRIBUTION_INITIAL';
export const UPDATE_COLLECTION_DISTRIBUTION_REQUEST = 'UPDATE_COLLECTION_DISTRIBUTION_REQUEST';
export const UPDATE_COLLECTION_DISTRIBUTION_SUCCESS = 'UPDATE_COLLECTION_DISTRIBUTION_SUCCESS';
export const UPDATE_COLLECTION_DISTRIBUTION_FAILURE = 'UPDATE_COLLECTION_DISTRIBUTION_FAILURE';
export const FETCH_RECEIPT_SUCCESS = 'FETCH_RECEIPT_SUCCESS';




function createCollectionInitial() {
  return {
    type: CREATE_COLLECTION_INITIAL,
    isFetching: false,
  };
}
function requestCreateCollection(post) {
  return {
    type: CREATE_COLLECTION_REQUEST,
    isFetching: true,
    post,
  };
}
function createCollectionSuccess(post) {
  return {
    type: CREATE_COLLECTION_SUCCESS,
    isFetching: false,
    post,
  };
}
function createCollectionError(message) {
  return {
    type: CREATE_COLLECTION_FAILURE,
    isFetching: false,
    message,
  };
}


function requestFetchCollections() {
  return {
    type: FETCH_COLLECTIONS_REQUEST,
    isFetching: true,
  };
}

function fetchCollectionsError(message) {
  return {
    type: FETCH_COLLECTIONS_FAILURE,
    isFetching: false,
    message,
  };
}

function fetchCollectionsSuccess(posts) {
  return {
    type: FETCH_COLLECTIONS_SUCCESS,
    isFetching: false,
    posts,
  };
}


function modifyCollectionInitial() {
  return {
    type: MODIFY_COLLECTION_INITIAL,
    isFetching: false,
  };
}
function requestModifyCollection(post) {
  return {
    type: MODIFY_COLLECTION_REQUEST,
    isFetching: true,
    post,
  };
}
function modifyCollectionSuccess(post) {
  return {
    type: MODIFY_COLLECTION_SUCCESS,
    isFetching: false,
    post,
  };
}
function modifyCollectionError(message) {
  return {
    type: MODIFY_COLLECTION_FAILURE,
    isFetching: false,
    message,
  };
}

function removeCollectionInitial() {
  return {
    type: REMOVE_COLLECTION_INITIAL,
    isFetching: false,
  };
}
function requestRemoveCollection(post) {
  return {
    type: REMOVE_COLLECTION_REQUEST,
    isFetching: true,
    post,
  };
}
function removeCollectionSuccess(post) {
  return {
    type: REMOVE_COLLECTION_SUCCESS,
    isFetching: false,
    post,
  };
}
function removeCollectionError(message) {
  return {
    type: REMOVE_COLLECTION_FAILURE,
    isFetching: false,
    message,
  };
}



function updateCollectionDistributionInitial() {
  return {
    type: UPDATE_COLLECTION_DISTRIBUTION_INITIAL,
    isFetching: false,
  };
}
function requestUpdateCollectionDistribution(post) {
  return {
    type: UPDATE_COLLECTION_DISTRIBUTION_REQUEST,
    isFetching: true,
    post,
  };
}
function updateCollectionDistributionSuccess(post) {
  return {
    type: UPDATE_COLLECTION_DISTRIBUTION_SUCCESS,
    isFetching: false,
    post,
  };
}
function updateCollectionDistributionError(message) {
  return {
    type: UPDATE_COLLECTION_DISTRIBUTION_FAILURE,
    isFetching: false,
    message,
  };
}


function requestFetchCollectionDistribution(post) {
  return {
    type: FETCH_COLLECTION_DISTRIBUTION_REQUEST,
    isFetching: true,
    post,
  };
}
function fetchCollectionDistributionSuccess(post) {
  return {
    type: FETCH_COLLECTION_DISTRIBUTION_SUCCESS,
    isFetching: false,
    post,
  };
}
function fetchCollectionDistributionError(message) {
  return {
    type: FETCH_COLLECTION_DISTRIBUTION_FAILURE,
    isFetching: false,
    message,
  };
}

function fetchForReceiptSuccess(post) {
  return {
    type: FETCH_RECEIPT_SUCCESS,
    isFetching: false,
    post,
  };
}



export function createCollection(postData) {
  return dispatch => {
    // We dispatch requestCreatePost to kickoff the call to the API
    dispatch(requestCreateCollection(postData));
    const stringfy_data = JSON.stringify(postData.InBoxDonations);
    const stringify_expirationDate = JSON.stringify(postData.expirationDate);
    return fetch('/collections/new', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            credentials: 'include',
            body: `stringfy_data=${stringfy_data}&name=${postData.name}&expirationDate=${stringify_expirationDate}`,
        })
      .then(response => response.json().then(post => ({ post, response })))
      .then(({ post, response }) => {
        if (!response.ok) {
          dispatch(createCollectionError(post.message));
          return Promise.reject(post);
        }
        // Dispatch the success action
        dispatch(createCollectionSuccess(post));
        setTimeout(() => {
          dispatch(createCollectionInitial());
        }, 5000);
        return Promise.resolve(post);
      })
      .catch(err => console.error('Error: ', err));
  };
}

export function fetchCollectionsAndDonations() {
  return dispatch => {
    dispatch(requestFetchCollections());

    return fetch('/collections', {
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
          dispatch(fetchCollectionsError('Fail'));
          return Promise.reject(posts);
        }
        // Dispatch the success action
        dispatch(fetchCollectionsSuccess(posts));
        return Promise.resolve(posts);
      })
      .catch(err => console.error('Error: ', err));
  };
}


export function setCollectionQuantity(postData) {
  return dispatch => {
    // We dispatch requestCreatePost to kickoff the call to the API
    dispatch(requestModifyCollection(postData));
    const stringfy_data = JSON.stringify(postData.collections);
    return fetch('/collections/setQuantity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            credentials: 'include',
            body: `stringfy_data=${stringfy_data}`,
        })
      .then(response => response.json().then(post => ({ post, response })))
      .then(({ post, response }) => {
        if (!response.ok) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(modifyCollectionError('Fail'));
          return Promise.reject(post);
        }
        // Dispatch the success action
        dispatch(modifyCollectionSuccess(post));
        setTimeout(() => {
          dispatch(modifyCollectionInitial());
        }, 5000);
        return Promise.resolve(post);
      })
      .catch(err => console.error('Error: ', err));
  };
}

export function removeCollection(postData) {
  return dispatch => {
    // We dispatch requestCreatePost to kickoff the call to the API
    dispatch(requestRemoveCollection(postData));
    return fetch('/collections/remove', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            credentials: 'include',
            body: `id=${postData.id}`,
        })
      .then(response => response.json().then(post => ({ post, response })))
      .then(({ post, response }) => {
        if (!response.ok) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(removeCollectionError('Fail'));
          return Promise.reject(post);
        }
        // Dispatch the success action
        dispatch(removeCollectionSuccess(post));
        setTimeout(() => {
          dispatch(removeCollectionInitial());
        }, 5000);
        return Promise.resolve(post);
      })
      .catch(err => console.error('Error: ', err));
  };
}



export function fetchCollectionsDistribution() {
  return dispatch => {
    dispatch(requestFetchCollectionDistribution());

    return fetch('/collections/fetchDistribution', {
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
          dispatch(fetchCollectionDistributionError('Fail'));
          return Promise.reject(posts);
        }
        // Dispatch the success action
        dispatch(fetchCollectionDistributionSuccess(posts));
        return Promise.resolve(posts);
      })
      .catch(err => console.error('Error: ', err));
  };
}

export function fetchForReceipt() {
  return dispatch => {
    dispatch(requestFetchCollectionDistribution());

    return fetch('/receipt/donationInfo', {
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
          dispatch(fetchCollectionDistributionError('Fail'));
          return Promise.reject(posts);
        }
        // Dispatch the success action
        dispatch(fetchForReceiptSuccess(posts));
        return Promise.resolve(posts);
      })
      .catch(err => console.error('Error: ', err));
  };
}



export function updateCollectionDistribution(postData) {
  return dispatch => {
    // We dispatch requestCreatePost to kickoff the call to the API
    dispatch(requestUpdateCollectionDistribution(postData));
    const collection_ids = JSON.stringify(postData.collection_ids);
    const volunteer_names = JSON.stringify(postData.volunteer_names);
    const quantities = JSON.stringify(postData.quantities);
    return fetch('/collections/updateDistribution', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            credentials: 'include',
            body: `collection_ids=${collection_ids}&volunteer_names=${volunteer_names}&quantities=${quantities}`,
        })
      .then(response => response.json().then(post => ({ post, response })))
      .then(({ post, response }) => {
        if (!response.ok) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(updateCollectionDistributionError('Fail'));
          return Promise.reject(post);
        }
        // Dispatch the success action
        dispatch(updateCollectionDistributionSuccess(post));
        setTimeout(() => {
          dispatch(updateCollectionDistributionInitial());
        }, 5000);
        return Promise.resolve(post);
      })
      .catch(err => console.error('Error: ', err));
  };
}
