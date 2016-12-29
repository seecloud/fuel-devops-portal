import React, {Component} from 'react';
import {Link} from 'react-router';
import {inject, observer} from 'mobx-react';
import {transaction} from 'mobx';
import {forEach} from 'lodash';

import {InfrastructureService} from '../../stores/InfrastructureServices';

@inject('regions', 'infrastructureServices')
@observer
export default class InfrastructureMultiRegionPage extends Component {
  static async fetchData({infrastructureServices}) {
    const url = '/api/v1/infra';
    const response = await fetch(url);
    const responseBody = await response.json();

    transaction(() => {
      forEach(responseBody.infra, (plainInfrastructureServices, regionName) => {
        infrastructureServices.update(
          regionName,
          plainInfrastructureServices.map((plainInfrastructureService) => {
            return new InfrastructureService(plainInfrastructureService);
          })
        );
      });
    });
  }

  render() {
    return (
      <div className='container-fluid'>
        <h1>{'Infrastructure: All Regions'}</h1>
        <div className='region-list'>
          {this.props.regions.items.map(({name: regionName}) => {
            const regionInfrastructureServices = this.props.infrastructureServices.get(regionName);
            if (!regionInfrastructureServices.length) return null;
            return <RegionInfrastructure
              key={regionName}
              regionName={regionName}
              regionInfrastructureServices={regionInfrastructureServices}
            />;
          })}
        </div>
      </div>
    );
  }
}

@observer
export class RegionInfrastructure extends Component {
  render() {
    const {regionName, regionInfrastructureServices} = this.props;
    const urlPrefix = `/region/${encodeURIComponent(regionName)}/infrastructure`;

    return (
      <div className='region-container region-large'>
        <div className='region'>
          <h3>
            <Link to={urlPrefix}>{regionName}</Link>
          </h3>
          <hr />
          {regionInfrastructureServices.map((infrastructureService) => {
            return (
              <div key={infrastructureService.id}>
                <Link to={`/region/${
                  encodeURIComponent(regionName)
                }/infrastructure/${
                  encodeURIComponent(infrastructureService.id)
                }`}>
                  {infrastructureService.title}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
