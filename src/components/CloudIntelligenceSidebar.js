import React, {Component} from 'react';
import {inject} from 'mobx-react';

import SideNavbar from './SideNavbar';

@inject('uiState', 'regions')
export default class CloudIntelligenceSidebar extends Component {
  render() {
    const activeRegionName = this.props.uiState.activeRegionName;
    const urlPrefix = activeRegionName ?
      `/region/${encodeURIComponent(activeRegionName)}/` :
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
