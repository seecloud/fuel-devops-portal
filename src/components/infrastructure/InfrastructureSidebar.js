import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {inject} from 'mobx-react';

import SideNavbar from '../SideNavbar';

@withRouter
@inject('infrastructureServices')
export default class InfrastructureSidebar extends Component {
  render() {
    const {infrastructureServices, params: {regionName}} = this.props;
    const navigationItems = infrastructureServices.get(regionName).map((infrastructureService) => ({
      url: `infrastructure/${encodeURIComponent(infrastructureService.id)}`,
      title: infrastructureService.title
    }));

    return (
      <SideNavbar
        navigationItems={[
          {
            url: 'infrastructure',
            title: 'Overview',
            iconClassName: 'overview-icon'
          },
          ...navigationItems
        ]}
      />
    );
  }
}
