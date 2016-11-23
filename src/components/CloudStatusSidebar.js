import React, {Component} from 'react';
import {inject} from 'mobx-react';

import SideNavbar from './SideNavbar';

@inject('uiState', 'regions')
export default class CloudStatusSidebar extends Component {
  render() {
    const activeRegionName = this.props.uiState.activeRegionName;
    const urlPrefix = activeRegionName ?
      `/region/${encodeURIComponent(activeRegionName)}/` :
      '/all-regions/';

    return (
      <SideNavbar
        navigationItems={[
          {
            url: urlPrefix + 'cloud-status',
            title: 'Overview',
            iconClassName: 'overview-icon'
          },
          {
            url: urlPrefix + 'cloud-status/availability',
            title: 'Availability',
            iconClassName: 'availability-icon'
          },
          {
            url: urlPrefix + 'cloud-status/health',
            title: 'Health',
            iconClassName: 'health-icon'
          }
        ]}
      />
    );
  }
}
