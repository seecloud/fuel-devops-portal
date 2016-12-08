import React from 'react';
import {Route, IndexRoute, Redirect} from 'react-router';

import {
  requireAuthHook, prohibitAuthHook, logoutHook, fetchDataHook, composeEnterHooks
} from './routerHooks';

import App from './components/App';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';
import StatusOverviewSingleRegionPage from './components/status/StatusOverviewSingleRegionPage';
import StatusOverviewMultiRegionPage from './components/status/StatusOverviewMultiRegionPage';
import AvailabilitySingleRegionPage from './components/status/AvailabilitySingleRegionPage';
import AvailabilityMultiRegionPage from './components/status/AvailabilityMultiRegionPage';
import HealthSingleRegionPage from './components/status/HealthSingleRegionPage';
import HealthMultiRegionPage from './components/status/HealthMultiRegionPage';
import CloudIntelligencePage from './components/CloudIntelligencePage';
import CloudIntelligenceInventoryPage from './components/CloudIntelligenceInventoryPage';
import CloudIntelligenceHistoryPage from './components/CloudIntelligenceHistoryPage';
import CapacityManagementPage from './components/CapacityManagementPage';
import RunbooksPage from './components/RunbooksPage';
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
        <Route path='status'>
          <IndexRoute
            component={StatusOverviewSingleRegionPage}
            onEnter={
              fetchDataHook.bind(null, stores, StatusOverviewSingleRegionPage.fetchData)
            }
          />
          <Route
            path='availability'
            component={AvailabilitySingleRegionPage}
            onEnter={
              fetchDataHook.bind(null, stores, AvailabilitySingleRegionPage.fetchData)
            }
          />
          <Route
            path='health'
            component={HealthSingleRegionPage}
            onEnter={
              fetchDataHook.bind(null, stores, HealthSingleRegionPage.fetchData)
            }
          />
        </Route>
        <Route path='intelligence'>
          <IndexRoute
            component={CloudIntelligencePage}
          />
          <Route
            path='inventory'
            component={CloudIntelligenceInventoryPage}
          />
          <Route
            path='history'
            component={CloudIntelligenceHistoryPage}
          />
        </Route>
        <Route
          path='capacity'
          component={CapacityManagementPage}
        />
        <Route
          path='runbooks'
          component={RunbooksPage}
        />
        <Route
          path='security'
          component={SecurityMonitoringPage}
        />
      </Route>

      <Route
        path='all-regions'
        onEnter={requireAuthHook.bind(null, stores)}
      >
        <Route
          path='status'
        >
          <IndexRoute
            component={StatusOverviewMultiRegionPage}
            onEnter={
              fetchDataHook.bind(null, stores, StatusOverviewMultiRegionPage.fetchData)
            }
          />
          <Route
            path='availability'
            component={AvailabilityMultiRegionPage}
            onEnter={
              fetchDataHook.bind(null, stores, AvailabilityMultiRegionPage.fetchData)
            }
          />
          <Route
            path='health'
            component={HealthMultiRegionPage}
            onEnter={
              fetchDataHook.bind(null, stores, HealthMultiRegionPage.fetchData)
            }
          />
        </Route>
        <Route path='intelligence'>
          <IndexRoute
            component={CloudIntelligencePage}
          />
          <Route
            path='inventory'
            component={CloudIntelligenceInventoryPage}
          />
          <Route
            path='history'
            component={CloudIntelligenceHistoryPage}
          />
        </Route>
        <Route
          path='capacity'
          component={CapacityManagementPage}
        />
        <Route
          path='runbooks'
          component={RunbooksPage}
        />
        <Route
          path='security'
          component={SecurityMonitoringPage}
        />
      </Route>

      <Redirect from='*' to='/' />
    </Route>
  );
}
