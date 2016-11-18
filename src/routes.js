import React from 'react';
import {Route, IndexRoute, Redirect} from 'react-router';

import {requireAuthHook, prohibitAuthHook, logoutHook, fetchDataHook} from './routerHooks';

import App from './components/App';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import CloudStatusSidebar from './components/CloudStatusSidebar';
import CloudStatusOverviewPage from './components/CloudStatusOverviewPage';
import CloudStatusAvailabilityPage from './components/CloudStatusAvailabilityPage';
import CloudStatusHealthPage from './components/CloudStatusHealthPage';
import CloudIntelligencePage from './components/CloudIntelligencePage';
import CapacityManagementPage from './components/CapacityManagementPage';
import ResourceOptimizationPage from './components/ResourceOptimizationPage';
import SecurityMonitoringPage from './components/SecurityMonitoringPage';
import InfrastructurePage from './components/InfrastructurePage';
import InfrastructureSidebar from './components/InfrastructureSidebar';
import InfrastructureServicePage from './components/InfrastructureServicePage';

export default function createRoutes(stores) {
  return (
    <Route
      path='/'
      component={App}
      onEnter={fetchDataHook.bind(null, stores, App.fetchData)}
    >
      <IndexRoute
        components={{main: DashboardPage}}
        onEnter={requireAuthHook.bind(null, stores)}
      />

      <Route
        path='login'
        components={{main: LoginPage}}
        onEnter={prohibitAuthHook.bind(null, stores)}
      />
      <Route
        path='logout'
        onEnter={logoutHook.bind(null, stores)}
      />

      <Route
        path='cloud-status'
        components={{main: ({children}) => children, sidebar: CloudStatusSidebar}}
        onEnter={requireAuthHook.bind(null, stores)}
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
        onEnter={requireAuthHook.bind(null, stores)}
      />
      <Route
        path='capacity-management'
        components={{main: CapacityManagementPage}}
        onEnter={requireAuthHook.bind(null, stores)}
      />
      <Route
        path='resource-optimization'
        components={{main: ResourceOptimizationPage}}
        onEnter={requireAuthHook.bind(null, stores)}
      />
      <Route
        path='security-monitoring'
        components={{main: SecurityMonitoringPage}}
        onEnter={requireAuthHook.bind(null, stores)}
      />
      <Route
        path='infrastructure'
        components={{main: ({children}) => children, sidebar: InfrastructureSidebar}}
        onEnter={requireAuthHook.bind(null, stores)}
      >
        <IndexRoute
          component={InfrastructurePage}
          onEnter={fetchDataHook.bind(null, stores, InfrastructurePage.fetchData)}
        />
        <Route
          path=':serviceId'
          component={InfrastructureServicePage}
          onEnter={InfrastructureServicePage.onEnter.bind(null, stores)}
        />
      </Route>
      <Redirect from='*' to='/' />
    </Route>
  );
}
