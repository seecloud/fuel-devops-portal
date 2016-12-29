import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';

import {InfrastructureService} from '../../stores/InfrastructureServices';
import InfrastructureSidebar from './InfrastructureSidebar';

@inject('infrastructureServices')
@observer
export default class InfrastructureSingleRegionPage extends Component {
  static async fetchData({infrastructureServices, params: {regionName}}) {
    const url = `/api/v1/region/${encodeURIComponent(regionName)}/infra`;
    const response = await fetch(url);
    const responseBody = await response.json();
    infrastructureServices.update(
      regionName,
      responseBody.infra.map((plainInfrastructureService) => {
        return new InfrastructureService(plainInfrastructureService);
      })
    );
  }

  render() {
    return (
      <div>
        <InfrastructureSidebar />
        {this.props.children}
      </div>
    );
  }
}
