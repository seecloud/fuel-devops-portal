import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {action, observable, computed} from 'mobx';
import {inject, observer} from 'mobx-react';
import {every} from 'lodash';
import {poll} from '../../decorators';

import DataFilter from '../DataFilter';
import StatusDataPeriodPicker from '../StatusDataPeriodPicker';

@withRouter
@inject('uiState', 'regions', 'securityData')
@observer
@poll
export default class SecurityPage extends Component {
  static async fetchData(
    {uiState, regions, securityData, params: {regionName}},
    {dataPeriod = uiState.activeStatusDataPeriod} = {}
  ) {
    if (regionName && !regions.get(regionName).hasService('security')) return;
    //const url = regionName?
    //    `/api/v1/region/${encodeURIComponent(regionName)}
    //    /security/issues/${encodeURIComponent(dataPeriod)}`
    //  :
    //    `/api/v1/security/issues/${encodeURIComponent(dataPeriod)}`;
    //const response = await fetch(url);
    //const responseBody = await response.json();
    const responseBody = [
      {
        issueType: 'type1',
        description: 'test1',
        subject: {tenantId: 'tenant1'},
        regionId: 'region1'
      },
      {
        issueType: 'type2',
        description: 'test2',
        subject: {tenantId: 'tenant2'},
        regionId: 'region2'
      },
      {
        issueType: 'securityGroup',
        description: 'Security group too open',
        subject: {tenantId: 'demo'},
        regionId: 'region1'
      }
    ];
    securityData.update(dataPeriod, responseBody);
  }

  fetchData() {
    return this.constructor.fetchData(this.props);
  }

  async changeDataPeriod(dataPeriod) {
    await this.constructor.fetchData(this.props, {dataPeriod});
    this.props.uiState.activeStatusDataPeriod = dataPeriod;
  }

  filters = [
    {
      name: 'type',
      title: 'Any type',
      match: (issue, value) => issue.issueType === value
    },
    {
      name: 'tenant',
      title: 'Any tenant',
      match: (issue, value) => issue.subject.tenantId === value
    },
    {
      name: 'search',
      title: 'Search',
      match: (issue, value) => issue.issueType.indexOf(value) >= 0 ||
        issue.subject.tenantId.indexOf(value) >= 0 ||
        issue.description.indexOf(value) >= 0
    }
  ];

  @observable filterValues = {
    type: '',
    tenant: '',
    search: ''
  };

  @computed get filterOptions() {
    const {securityData, uiState} = this.props;
    return {
      type: securityData.getIssueTypes(uiState.activeStatusDataPeriod)
        .map((type) => ({value: type, title: type})),
      tenant: securityData.getTenants(uiState.activeStatusDataPeriod)
        .map((tenant) => ({value: tenant, title: tenant}))
    };
  }

  @action
  changeFilter = (name, value) => {
    this.filterValues[name] = value;
  }

  render() {
    const {uiState, regions, securityData, params} = this.props;
    const {regionName} = params;

    if (regionName && !regions.get(regionName).hasService('security')) {
      return (
        <div>
          <div className='container-fluid'>
            <h1>{'Security: ' + regionName}</h1>
            <div className='alert alert-warning'>
              {`Region ${regionName} doesn't have Security service.`}
            </div>
          </div>
        </div>
      );
    }

    const issues = securityData.get(uiState.activeStatusDataPeriod).issues;
    const filteredIssues = issues.filter(
      (issue) => every(this.filters,
        ({name, match}) => !this.filterValues[name] || match(issue, this.filterValues[name])
      )
    );
    return (
      <div>
        <div className='container-fluid'>
          <h1>{'Security: ' + (regionName || 'All Regions')}</h1>
          <div className='btn-toolbar'>
            <div className='filters'>
              {this.filters.map((filter) =>
                <DataFilter
                  key={filter.name}
                  {...filter}
                  value={this.filterValues[filter.name]}
                  options={this.filterOptions[filter.name]}
                  onChange={this.changeFilter}
                  disabled={!issues.length}
                />
              )}
            </div>
            <StatusDataPeriodPicker
              className='pull-right'
              onDataPeriodChange={(dataPeriod) => this.changeDataPeriod(dataPeriod)}
            />
          </div>
          <div className='issue-list'>
            <div className='data-table-toolbar'>
              <div className='left'>
                <div className='filter-result-text'>
                  {issues.length ?
                    `${filteredIssues.length} of ${issues.length} issues shown.`
                  :
                    'No issues found.'
                  }
                </div>
              </div>
              <div className='right' />
            </div>
            {!!filteredIssues.length &&
              <div className='data-table'>
                <table className='table table-bordered'>
                  <thead>
                    <tr>
                      {!regionName && <th>{'Region'}</th>}
                      <th>{'Issue Type'}</th>
                      <th>{'Tenant'}</th>
                      <th>{'Description'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredIssues.map((issue, index) =>
                      <tr key={index}>
                        {!regionName && <td>{issue.regionId}</td>}
                        <td>{issue.issueType}</td>
                        <td>{issue.subject.tenantId}</td>
                        <td>{issue.description}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            }
          </div>
        </div>
      </div>
    );
  }
}
