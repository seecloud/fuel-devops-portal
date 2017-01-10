import React, {Component} from 'react';
import SideNavbar from '../SideNavbar';

export default class RunbookSidebar extends Component {
  render() {
    return (
      <SideNavbar
        navigationItems={[
          {
            url: 'runbooks',
            title: 'Runbooks',
            iconClassName: 'overview-icon'
          },
          {
            url: 'runbooks/runs',
            title: 'Runbook Runs',
            iconClassName: 'availability-icon'
          }
        ]}
      />
    );
  }
}
