/* eslint-disable no-return-assign */
import DOMPurify from 'dompurify';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as apiActions from '../actions/apiActions';
import * as userActions from '../actions/userActions';
import { triggerOembedLoad, formattedTime } from '../utils/utils';
import Editor from '../components/Editor';
import DeleteConfirmation from '../components/DeleteConfirmation';
import SocialShare from '../components/SocialShare';

class EntryContainer extends Component {
  constructor(props) {
    super(props);

    this.isEditing = () => {
      const { user, entry } = this.props;
      return user.entries[entry.id] && user.entries[entry.id].isEditing;
    };
    this.edit = () => this.props.entryEditOpen(this.props.entry.id);
    this.close = () => this.props.entryEditClose(this.props.entry.id);
    this.delete = () => this.props.deleteEntry(this.props.entry.id);
    this.scrollIntoView = () => {
      const rect = this.node.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      document.documentElement.scrollTop = (rect.top + scrollTop) - 150;
      this.props.resetScrollOnEntry(`id_${this.props.entry.id}`);
    };
    this.state = {
      showPopup: false,
    };
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup,
    });
  }

  componentDidMount() {
    const { activateScrolling } = this.props.entry;
    triggerOembedLoad(this.node);
    if (activateScrolling) this.scrollIntoView();
  }

  componentDidUpdate(prevProps) {
    const { activateScrolling } = this.props.entry;
    if (activateScrolling && activateScrolling !== prevProps.entry.activateScrolling) {
      this.scrollIntoView();
    }
    if (this.props.entry.render !== prevProps.entry.render) {
      triggerOembedLoad(this.node);
    }
  }

  entryActions() {
    const { config } = this.props;
    if (config.is_liveblog_editable !== '1') return false;

    return (
      <footer className="liveblog-entry-tools">
        {
          this.isEditing()
            ? <button className="liveblog-btn liveblog-btn-small" onClick={this.close}>
              Close Editor
            </button>
            : <button className="liveblog-btn liveblog-btn-small" onClick={this.edit}>
              Edit
            </button>
        }
        <button
          className="liveblog-btn liveblog-btn-small liveblog-btn-delete"
          onClick={this.togglePopup.bind(this)}>
          Delete
        </button>
      </footer>
    );
  }

  render() {
    const { entry, config } = this.props;
    const tagMap = { h2: 'h2', h3: 'h3' };
    const HeadingTag = tagMap[entry.heading_tag] || 'div';
    if (window.liveblog_settings.liveblog_template === 'twocolumn') {
      return (
        <div id={entry.id}>
          <div
            id={`id_${entry.id}`}
            ref={node => this.node = node}
            className='brdr20 liveblog-entry-twocolumn'
          >
            <div className="liveblog-entry-main">
              {this.state.showPopup ?
                <DeleteConfirmation
                  text="Are you sure you want to delete this entry?"
                  onConfirmDelete={this.delete}
                  onCancel={this.togglePopup.bind(this)}
                />
                : null
              }
              {
                this.isEditing()
                  ? (
                    <div className="liveblog-entry-edit">
                      <Editor entry={entry} isEditing={true} />
                    </div>
                  )
                  : (
                    <div>
                      <div className="lvblg-box-shr">
                        <div className="ieo-datetime">
                          <span>{formattedTime(entry.entry_time, config.utc_offset, 'H:i')} (IST) </span>
                          <span>{formattedTime(entry.entry_time, config.utc_offset, 'j M Y')}</span>
                        </div>
                        <SocialShare entry={entry} />
                      </div>
                      <div className="lvblg-box">
                        {
                          <HeadingTag
                            className="heading-lvblg"
                            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(entry.heading) }} // phpcs:ignore WordPressVIPMinimum.JS.DangerouslySetInnerHTML.Found
                          />
                        }
                        <div
                          className="body-lvblg"
                          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(entry.render, { ADD_TAGS: ['iframe'], KEEP_CONTENT: false, ADD_ATTR: ['target'] }) }} />
                      </div>
                      <div className="clear"></div>
                    </div>
                  )
              }
              {this.entryActions()}
            </div>
          </div>
          { entry.ads && (
            <div
              className="liveblog-entry-ad" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(entry.ads) }} // phpcs:ignore WordPressVIPMinimum.JS.DangerouslySetInnerHTML.Found
            />
          ) }
        </div>
      );
    }
    return (
      <article
        id={`id_${entry.id}`}
        ref={node => this.node = node}
        className={`liveblog-entry ${entry.key_event ? 'is-key-event' : ''} ${entry.css_classes}`}
      >
        <div className="liveblog-entry-main">
          {this.state.showPopup ?
            <DeleteConfirmation
              text="Are you sure you want to delete this entry?"
              onConfirmDelete={this.delete}
              onCancel={this.togglePopup.bind(this)}
            />
            : null
          }
          {
            this.isEditing()
              ? (
                <div className="liveblog-entry-edit">
                  <Editor entry={entry} isEditing={true} />
                </div>
              )
              : (
                <div>
                  <div>
                    <span className="liveblog-meta-time">
                      {formattedTime(entry.entry_time, config.utc_offset, 'H:i')} (IST) {formattedTime(entry.entry_time, config.utc_offset, 'j M Y')}
                    </span>
                  </div>
				  {
					entry.heading_tag === 'h3' ?
						<h3 className="liveblog-entry-heading" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(entry.heading) }} />
						: entry.heading_tag === 'h2' ?
						<h2 className="liveblog-entry-heading" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(entry.heading) }} />
						: <div className="liveblog-entry-heading" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(entry.heading) }} />
				  }
                  <div
                    className="liveblog-entry-content"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(entry.render, { ADD_TAGS: ['iframe'], KEEP_CONTENT: false, ADD_ATTR: ['target'] }) }} />
                  <SocialShare entry={entry} />
                  { entry.ads && (
                    <div
                      className="liveblog-entry-ad"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(entry.ads) }} />
                  ) }
                </div>
              )
          }
          {this.entryActions()}
        </div>
      </article>
    );
  }
}

EntryContainer.propTypes = {
  user: PropTypes.object,
  config: PropTypes.object,
  entry: PropTypes.object,
  entryEditOpen: PropTypes.func,
  entryEditClose: PropTypes.func,
  deleteEntry: PropTypes.func,
  activateScrolling: PropTypes.bool,
  resetScrollOnEntry: PropTypes.func,
  showPopup: PropTypes.bool,
};

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    ...apiActions,
    ...userActions,
  }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EntryContainer);
