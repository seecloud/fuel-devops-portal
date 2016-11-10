import React from 'react';

import SideNavbar from './SideNavbar';

export default function CloudStatusSidebar() {
  return (
    <SideNavbar
      navigationItems={[
        {
          url: '/cloud-status',
          title: 'Overview',
          iconClassName: 'overview-icon'
        },
        {
          url: '/cloud-status/availability',
          title: 'Availability',
          iconClassName: 'availability-icon'
        },
        {
          url: '/cloud-status/health',
          title: 'Health',
          iconClassName: 'health-icon'
        }
      ]}
    />
  );
}
