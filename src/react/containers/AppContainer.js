/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as apiActions from '../actions/apiActions';
import * as configActions from '../actions/configActions';
import * as eventsActions from '../actions/eventsActions';
import Entries from '../components/Entries';
import PaginationContainer from '../containers/PaginationContainer';
import SortContainer from '../containers/SortContainer';
import EventsContainer from '../containers/EventsContainer';
import UpdateButton from '../components/UpdateButton';
import Editor from '../components/Editor';

class AppContainer extends Component {
  constructor() {
    super();
    this.eventsContainer = document.getElementById('liveblog-key-events');
  }

  RefreshLiveBlogAdCodes() {
    setTimeout(() => {
      const adClasses = document.querySelectorAll('.liveblog-card-ad');
      const adClassLen = adClasses.length;
      let count = 0;
      let adDiv = '';
      let adcodeslot = '';
      const definedAdSlots = {};
      // eslint-disable-next-line no-undef
      googletag.cmd.push(() => {
        for (count = 0; count < adClassLen; count += 1) {
          adDiv = adClasses[count].getAttributeNode('id').value;
          adcodeslot = adClasses[count].getAttributeNode('title').value;
          // eslint-disable-next-line no-undef
          definedAdSlots[adDiv] = googletag.defineSlot(
            // eslint-disable-next-line no-undef
            adcodeslot, [300, 250], adDiv).addService(googletag.pubads());
          // eslint-disable-next-line no-undef
          googletag.display(adDiv);
          // eslint-disable-next-line no-undef
          googletag.pubads().refresh([definedAdSlots[adDiv]]);
        }
      });
    }, 2000);
  }

  componentDidMount() {
    const { loadConfig, getEntries, getEvents, startPolling } = this.props;
    loadConfig(window.liveblog_settings);
    getEntries(1, window.location.hash);
    if (window.liveblog_settings.state !== 'archive') {
      startPolling();
    }
    this.RefreshLiveBlogAdCodes();
    if (this.eventsContainer) getEvents();
  }

  render() {
    const { loading, entries, polling, mergePolling, config } = this.props;
    const canEdit = config.is_liveblog_editable === '1';

    return (
      <div style={{ position: 'relative' }}>
        {canEdit && <Editor isEditing={false} />}
        <UpdateButton polling={polling} click={() => mergePolling()} />
        <div className="liveblog-welcome-note">Live Updates</div>
        { entries.length !== 0 && <SortContainer /> }
        <Entries loading={loading} entries={entries} />
        <PaginationContainer />
        {this.eventsContainer && <EventsContainer container={this.eventsContainer} title={this.eventsContainer.getAttribute('data-title')} />}
      </div>
    );
  }
}

AppContainer.propTypes = {
  loadConfig: PropTypes.func,
  getEntries: PropTypes.func,
  getEvents: PropTypes.func,
  startPolling: PropTypes.func,
  api: PropTypes.object,
  entries: PropTypes.array,
  page: PropTypes.number,
  loading: PropTypes.bool,
  polling: PropTypes.array,
  mergePolling: PropTypes.func,
  config: PropTypes.object,
};

const mapStateToProps = (state) => {
  let entries = Object.keys(state.api.entries).map(key => state.api.entries[key]);
  if (state.pagination.page === 1) {
    entries = entries.slice(0, state.config.entries_per_page);
  }

  return {
    page: state.pagination.page,
    loading: state.api.loading,
    entries,
    polling: Object.keys(state.polling.entries),
    config: state.config,
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    ...configActions,
    ...apiActions,
    ...eventsActions,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
