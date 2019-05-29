import {
  CREATE_DONATION_INITIAL,
  CREATE_DONATION_REQUEST,
  CREATE_DONATION_SUCCESS,
  CREATE_DONATION_FAILURE,

  UPDATE_BOX_REQUEST,
  UPDATE_BOX_SUCCESS,
  UPDATE_BOX_FAILURE,


  EDIT_DONATION_INITIAL,
  EDIT_DONATION_REQUEST,
  EDIT_DONATION_SUCCESS,
  EDIT_DONATION_FAILURE,

  FETCH_DONATIONS_REQUEST,
  FETCH_DONATIONS_SUCCESS,
  FETCH_DONATIONS_FAILURE,

  FETCH_DETAILS_REQUEST,
  FETCH_DETAILS_SUCCESS,
  FETCH_DETAILS_FAILURE,

  FETCH_BLKCHAIN_REQUEST,
  FETCH_BLKCHAIN_SUCCESS,
  FETCH_BLKCHAIN_FAILURE,

  FETCH_BOXDTL_REQUEST,
  FETCH_BOXDTL_SUCCESS,
  FETCH_BOXDTL_FAILURE,

  FETCH_BOXCNT_REQUEST,
  FETCH_BOXCNT_SUCCESS,
  FETCH_BOXCNT_FAILURE,

  FETCH_NPO_REQUEST,
  FETCH_NPO_SUCCESS,
  FETCH_NPO_FAILURE,

  FETCH_NPOVOLUN_REQUEST,
  FETCH_NPOVOLUN_SUCCESS,
  FETCH_NPOVOLUN_FAILURE,

  FETCH_STATUS_REQUEST,
  FETCH_STATUS_SUCCESS,
  FETCH_STATUS_FAILURE,
  FETCH_ALL_SUCCESS,
} from '../actions/posts';

import {
  CREATE_COLLECTION_INITIAL,
  CREATE_COLLECTION_REQUEST,
  CREATE_COLLECTION_SUCCESS,
  CREATE_COLLECTION_FAILURE,

  FETCH_COLLECTIONS_REQUEST,
  FETCH_COLLECTIONS_FAILURE,
  FETCH_COLLECTIONS_SUCCESS,

  MODIFY_COLLECTION_INITIAL,
  MODIFY_COLLECTION_REQUEST,
  MODIFY_COLLECTION_SUCCESS,
  MODIFY_COLLECTION_FAILURE,

  REMOVE_COLLECTION_INITIAL,
  REMOVE_COLLECTION_REQUEST,
  REMOVE_COLLECTION_SUCCESS,
  REMOVE_COLLECTION_FAILURE,

  UPDATE_COLLECTION_DISTRIBUTION_INITIAL,
  UPDATE_COLLECTION_DISTRIBUTION_REQUEST,
  UPDATE_COLLECTION_DISTRIBUTION_SUCCESS,
  UPDATE_COLLECTION_DISTRIBUTION_FAILURE,

  FETCH_COLLECTION_DISTRIBUTION_REQUEST,
  FETCH_COLLECTION_DISTRIBUTION_SUCCESS,
  FETCH_COLLECTION_DISTRIBUTION_FAILURE,
  FETCH_RECEIPT_SUCCESS,
} from '../actions/happiness'

import {
  REGISTER_RECIPIENT_CATEGORY_REQUEST,
  REGISTER_RECIPIENT_CATEGORY_SUCCESS,
  REGISTER_RECIPIENT_CATEGORY_FAILURE,

  FETCH_RECIPIENT_CATEGORY_REQUEST,
  FETCH_RECIPIENT_CATEGORY_SUCCESS,
  FETCH_RECIPIENT_CATEGORY_FAILURE,

  FETCH_SWITCH_REQUEST,
  FETCH_SWITCH_SUCCESS,
  FETCH_SWITCH_FAILURE,

  CHANGE_SWITCH_STATUS_REQUEST,
  CHANGE_SWITCH_STATUS_SUCCESS,
  CHANGE_SWITCH_STATUS_FAILURE,

  FETCH_SEASON_REQUEST,
  FETCH_SEASON_SUCCESS,
  FETCH_SEASON_FAILURE,

  CHANGE_SEASON_REQUEST,
  CHANGE_SEASON_SUCCESS,
  CHANGE_SEASON_FAILURE,
} from '../actions/configuration'



export default function posts(
  state = {
    isFetching: false,
  },
  action,
) {
  switch (action.type) {
    case CREATE_DONATION_INITIAL:
      return Object.assign({}, state, {
        isFetching: false,
        message: null,
      });
    case CREATE_DONATION_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case CREATE_DONATION_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        message: 'Donation created successfully',
      });
    case CREATE_DONATION_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message:
          'Due to security reasons posts creation is closed in demo version. Please setup locally to test',
      });

      case UPDATE_BOX_REQUEST:
        return Object.assign({}, state, {
          isFetching: true,
        });
      case UPDATE_BOX_SUCCESS:
        return Object.assign({}, state, {
          isFetching: false,
          message: '최종 수혜자 정보 입력에 성공하였습니다.',
        });
      case UPDATE_BOX_FAILURE:
        return Object.assign({}, state, {
          isFetching: false,
          message:
            '최종 수혜자 정보 입력에 성공하였습니다. 관리자에게 문의해주세요.',
        });

    case EDIT_DONATION_INITIAL:
      return Object.assign({}, state, {
        isFetching: false,
        message: null,
      });
    case EDIT_DONATION_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case EDIT_DONATION_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        message: 'Donation created successfully',
        new_id: action.post.new_id
      });
    case EDIT_DONATION_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message:
          'Due to security reasons posts creation is closed in demo version. Please setup locally to test',
      });

    case FETCH_DONATIONS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_DONATIONS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        posts: action.posts,
      });
    case FETCH_DONATIONS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message: 'Something wrong happened. Please come back later',
      });

    case FETCH_BLKCHAIN_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_BLKCHAIN_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        existingBoxes: action.existingBoxes,
      });
    case FETCH_BLKCHAIN_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message: 'Something wrong happened from Blockchain.',
      });

    case FETCH_BOXDTL_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_BOXDTL_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        info: action.info,
      });
    case FETCH_BOXDTL_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message: 'Something wrong happened from Blockchain.',
      });

    case FETCH_BOXCNT_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_BOXCNT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        boxcnt: action.boxcnt,
      });
    case FETCH_BOXCNT_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message: 'Something wrong happened from Blockchain.',
      });

    case FETCH_NPO_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_NPO_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        npoBoxes: action.npoBoxes,
        message: "정보를 받아왔습니다."
      });
    case FETCH_NPO_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message: 'Something wrong happened from Blockchain.',
      });

      case FETCH_NPOVOLUN_REQUEST:
        return Object.assign({}, state, {
          isFetching: true,
        });
      case FETCH_NPOVOLUN_SUCCESS:
        return Object.assign({}, state, {
          isFetching: false,
          npoBoxesForVolun: action.npoBoxesForVolun,
          message: "정보를 받아왔습니다."
        });
      case FETCH_NPOVOLUN_FAILURE:
        return Object.assign({}, state, {
          isFetching: false,
          message: 'Something wrong happened from Blockchain.',
        });


      case FETCH_STATUS_REQUEST:
        return Object.assign({}, state, {
          isFetching: true,
        });
      case FETCH_STATUS_SUCCESS:
        return Object.assign({}, state, {
          isFetching: false,
          status: action.status,
        });
      case FETCH_ALL_SUCCESS:
        return Object.assign({}, state, {
          isFetching: false,
          allBoxes: action.allBoxes,
        });
      case FETCH_STATUS_FAILURE:
        return Object.assign({}, state, {
          isFetching: false,
          message: 'Something wrong happened from Blockchain.',
        });




    case FETCH_DETAILS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_DETAILS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        details: action.details,
        isNew: action.details[0].is_new == 1,
        hasPrev: action.details[0].prev_donation_id != '',
      });
    case FETCH_DETAILS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message: 'Something wrong happened. Please come back later',
      });

    case CREATE_COLLECTION_INITIAL:
      return Object.assign({}, state, {
        isFetching: false,
        message: null,
      });
    case CREATE_COLLECTION_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case CREATE_COLLECTION_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        message: 'Success.',
        errorMessage: null,
      });
    case CREATE_COLLECTION_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message: null,
        errorMessage: action.message,
      });

    case FETCH_COLLECTIONS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_COLLECTIONS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        donations: action.posts.donations,
        collectionsForMaking: action.posts.collectionsForMaking,
      });
    case FETCH_COLLECTIONS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message: 'Due to security reasons posts creation is closed in demo version. Please setup locally to test',

      });

    case MODIFY_COLLECTION_INITIAL:
      return Object.assign({}, state, {
        isFetching: false,
        message: null,
      });
    case MODIFY_COLLECTION_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case MODIFY_COLLECTION_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        message: 'Success.',
        errorMessage: null,
      });
    case MODIFY_COLLECTION_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message: null,
        errorMessage: 'Fail. Ask to admin.',
      });
    case REMOVE_COLLECTION_INITIAL:
      return Object.assign({}, state, {
        isFetching: false,
        message: null,
      });
    case REMOVE_COLLECTION_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case REMOVE_COLLECTION_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        message: 'Success.',
        errorMessage: null,
      });
    case REMOVE_COLLECTION_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message: null,
        errorMessage: 'Fail. Ask to admin.',
      });

     /* change category actions */
    case REGISTER_RECIPIENT_CATEGORY_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });

    case REGISTER_RECIPIENT_CATEGORY_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.message,
        message: null,
      });

    case REGISTER_RECIPIENT_CATEGORY_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: null,
        message: 'Saved recipient category successfully.',
      });

    /* fetch category actions */
    case FETCH_RECIPIENT_CATEGORY_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });

    case FETCH_RECIPIENT_CATEGORY_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.message,
      });

    case FETCH_RECIPIENT_CATEGORY_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        categoriesType1: action.posts.type_1,
        categoriesType2: action.posts.type_2,
      });

    /* fetch switch information */
    case FETCH_SWITCH_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });

    case FETCH_SWITCH_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.message,
      });

    case FETCH_SWITCH_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        switches: action.posts
      });

    /* change switch information */
    case CHANGE_SWITCH_STATUS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });

    case CHANGE_SWITCH_STATUS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.message,
      });

    case CHANGE_SWITCH_STATUS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
      });

    /* fetch season information */
    case FETCH_SEASON_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });

    case FETCH_SEASON_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.message,
      });

    case FETCH_SEASON_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        season: action.posts
      });

    /* change seoson information */
    case CHANGE_SEASON_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });

    case CHANGE_SEASON_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: 'Fail to change season. Ask to admin',
        message: null
      });

    case CHANGE_SEASON_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: null,
        message: 'Change season successfully'
      });

    /* fetch collection distribution */
    case FETCH_COLLECTION_DISTRIBUTION_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_COLLECTION_DISTRIBUTION_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        volunteers: action.post.volunteers,
        collections: action.post.collections,
        quantities: action.post.quantities,

      });
    case FETCH_COLLECTION_DISTRIBUTION_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message: 'Due to security reasons posts creation is closed in demo version. Please setup locally to test',

      });

    /* update collection distribution */
    case UPDATE_COLLECTION_DISTRIBUTION_INITIAL:
      return Object.assign({}, state, {
        isFetching: false,
        message: null,
      });
    case UPDATE_COLLECTION_DISTRIBUTION_REQUEST:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case UPDATE_COLLECTION_DISTRIBUTION_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        message: 'Success.',
        errorMessage: null,
      });
    case UPDATE_COLLECTION_DISTRIBUTION_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        message: null,
        errorMessage: 'Fail. Ask to admin.',
      });
    case FETCH_RECEIPT_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: null,
        receipt: action.post,
    });


    default:
      return state;
  }
}
