import React from 'react';
import {Route, IndexRoute, Redirect} from 'react-router';

import {
  requireAuthHook, prohibitAuthHook, logoutHook, fetchDataHook, composeEnterHooks
} from './routerHooks';

import App from './components/App';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import CloudStatusOverviewSingleRegionPage from './components/CloudStatusOverviewSingleRegionPage';
import CloudStatusOverviewMultiRegionPage from './components/CloudStatusOverviewMultiRegionPage';
import CloudStatusAvailabilitySingleRegionPage from
  './components/CloudStatusAvailabilitySingleRegionPage';
import CloudStatusAvailabilityMultiRegionPage from
  './components/CloudStatusAvailabilityMultiRegionPage';
import CloudStatusHealthSingleRegionPage from './components/CloudStatusHealthSingleRegionPage';
import CloudStatusHealthMultiRegionPage from './components/CloudStatusHealthMultiRegionPage';
import CloudIntelligencePage from './components/CloudIntelligencePage';
import CapacityManagementPage from './components/CapacityManagementPage';
import ResourceOptimizationPage from './components/ResourceOptimizationPage';
import SecurityMonitoringPage from './components/SecurityMonitoringPage';

export default function createRoutes(stores) {
  return (
    <Route
      path='/'
      component={App}
      onEnter={fetchDataHook.bind(null, stores, App.fetchData)}
    >
      <IndexRoute
        component={DashboardPage}
        onEnter={requireAuthHook.bind(null, stores)}
      />

      <Route
        path='login'
        component={LoginPage}
        onEnter={prohibitAuthHook.bind(null, stores)}
      />
      <Route
        path='logout'
        onEnter={logoutHook.bind(null, stores)}
      />

      <Route
        path='region/:regionName'
        onEnter={composeEnterHooks(
          requireAuthHook.bind(null, stores),
          (nextState, replace, callback) => {
            const regionName = nextState.params.regionName;
            const region = stores.regions.items.find((region) => region.name === regionName);
            if (!region) replace('/');
            stores.uiState.activeRegionName = regionName;
            callback();
          }
        )}
        onLeave={() => {
          stores.uiState.activeRegionName = null;
        }}
      >
        <Route path='cloud-status'>
          <IndexRoute
            component={CloudStatusOverviewSingleRegionPage}
            onEnter={
              fetchDataHook.bind(null, stores, CloudStatusOverviewSingleRegionPage.fetchData)
            }
          />
          <Route
            path='availability'
            component={CloudStatusAvailabilitySingleRegionPage}
            onEnter={
              fetchDataHook.bind(null, stores, CloudStatusAvailabilitySingleRegionPage.fetchData)
            }
          />
          <Route
            path='health'
            component={CloudStatusHealthSingleRegionPage}
            onEnter={
              fetchDataHook.bind(null, stores, CloudStatusHealthSingleRegionPage.fetchData)
            }
          />
        </Route>
        <Route
          path='cloud-intelligence'
          component={CloudIntelligencePage}
        />
        <Route
          path='capacity-management'
          component={CapacityManagementPage}
        />
        <Route
          path='resource-optimization'
          component={ResourceOptimizationPage}
        />
        <Route
          path='security-monitoring'
          component={SecurityMonitoringPage}
        />
      </Route>

      <Route
        path='all-regions'
        onEnter={requireAuthHook.bind(null, stores)}
      >
        <Route
          path='cloud-status'
        >
          <IndexRoute
            component={CloudStatusOverviewMultiRegionPage}
            onEnter={
              fetchDataHook.bind(null, stores, CloudStatusOverviewMultiRegionPage.fetchData)
            }
          />
          <Route
            path='availability'
            component={CloudStatusAvailabilityMultiRegionPage}
            onEnter={
              fetchDataHook.bind(null, stores, CloudStatusAvailabilityMultiRegionPage.fetchData)
            }
          />
          <Route
            path='health'
            component={CloudStatusHealthMultiRegionPage}
            onEnter={
              fetchDataHook.bind(null, stores, CloudStatusHealthMultiRegionPage.fetchData)
            }
          />
        </Route>
        <Route
          path='cloud-intelligence'
          component={CloudIntelligencePage}
        />
        <Route
          path='capacity-management'
          component={CapacityManagementPage}
        />
        <Route
          path='resource-optimization'
          component={ResourceOptimizationPage}
        />
        <Route
          path='security-monitoring'
          component={SecurityMonitoringPage}
        />
      </Route>

      <Redirect from='*' to='/' />
    </Route>
  );
}
