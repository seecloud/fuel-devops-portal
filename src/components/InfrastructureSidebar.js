import React, {Component} from 'react';
import {observer, inject} from 'mobx-react';

import SideNavbar from './SideNavbar';

@inject('infrastructureServices')
@observer
export default class InfrastructureSidebar extends Component {
  render() {
    return (
      <SideNavbar
        navigationItems={this.props.infrastructureServices.items.map((infrastructureService) => {
          return {
            url: `/infrastructure/${infrastructureService.id}`,
            title: infrastructureService.name
          };
        })}
      />
    );
  }
}
