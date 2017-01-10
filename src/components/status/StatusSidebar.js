import React, {Component} from 'react';
import SideNavbar from '../SideNavbar';

export default class CloudStatusSidebar extends Component {
  render() {
    return (
      <SideNavbar
        navigationItems={[
          {
            url: 'status',
            title: 'Overview',
            iconClassName: 'overview-icon'
          },
          {
            url: 'status/availability',
            title: 'Availability',
            iconClassName: 'availability-icon'
          },
          {
            url: 'status/health',
            title: 'Health',
            iconClassName: 'health-icon'
          }
        ]}
      />
    );
  }
}
