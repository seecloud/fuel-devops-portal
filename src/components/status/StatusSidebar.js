import React, {Component} from 'react';
import {withRouter} from 'react-router';

import SideNavbar from '../SideNavbar';

@withRouter
export default class CloudStatusSidebar extends Component {
  render() {
    const {regionName} = this.props.params;
    const urlPrefix = regionName ?
      `/region/${encodeURIComponent(regionName)}/` :
      '/all-regions/';

    return (
      <SideNavbar
        navigationItems={[
          {
            url: urlPrefix + 'status',
            title: 'Overview',
            iconClassName: 'overview-icon'
          },
          {
            url: urlPrefix + 'status/availability',
            title: 'Availability',
            iconClassName: 'availability-icon'
          },
          {
            url: urlPrefix + 'status/health',
            title: 'Health',
            iconClassName: 'health-icon'
          }
        ]}
      />
    );
  }
}
