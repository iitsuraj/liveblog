import './index.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Polyfills from './components/polyfills';
import configureStore from './components/store';
import AppContainer from './components/containers/AppContainer';

Polyfills();

const store = configureStore();

/* eslint-disable camelcase, no-undef */
__webpack_public_path__ = `${window.liveblog_settings.plugin_dir}assets/`;

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('wpcom-liveblog-container'),
); 
