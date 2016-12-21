import React, {Component} from 'react';
import {withRouter} from 'react-router';

import SideNavbar from './SideNavbar';

@withRouter
export default class CloudIntelligenceSidebar extends Component {
  render() {
    const {regionName} = this.props.params;
    const urlPrefix = regionName ?
      `/region/${encodeURIComponent(regionName)}/` :
      '/all-regions/';

    return (
      <SideNavbar
        navigationItems={[
          {
            url: urlPrefix + 'intelligence/',
            title: 'Overview',
            iconClassName: 'intelligence-overview-icon'
          },
          {
            url: urlPrefix + 'intelligence/inventory',
            title: 'Inventory',
            iconClassName: 'intelligence-inventory-icon'
          },
          {
            url: urlPrefix + 'intelligence/history',
            title: 'History',
            iconClassName: 'intelligence-history-icon'
          }
        ]}
      />
    );
  }
}
