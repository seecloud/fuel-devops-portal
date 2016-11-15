import React from 'react';
import {Route, IndexRoute, Redirect} from 'react-router';
import {partial} from 'lodash';

import {requireAuthHook, prohibitAuthHook, logoutHook} from './routerHooks';

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

export default function createRoutes(stores) {
  return (
    <Route path='/' component={App}>
      <IndexRoute
        components={{main: DashboardPage}}
        onEnter={partial(requireAuthHook, stores)}
      />

      <Route
        path='login'
        components={{main: LoginPage}}
        onEnter={partial(prohibitAuthHook, stores)}
      />
      <Route
        path='logout'
        onEnter={partial(logoutHook, stores)}
      />

      <Route
        path='cloud-status'
        components={{main: ({children}) => children, sidebar: CloudStatusSidebar}}
        onEnter={partial(requireAuthHook, stores)}
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
        onEnter={partial(requireAuthHook, stores)}
      />
      <Route
        path='capacity-management'
        components={{main: CapacityManagementPage}}
        onEnter={partial(requireAuthHook, stores)}
      />
      <Route
        path='resource-optimization'
        components={{main: ResourceOptimizationPage}}
        onEnter={partial(requireAuthHook, stores)}
      />
      <Route
        path='security-monitoring'
        components={{main: SecurityMonitoringPage}}
        onEnter={partial(requireAuthHook, stores)}
      />
      <Route
        path='infrastructure'
        components={{main: InfrastructurePage}}
        onEnter={partial(requireAuthHook, stores)}
      />
      <Redirect from='*' to='/' />
    </Route>
  );
}
