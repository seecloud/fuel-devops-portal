import './styles/loading.less';
import './styles/main.less';

import React from 'react';
import ReactDOM from 'react-dom';
import {Router, browserHistory} from 'react-router';
import {Provider} from 'mobx-react';

import createRoutes from './routes';
import UIState from './stores/UIState';
import Regions from './stores/Regions';
import RegionAvailabilityData from './stores/RegionAvailabilityData';
import RegionHealthData from './stores/RegionHealthData';
import RegionOverviewData from './stores/RegionOverviewData';
import RegionServicesOverviewData from './stores/RegionServicesOverviewData';

const stores = {
  uiState: new UIState(),
  regions: new Regions(),
  regionAvailabilityData: new RegionAvailabilityData(),
  regionHealthData: new RegionHealthData(),
  regionOverviewData: new RegionOverviewData(),
  regionServicesOverviewData: new RegionServicesOverviewData()
};

ReactDOM.render(
  <Provider {...stores}>
    <Router history={browserHistory}>
      {createRoutes(stores)}
    </Router>
  </Provider>,
  document.getElementById('root')
);
