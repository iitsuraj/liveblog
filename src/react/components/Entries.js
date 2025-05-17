import React from 'react';
import PropTypes from 'prop-types';

import EntryContainer from '../containers/EntryContainer';

let divClass = 'liveblog-feed';
if (window.liveblog_settings.liveblog_template === 'twocolumn') {
  divClass = 'lvblg-rgt withouthlgt';
}
const Entries = ({ loading, entries }) => (
  <div className={loading ? 'liveblog-feed is-loading' : divClass}>
    {
      entries.length === 0 && !loading
        ? <div className="liveblog-empty-message">There are no entries on this page.</div>
        : entries.map(entry => <EntryContainer entry={entry} key={entry.id} />)
    }
  </div>
);

Entries.propTypes = {
  entries: PropTypes.array,
  loading: PropTypes.bool,
};

export default Entries;
