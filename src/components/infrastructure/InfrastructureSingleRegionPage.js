import React, {Component} from 'react';
import {Link} from 'react-router';
import {inject, observer} from 'mobx-react';

import {InfrastructureService} from '../../stores/InfrastructureServices';

@inject('infrastructureServices')
@observer
export default class InfrastructureSingleRegionPage extends Component {
  static async fetchData({infrastructureServices, params: {regionName}}) {
    //const url = `/api/v1/region/${encodeURIComponent(regionName)}/infra`;
    //const response = await fetch(url);
    //const responseBody = await response.json();
    const responseBody = {
      infra: [
        {
          description: 'Web UI that manages OpenStack resources',
          id: 'horizon',
          title: 'Horizon',
          urls: [
            [
              'http://none'
            ]
          ]
        },
        {
          description: 'MaaS service that manages baremetal infrastructure',
          id: 'baremetal',
          title: 'Baremetal Provisioning',
          urls: [
            [
              'http://none'
            ]
          ]
        },
        {
          description: 'Cloud Continues Integration and Deployment.',
          id: 'jenkins',
          title: 'Jenkins CI/CD',
          urls: [
            [
              'http://none'
            ]
          ]
        }
      ]
    };
    infrastructureServices.update(
      regionName,
      responseBody.infra.map((plainInfrastructureService) => {
        return new InfrastructureService(plainInfrastructureService);
      })
    );
  }

  render() {
    const {params: {regionName}} = this.props;
    const infrastructureServices = this.props.infrastructureServices.get(regionName);

    return (
      <div>
        <div className='container-fluid'>
          <h1>{'Infrastructure: ' + regionName}</h1>
          <div className='data-table'>
            <table className='table table-bordered'>
              <thead>
                <tr>
                  <th>{'Name'}</th>
                  <th>{'Description'}</th>
                </tr>
              </thead>
              <tbody>
                {infrastructureServices.map((infrastructureService) => {
                  return (
                    <tr key={infrastructureService.id}>
                      <td>
                        <Link to={`/region/${
                          encodeURIComponent(regionName)
                        }/infrastructure/${
                          encodeURIComponent(infrastructureService.id)
                        }`}>
                          {infrastructureService.title}
                        </Link>
                      </td>
                      <td>{infrastructureService.description}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
