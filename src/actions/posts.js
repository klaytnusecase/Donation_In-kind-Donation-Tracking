export const CREATE_DONATION_INITIAL = 'CREATE_DONATION_INITIAL';
export const CREATE_DONATION_REQUEST = 'CREATE_DONATION_REQUEST';
export const CREATE_DONATION_SUCCESS = 'CREATE_DONATION_SUCCESS';
export const CREATE_DONATION_FAILURE = 'CREATE_DONATION_FAILURE';

export const EDIT_DONATION_INITIAL = 'EDIT_DONATION_INITIAL';
export const EDIT_DONATION_REQUEST = 'EDIT_DONATION_REQUEST';
export const EDIT_DONATION_SUCCESS = 'EDIT_DONATION_SUCCESS';
export const EDIT_DONATION_FAILURE = 'EDIT_DONATION_FAILURE';

export const FETCH_DONATIONS_REQUEST = 'FETCH_DONATIONS_REQUEST';
export const FETCH_DONATIONS_SUCCESS = 'FETCH_DONATIONS_SUCCESS';
export const FETCH_DONATIONS_FAILURE = 'FETCH_DONATIONS_FAILURE';

export const FETCH_DETAILS_REQUEST = 'FETCH_DETAILS_REQUEST';
export const FETCH_DETAILS_SUCCESS = 'FETCH_DETAILS_SUCCESS';
export const FETCH_DETAILS_FAILURE = 'FETCH_DETAILS_FAILURE';


export const SEND_BOX_INITIAL = 'SEND_BOX_INITIAL';
export const SEND_BOX_REQUEST = 'SEND_BOX_REQUEST';
export const SEND_BOX_SUCCESS = 'SEND_BOX_SUCCESS';
export const SEND_BOX_FAILURE = 'SEND_BOX_FAILURE';
export const UPDATE_BOX_REQUEST = 'UPDATE_BOX_REQUEST';
export const UPDATE_BOX_SUCCESS = 'UPDATE_BOX_SUCCESS';
export const UPDATE_BOX_FAILURE = 'UPDATE_BOX_FAILURE';
export const FETCH_BLKCHAIN_REQUEST = 'FETCH_BLKCHAIN_REQUEST';
export const FETCH_BLKCHAIN_SUCCESS = 'FETCH_BLKCHAIN_SUCCESS';
export const FETCH_BLKCHAIN_FAILURE = 'FETCH_BLKCHAIN_FAILURE';
export const FETCH_BOXDTL_REQUEST = 'FETCH_BOXDTL_REQUEST';
export const FETCH_BOXDTL_SUCCESS = 'FETCH_BOXDTL_SUCCESS';
export const FETCH_BOXDTL_FAILURE = 'FETCH_BOXDTL_FAILURE';

export const FETCH_BOXCNT_REQUEST = 'FETCH_BOXCNT_REQUEST';
export const FETCH_BOXCNT_SUCCESS = 'FETCH_BOXCNT_SUCCESS';
export const FETCH_BOXCNT_FAILURE = 'FETCH_BOXCNT_FAILURE';
export const FETCH_NPO_REQUEST = 'FETCH_NPO_REQUEST';
export const FETCH_NPO_SUCCESS = 'FETCH_NPO_SUCCESS';
export const FETCH_NPO_FAILURE = 'FETCH_NPO_FAILURE';
export const FETCH_NPOVOLUN_REQUEST = 'FETCH_NPOVOLUN_REQUEST';
export const FETCH_NPOVOLUN_SUCCESS = 'FETCH_NPOVOLUN_SUCCESS';
export const FETCH_NPOVOLUN_FAILURE = 'FETCH_NPOVOLUN_FAILURE';
export const FETCH_STATUS_REQUEST = 'FETCH_STATUS_REQUEST';
export const FETCH_STATUS_SUCCESS = 'FETCH_STATUS_SUCCESS';
export const FETCH_ALL_SUCCESS = 'FETCH_ALL_SUCCESS';
export const FETCH_STATUS_FAILURE = 'FETCH_STATUS_FAILURE';



/* create donation*/
function createDonationInitial() {
  return {
    type: CREATE_DONATION_INITIAL,
    isFetching: false,
  };
}
function requestCreateDonation(post) {
  return {
    type: CREATE_DONATION_REQUEST,
    isFetching: true,
    post,
  };
}
function createDonationSuccess(post) {
  return {
    type: CREATE_DONATION_SUCCESS,
    isFetching: false,
    post,
  };
}
function createDonationError(message) {
  return {
    type: CREATE_DONATION_FAILURE,
    isFetching: false,
    message,
  };
}

/* edit donation*/
function editDonationInitial() {
  return {
    type: EDIT_DONATION_INITIAL,
    isFetching: false,
  };
}
function requestEditDonation(post) {
  return {
    type: EDIT_DONATION_REQUEST,
    isFetching: true,
    post,
  };
}
function editDonationSuccess(post) {
  console.log(post)
  return {
    type: EDIT_DONATION_SUCCESS,
    isFetching: false,
    post,
  };
}
function editDonationError(message) {
  return {
    type: EDIT_DONATION_FAILURE,
    isFetching: false,
    message,
  };
}


/* fetch donation lists*/
function requestFetchDonations() {
  return {
    type: FETCH_DONATIONS_REQUEST,
    isFetching: true,
  };
}

function fetchDonationsSuccess(posts) {
  return {
    type: FETCH_DONATIONS_SUCCESS,
    isFetching: false,
    posts,
  };
}

function fetchDonationsError(message) {
  return {
    type: FETCH_DONATIONS_FAILURE,
    isFetching: false,
    message,
  };
}

function requestFetchDetails(id) {
  return {
    type: FETCH_DETAILS_REQUEST,
    isFetching: true,
    id,
  };
}

function fetchDetailsSuccess(details) {
  return {
    type: FETCH_DETAILS_SUCCESS,
    isFetching: false,
    details,
  };
}

function fetchDetailsError(message) {
  return {
    type: FETCH_DETAILS_FAILURE,
    isFetching: false,
    message,
  };
}

function requestFetchBlkchain() {
  return {
    type: FETCH_BLKCHAIN_REQUEST,
    isFetching: true,
  };
}

function fetchBlkchainSuccess(existingBoxes) {
  return {
    type: FETCH_BLKCHAIN_SUCCESS,
    isFetching: false,
    existingBoxes,
  };
}

function fetchBlkchainError(message) {
  return {
    type: FETCH_BLKCHAIN_FAILURE,
    isFetching: false,
    message,
  };
}


function sendBoxInitial() {
  return {
    type: SEND_BOX_INITIAL,
    isFetching: false,
  };
}
function requestSendBox(boxInfo) {
  return {
    type: SEND_BOX_REQUEST,
    isFetching: true,
    boxInfo,
  };
}

function sendBoxSuccess(boxInfo) {
  return {
    type: SEND_BOX_SUCCESS,
    isFetching: false,
    boxInfo,
  };
}

function sendBoxFailure(message) {
  return {
    type: SEND_BOX_FAILURE,
    isFetching: false,
    message,
  };
}
function requestUpdateBox(boxInfo) {
  return {
    type: UPDATE_BOX_REQUEST,
    isFetching: true,
    boxInfo,
  };
}

function updateBoxSuccess(boxInfo) {
  return {
    type: UPDATE_BOX_SUCCESS,
    isFetching: false,
    boxInfo,
  };
}

function updateBoxFailure(message) {
  return {
    type: UPDATE_BOX_FAILURE,
    isFetching: false,
    message,
  };
}

function requestFetchBoxDetails() {
  return {
    type: FETCH_BOXDTL_REQUEST,
    isFetching: true,
  };
}

function fetchBoxDetailsSuccess(info) {
  return {
    type: FETCH_BOXDTL_SUCCESS,
    isFetching: false,
    info,
  };
}

function fetchBoxDetailsError(message) {
  return {
    type: FETCH_BOXDTL_FAILURE,
    isFetching: false,
    message,
  };
}

function requestFetchNumbox() {
  return {
    type: FETCH_BOXCNT_REQUEST,
    isFetching: true,
  };
}

function fetchNumboxSuccess(boxcnt) {
  return {
    type: FETCH_BOXCNT_SUCCESS,
    isFetching: false,
    boxcnt,
  };
}

function fetchNumboxError(message) {
  return {
    type: FETCH_BOXCNT_FAILURE,
    isFetching: false,
    message,
  };
}

function requestFetchNPO() {
  return {
    type: FETCH_NPO_REQUEST,
    isFetching: true,
  };
}

function fetchNPOSuccess(npoBoxes) {
  return {
    type: FETCH_NPO_SUCCESS,
    isFetching: false,
    npoBoxes,
  };
}

function fetchNPOError(message) {
  return {
    type: FETCH_NPO_FAILURE,
    isFetching: false,
    message,
  };
}

function requestFetchNPOVolun() {
  return {
    type: FETCH_NPOVOLUN_REQUEST,
    isFetching: true,
  };
}

function fetchNPOVolunSuccess(npoBoxesForVolun) {
  return {
    type: FETCH_NPOVOLUN_SUCCESS,
    isFetching: false,
    npoBoxesForVolun,
  };
}

function fetchNPOVolunError(message) {
  return {
    type: FETCH_NPOVOLUN_FAILURE,
    isFetching: false,
    message,
  };
}


function requestFetchStatus() {
  return {
    type: FETCH_STATUS_REQUEST,
    isFetching: true,
  };
}

function fetchStatusSuccess(status) {
  return {
    type: FETCH_STATUS_SUCCESS,
    isFetching: false,
    status: status,
  };
}

function fetchAllDetailsSuccess(allBoxes) {
  return {
    type: FETCH_ALL_SUCCESS,
    isFetching: false,
    allBoxes: allBoxes,
  };
}

function fetchStatusError(message) {
  return {
    type: FETCH_STATUS_FAILURE,
    isFetching: false,
    message,
  };
}


const HappyAlliance = require('../../HappyAlliance.json');


//import Web3 from 'web3';
//const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
//const happyAlliance = new web3.eth.Contract(HappyAlliance.abi, '0x2f5035bd7ab119b0f8a0abb5934e687dabf8c14d');

const Caver = require('caver-js');
//const caver = new Caver('http://141.223.44.39:8551');
const caver = new Caver('http://127.0.0.1:8551');

const happyAlliance = new caver.klay.Contract(HappyAlliance.abi, '0x8c4c4e6bb247118aa0a60d43afc9a383308b371b');
//0x28b016f7644dd28e2fd7e3743f52af223741fcba

const myAddress = "0x3f3f1b10573e4168958d9176e05b74be17134c80";

export function createDonation(postData) {
  return dispatch => {
    // We dispatch requestCreatePost to kickoff the call to the API
    dispatch(requestCreateDonation(postData));
    const stringify_data = JSON.stringify(postData.shareholders);
    return fetch('/donations/new', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            credentials: 'include',
            body: `company_id=${postData.company_id}&stuff_name=${postData.stuff_name}&affiliation=${postData.affiliation}&nameispublic=${postData.nameispublic}&quantity=${postData.quantity}&quantityispublic=${postData.quantityispublic}&price=${postData.price}&priceispublic=${postData.priceispublic}&date=${postData.date}&dateispublic=${postData.dateispublic}&shareholders=${stringify_data}`,
        })
      .then(response => response.json().then(post => ({ post, response })))
      .then(({ post, response }) => {
        if (!response.ok) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(createDonationError('Fail'));
          return Promise.reject(post);
        }
        // Dispatch the success action
        dispatch(createDonationSuccess(post));
        setTimeout(() => {
          dispatch(createDonationInitial());
        }, 5000);
        return Promise.resolve(post);
      })
      .catch(err => console.error('Error: ', err));
  };
}

export function editDonation(postData) {
  return dispatch => {
    // We dispatch requestCreatePost to kickoff the call to the API
    dispatch(requestEditDonation(postData));
    const stringify_data = JSON.stringify(postData.shareholders);
    return fetch('/donations/edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            credentials: 'include',
            body: `old_id=${postData.old_id}&company_id=${postData.company_id}&stuff_name=${postData.stuff_name}&nameispublic=${postData.nameispublic}&quantity=${postData.quantity}&quantityispublic=${postData.quantityispublic}&price=${postData.price}&priceispublic=${postData.priceispublic}&date=${postData.date}&dateispublic=${postData.dateispublic}&shareholders=${stringify_data}&editor=${postData.editor}&affiliation=${postData.affiliation}`,
        })
      .then(response => response.json().then(post => ({ post, response })))
      .then(({ post, response }) => {
        if (!response.ok) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(editDonationError('Fail'));
          return Promise.reject(post);
        }
        // Dispatch the success action
        dispatch(editDonationSuccess(post));
        setTimeout(() => {
          dispatch(editDonationInitial());
        }, 5000);
        return Promise.resolve(post);
      })
      .catch(err => console.error('Error: ', err));
  };
}

export function doDonation(postData) {
  return dispatch => {
    // We dispatch requestCreatePost to kickoff the call to the API
    dispatch(requestSendBox(postData));
    return happyAlliance.methods.donate(postData.donation_id, postData.company_id).
    send({from: myAddress, gas:2000000, gasPrice:25000000000})
    .then(response => {
        console.log(response);
        if (!response.status) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(sendBoxFailure('Fail'));
          return Promise.reject(postData);
        }
        // Dispatch the success action
        dispatch(sendBoxSuccess(postData));
        setTimeout(() => {
          dispatch(sendBoxInitial());
        }, 5000);
        return Promise.resolve(postData);
      })
      .catch(err => console.error('Error: ', err));
  };
}


export function sendBox(postData) {
  return dispatch => {
    // We dispatch requestCreatePost to kickoff the call to the API
    dispatch(requestSendBox(postData));
    return happyAlliance.methods.sendBox(postData.boxId, postData.boxType, postData.year, postData.serializedDonations, postData.expirationDate, postData.npo).
    send({from: myAddress, gas:2000000, gasPrice:25000000000})
    .then(response => {
        console.log(response);
        if (!response.status) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(sendBoxFailure('Fail'));
          return Promise.reject(postData);
        }
        // Dispatch the success action
        dispatch(sendBoxSuccess(postData));
        setTimeout(() => {
          dispatch(sendBoxInitial());
        }, 100);
        return Promise.resolve(postData);
      })
      .catch(err => console.error('Error: ', err));
  };
}

export function updateBox(postData) {
  return dispatch => {
    // We dispatch requestCreatePost to kickoff the call to the API
    dispatch(requestUpdateBox(postData));
    return happyAlliance.methods.addRecipientInfo(postData.updateTarget, postData.recipient, postData.recipientDate).
    send({from: myAddress, gas:2000000, gasPrice:25000000000})
    .then(response => {
        console.log(response);
        if (!response.status) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(updateBoxFailure('Fail'));
          return Promise.reject(postData);
        }
        // Dispatch the success action
        dispatch(updateBoxSuccess(postData));
        setTimeout(() => {
          dispatch(sendBoxInitial());
        }, 5000);
        return Promise.resolve(postData);
      })
      .catch(err => console.error('Error: ', err));
  };
}


export function confirmBox(data) {
  return dispatch => {
    dispatch(requestUpdateBox(data));
    return happyAlliance.methods.npoConfirm(data.boxId, data.receivedTime).send({from: myAddress, gas:2000000, gasPrice:25000000000})
    .then(response => {
        if (!response) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(updateBoxFailure('Fail'));
          return Promise.reject(response);
        }
        // Dispatch the success action
        dispatch(updateBoxSuccess(response));
        return Promise.resolve(response);
      })
      .catch(err => console.error('Error: ', err));
  };
}


export function fetchAllBoxes() {
  return dispatch => {
    dispatch(requestFetchStatus());
    return happyAlliance.methods.getAllBoxInfo().call()
    .then(response => {
        if (!response) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(fetchStatusError('Fail'));
          return Promise.reject(response);
        }
        // Dispatch the success action
        dispatch(fetchAllDetailsSuccess(response));
        return Promise.resolve(response);
      })
      .catch(err => console.error('Error: ', err));
  };
}


export function fetchBoxStatus() {
  return dispatch => {
    dispatch(requestFetchStatus());
    return happyAlliance.methods.getStatusForAll().call()
    .then(response => {
        if (!response) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(fetchStatusError('Fail'));
          return Promise.reject(response);
        }
        // Dispatch the success action
        dispatch(fetchStatusSuccess(response));
        return Promise.resolve(response);
      })
      .catch(err => console.error('Error: ', err));
  };
}


export function fetchBoxDetails(id) {
  return dispatch => {
    dispatch(requestFetchBoxDetails());
    return happyAlliance.methods.viewBoxInformation(id).call()
    .then(response => {
        console.log(response);
        if (!response) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(fetchBoxDetailsError('Fail'));
          return Promise.reject(response);
        }
        // Dispatch the success action
        dispatch(fetchBoxDetailsSuccess(response));
        return Promise.resolve(response);
      })
      .catch(err => console.error('Error: ', err));
  };
}

export function fetchNPO(_npo) {
  return dispatch => {
    dispatch(requestFetchNPO());
    return happyAlliance.methods.getBoxInfoByNPO(_npo).call()
    .then(response => {
        if (!response) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(fetchNPOError('Fail'));
          return Promise.reject(response);
        }
        // Dispatch the success action
        dispatch(fetchNPOSuccess(response));
        return Promise.resolve(response);
      })
      .catch(err => console.error('Error: ', err));
  };
}

export function fetchNPOVolun(_npo) {
  return dispatch => {
    dispatch(requestFetchNPOVolun());
    return happyAlliance.methods.getBoxInfoByNPO(_npo).call()
    .then(response => {
        if (!response) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(fetchNPOVolunError('Fail'));
          return Promise.reject(response);
        }
        // Dispatch the success action
        dispatch(fetchNPOVolunSuccess(response));
        return Promise.resolve(response);
      })
      .catch(err => console.error('Error: ', err));
  };
}



export function getNumBoxesByYear(year) {
  return dispatch => {
    dispatch(requestFetchNumbox());

    return happyAlliance.methods.getNumBoxesByYear(year).call()
    .then(response => {
        if (!response) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(fetchNumboxError('Fail'));
          return Promise.reject(response);
        }
        // Dispatch the success action
        dispatch(fetchNumboxSuccess(response));
        return Promise.resolve(response);
      })
      .catch(err => console.error('Error: ', err));
  };
}


export function fetchDonations() {
  return dispatch => {
    dispatch(requestFetchDonations());

    return fetch('/donations', {
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
          dispatch(fetchDonationsError('Fail'));
          return Promise.reject(posts);
        }
        // Dispatch the success action
        dispatch(fetchDonationsSuccess(posts));
        return Promise.resolve(posts);
      })
      .catch(err => console.error('Error: ', err));
  };
}

export function fetchDonationsMember(name) {
  return dispatch => {
    dispatch(requestFetchDonations());

    return fetch('/donations/member', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `name=${name}`,
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
          dispatch(fetchDonationsError('Fail'));
          return Promise.reject(posts);
        }
        // Dispatch the success action
        dispatch(fetchDonationsSuccess(posts));
        return Promise.resolve(posts);
      })
      .catch(err => console.error('Error: ', err));
  };
}

export function fetchBlkchain() {
  return dispatch => {
    dispatch(requestFetchBlkchain());

    return happyAlliance.methods.getBoxIds().call()
    .then(response => {
        if (!response) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(fetchBlkchainError('Fail'));
          return Promise.reject(response);
        }
        // Dispatch the success action
        dispatch(fetchBlkchainSuccess(response));
        return Promise.resolve(response);
      })
      .catch(err => console.error('Error: ', err));
  };
}


export function fetchDonationsForHappiness() {
  return dispatch => {
    dispatch(requestFetchDonations());

    return fetch('/donations/forhappiness', {
            method: 'GET'
        })
      .then(response =>
        response.json().then(responseJson => ({
          posts: responseJson,
          responseJson,
        })),
      )
      .then(({ posts, responseJson }) => {
        if (!responseJson) {
          dispatch(fetchDonationsError('Fail'));
          return Promise.reject(posts);
        }
        dispatch(fetchDonationsSuccess(posts));
        return Promise.resolve(posts);
      })
      .catch(err => console.error('Error: ', err));
  };
}


export function fetchDetails(id) {
  return dispatch => {
    dispatch(requestFetchDetails(id));

    return fetch('/donations/details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `id=${id}`,
        })
      .then(response =>
        response.json().then(responseJson => ({
          posts: responseJson,
          responseJson,
        })),
      )
      .then(({ posts, responseJson }) => {
        if (!responseJson) {
          // If there was a problem, we want to
          // dispatch the error condition
          dispatch(fetchDetailsError('Fail'));
          return Promise.reject(posts);
        }
        // Dispatch the success action
        dispatch(fetchDetailsSuccess(posts));
        return Promise.resolve(posts);
      })
      .catch(err => console.error('Error: ', err));
  };
}
