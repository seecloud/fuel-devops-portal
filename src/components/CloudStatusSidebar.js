import React, {Component} from 'react';
import {inject} from 'mobx-react';

import SideNavbar from './SideNavbar';

@inject('uiState', 'regions')
export default class CloudStatusSidebar extends Component {
  render() {
    const activeRegionId = this.props.uiState.activeRegionId;
    const urlPrefix = activeRegionId ? `/region/${activeRegionId}/` : '/all-regions/';

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
