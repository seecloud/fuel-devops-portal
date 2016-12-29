import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {inject} from 'mobx-react';

import SideNavbar from '../SideNavbar';

@withRouter
@inject('infrastructureServices')
export default class InfrastructureSidebar extends Component {
  render() {
    const {infrastructureServices, params: {regionName}} = this.props;
    const urlPrefix = `/region/${encodeURIComponent(regionName)}/infrastructure`;
    const navigationItems = infrastructureServices.get(regionName).map((infrastructureService) => ({
      url: `${urlPrefix}/${encodeURIComponent(infrastructureService.id)}`,
      title: infrastructureService.title,
      iconClassName: 'health-icon'
    }));

    return (
      <SideNavbar
        navigationItems={[
          {
            url: urlPrefix,
            title: 'Overview',
            iconClassName: 'overview-icon'
          },
          ...navigationItems
        ]}
      />
    );
  }
}
