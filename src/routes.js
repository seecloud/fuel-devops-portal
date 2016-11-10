import React from 'react';
import {Router, Route, IndexRoute, Redirect, browserHistory} from 'react-router';

import {requireAuthHook, prohibitAuthHook} from './routerHooks';
import uiState from './stores/uiState';

import App from './components/App';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import CloudStatusSidebar from './components/cloudStatusSidebar';
import CloudStatusOverviewPage from './components/CloudStatusOverviewPage';
import CloudStatusAvailabilityPage from './components/CloudStatusAvailabilityPage';
import CloudStatusHealthPage from './components/CloudStatusHealthPage';
import CloudIntelligencePage from './components/CloudIntelligencePage';
import CapacityManagementPage from './components/CapacityManagementPage';
import ResourceOptimizationPage from './components/ResourceOptimizationPage';
import SecurityMonitoringPage from './components/SecurityMonitoringPage';
import InfrastructurePage from './components/InfrastructurePage';

export default (
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <IndexRoute
        components={{main: DashboardPage}}
        onEnter={requireAuthHook}
      />

      <Route
        path='login'
        components={{main: LoginPage}}
        onEnter={prohibitAuthHook}
      />
      <Route
        path='logout'
        onEnter={(nextState, replace) => {
          uiState.authenticated = false;
          replace('/login');
        }}
      />

      <Route
        path='cloud-status'
        components={{main: ({children}) => children, sidebar: CloudStatusSidebar}}
        onEnter={requireAuthHook}
      >
        <IndexRoute
          component={CloudStatusOverviewPage}
        />
        <Route
          path='availability'
          component={CloudStatusAvailabilityPage}
        />
        <Route
          path='health'
          component={CloudStatusHealthPage}
        />
      </Route>
      <Route
        path='cloud-intelligence'
        components={{main: CloudIntelligencePage}}
        onEnter={requireAuthHook}
      />
      <Route
        path='capacity-management'
        components={{main: CapacityManagementPage}}
        onEnter={requireAuthHook}
      />
      <Route
        path='resource-optimization'
        components={{main: ResourceOptimizationPage}}
        onEnter={requireAuthHook}
      />
      <Route
        path='security-monitoring'
        components={{main: SecurityMonitoringPage}}
        onEnter={requireAuthHook}
      />
      <Route
        path='infrastructure'
        components={{main: InfrastructurePage}}
        onEnter={requireAuthHook}
      />
      <Redirect from='*' to='/' />
    </Route>
  </Router>
);
