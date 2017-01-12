import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {deserialize} from 'serializr';

import request from '../../request';
import {InfrastructureService} from '../../stores/InfrastructureServices';
import InfrastructureSidebar from './InfrastructureSidebar';

@inject('infrastructureServices')
@observer
export default class InfrastructureSingleRegionPage extends Component {
  static async fetchData({infrastructureServices, params: {regionName}}) {
    const url = `/api/v1/region/${encodeURIComponent(regionName)}/infra`;
    const response = await request(url);
    infrastructureServices.update(
      regionName,
      response.infra.map((plainInfrastructureService) => {
        return deserialize(InfrastructureService, plainInfrastructureService);
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
