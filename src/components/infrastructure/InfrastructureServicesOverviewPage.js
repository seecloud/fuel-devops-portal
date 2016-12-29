import React, {Component} from 'react';
import {Link} from 'react-router';
import {inject, observer} from 'mobx-react';

@inject('infrastructureServices')
@observer
export default class InfrastructureServicesOverviewPage extends Component {
  render() {
    const {params: {regionName}} = this.props;
    const infrastructureServices = this.props.infrastructureServices.get(regionName);

    return (
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
    );
  }
}
