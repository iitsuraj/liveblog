import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as apiActions from '../actions/apiActions';
import * as userActions from '../actions/userActions';

class SortContainer extends Component {
  render() {
    const { getEntriesSorted } = this.props;

    return (
      <div className="liveblog-sort-container">
        <label htmlFor="liveblog-sort">
          <span>Sort</span>
          <select
            name="liveblog-sort"
            id="liveblog-sort"
            onChange={e => getEntriesSorted(e.target.value)}
          >
            <option value="ASC">Latest</option>
            <option value="DESC">Oldest</option>
          </select>
        </label>
      </div>
    );
  }
}

SortContainer.propTypes = {
  getEntriesSorted: PropTypes.func,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    ...apiActions,
    ...userActions,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SortContainer);
