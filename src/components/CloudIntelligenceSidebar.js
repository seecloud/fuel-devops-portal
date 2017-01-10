import React, {Component} from 'react';
import SideNavbar from './SideNavbar';

export default class CloudIntelligenceSidebar extends Component {
  render() {
    return (
      <SideNavbar
        navigationItems={[
          {
            url: 'intelligence',
            title: 'Overview',
            iconClassName: 'intelligence-overview-icon'
          },
          {
            url: 'intelligence/inventory',
            title: 'Inventory',
            iconClassName: 'intelligence-inventory-icon'
          },
          {
            url: 'intelligence/history',
            title: 'History',
            iconClassName: 'intelligence-history-icon'
          }
        ]}
      />
    );
  }
}
