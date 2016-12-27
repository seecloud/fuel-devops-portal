import React, {Component} from 'react';
import {withRouter} from 'react-router';

import SideNavbar from '../SideNavbar';

@withRouter
export default class RunbookSidebar extends Component {
  render() {
    const {regionName} = this.props.params;
    const urlPrefix = regionName ?
      `/region/${encodeURIComponent(regionName)}/` :
      '/all-regions/';

    return (
      <SideNavbar
        navigationItems={[
          {
            url: urlPrefix + 'runbooks',
            title: 'Runbooks',
            iconClassName: 'overview-icon'
          },
          {
            url: urlPrefix + 'runbooks/runs',
            title: 'Runbook Runs',
            iconClassName: 'availability-icon'
          }
        ]}
      />
    );
  }
}
