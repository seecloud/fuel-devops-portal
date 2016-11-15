import './styles/loading.less';
import './styles/main.less';

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory} from 'react-router';
import {Provider} from 'mobx-react';

import createRoutes from './routes';
import UIState from './stores/UIState';

const stores = {
  uiState: new UIState()
};

ReactDOM.render(
  <Provider {...stores}>
    <Router history={browserHistory}>
      {createRoutes(stores)}
    </Router>
  </Provider>,
  document.getElementById('root')
);
