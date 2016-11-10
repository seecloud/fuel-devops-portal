import React from 'react';
import {Router, Route, IndexRoute, Redirect, browserHistory} from 'react-router';

import {requireAuthHook, prohibitAuthHook} from './router_hooks';
import uiState from './stores/ui_state';

import App from './components/app';
import LoginPage from './components/login_page';
import DashboardPage from './components/dashboard_page';
import CloudStatusSidebar from './components/cloud_status_sidebar';
import CloudStatusOverviewPage from './components/cloud_status_overview_page';
import CloudStatusAvailabilityPage from './components/cloud_status_availability_page';
import CloudStatusHealthPage from './components/cloud_status_health_page';
import CloudIntelligencePage from './components/cloud_intelligence_page';
import CapacityManagementPage from './components/capacity_management_page';
import ResourceOptimizationPage from './components/resource_optimization_page';
import SecurityMonitoringPage from './components/security_monitoring_page';
import InfrastructurePage from './components/infrastructure_page';

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
