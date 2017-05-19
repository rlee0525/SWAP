import { connect } from 'react-redux';
import Search from './component';
import { search } from './actions';

interface StateProps {
  user: object;
  searchResult: object [];
}

interface DispatchProps {
  search: (query: string) => void;
}

const mapStateToProps = (state: StateProps, ownProp?: any): StateProps => ({
  user: state.user,
  searchResult: state.searchResult
  // below code creates bug when viewing individual post then returning to browse
  // searchResult: state.searchResult.sort((a: object, b: object) => new Date(b.created_at) - new Date(a.created_at))
});

const mapDispatchToProps = (dispatch: any): DispatchProps => ({
  search: query => dispatch(search(query))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search);
