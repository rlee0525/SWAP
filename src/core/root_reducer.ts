import { combineReducers } from 'redux';
import searchResultReducer from 'modules/search/reducer';
import postReducer from 'modules/post/reducer';
import userReducer from 'core/navbar/reducer';
import queryReducer from 'modules/search/queryReducer';

const rootReducer = combineReducers({
  searchResult: searchResultReducer,
  post: postReducer,
  user: userReducer,
  currentQuery: queryReducer
});

export default rootReducer;
