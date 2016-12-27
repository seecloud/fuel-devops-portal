import React from 'react';
import {Route, IndexRoute, Redirect} from 'react-router';

import {requireAuthHook, prohibitAuthHook, logoutHook, fetchDataHook} from './routerHooks';
import {composeEnterHooks, partial} from './routerHookUtils';

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
import SecurityPage from './components/security/SecurityPage';
import RunbooksPage from './components/runbooks/RunbooksPage';
import RunbookRunsPage from './components/runbooks/RunbookRunsPage';

export default function createRoutes(stores) {
  return (
    <Route
      path='/'
      component={App}
      onEnter={partial(fetchDataHook, stores)}
    >
      <IndexRoute
        component={DashboardPage}
        onEnter={partial(requireAuthHook, stores)}
      />

      <Route
        path='login'
        component={LoginPage}
        onEnter={partial(prohibitAuthHook, stores)}
      />
      <Route
        path='logout'
        onEnter={partial(logoutHook, stores)}
      />

      <Route
        path='region/:regionName'
        onEnter={composeEnterHooks(
          partial(requireAuthHook, stores),
          (nextState, replace, callback) => {
            const regionName = nextState.params.regionName;
            const region = stores.regions.get(regionName);
            if (!region) replace('/');
            callback();
          }
        )}
      >
        <Route path='status'>
          <IndexRoute
            component={StatusOverviewSingleRegionPage}
            onEnter={partial(fetchDataHook, stores)}
          />
          <Route
            path='availability'
            component={AvailabilitySingleRegionPage}
            onEnter={partial(fetchDataHook, stores)}
          />
          <Route
            path='health'
            component={HealthSingleRegionPage}
            onEnter={partial(fetchDataHook, stores)}
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
        <Route path='runbooks' >
          <IndexRoute
            component={RunbooksPage}
            onEnter={partial(fetchDataHook, stores)}
          />
          <Route
            path='runs'
            component={RunbookRunsPage}
            onEnter={partial(fetchDataHook, stores)}
          />
        </Route>
        <Route
          path='security'
          component={SecurityPage}
          onEnter={partial(fetchDataHook, stores)}
        />
      </Route>

      <Route
        path='all-regions'
        onEnter={partial(requireAuthHook, stores)}
      >
        <Route
          path='status'
        >
          <IndexRoute
            component={StatusOverviewMultiRegionPage}
            onEnter={partial(fetchDataHook, stores)}
          />
          <Route
            path='availability'
            component={AvailabilityMultiRegionPage}
            onEnter={partial(fetchDataHook, stores)}
          />
          <Route
            path='health'
            component={HealthMultiRegionPage}
            onEnter={partial(fetchDataHook, stores)}
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
        <Route path='runbooks' >
          <IndexRoute
            component={RunbooksPage}
            onEnter={partial(fetchDataHook, stores)}
          />
          <Route
            path='runs'
            component={RunbookRunsPage}
            onEnter={partial(fetchDataHook, stores)}
          />
        </Route>
        <Route
          path='security'
          component={SecurityPage}
          onEnter={partial(fetchDataHook, stores)}
        />
      </Route>

      <Redirect from='*' to='/' />
    </Route>
  );
}
