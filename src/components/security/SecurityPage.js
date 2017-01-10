import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {action, observable, computed} from 'mobx';
import {inject, observer} from 'mobx-react';
import {every, compact} from 'lodash';
import {deserialize} from 'serializr';

import {poll} from '../../decorators';
import DataFilter from '../DataFilter';
import StatusDataPeriodPicker from '../StatusDataPeriodPicker';
import {SecurityIssue} from '../../stores/SecurityIssues';

function formatDate(date) {
  let d = new Date(date);
  return d.toLocaleDateString(
    'en-US',
    {month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'}
  );
}

@withRouter
@inject('uiState', 'regions', 'securityIssues')
@observer
@poll
export default class SecurityPage extends Component {
  static async fetchData(
    {uiState, regions, securityIssues, params: {regionName}},
    {dataPeriod = uiState.activeStatusDataPeriod} = {}
  ) {
    if (regionName && !regions.get(regionName).hasService('security')) return;
    const url = `/api/v1${
      regionName ? '/region/' + encodeURIComponent(regionName) : ''
    }/security/issues/${
      encodeURIComponent(dataPeriod)
    }`;
    const response = await fetch(url);
    const responseBody = await response.json();
    securityIssues.items = responseBody.issues.map((plainIssue) => {
      return deserialize(SecurityIssue, plainIssue);
    });
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
      title: 'Issue type',
      placeholder: 'Any type',
      match: (issue, value) => issue.type === value
    },
    {
      name: 'tenant',
      title: 'Tenant',
      placeholder: 'Any tenant',
      match: (issue, value) => issue.tenantId === value
    },
    {
      name: 'search',
      placeholder: 'Search',
      match: (issue, value) => issue.id.indexOf(value) >= 0 ||
        issue.description && issue.description.indexOf(value) >= 0
    }
  ];

  @observable filterValues = {
    type: '',
    tenant: '',
    search: ''
  };

  get filterOptions() {
    return {
      type: this.props.securityIssues.types
        .map((type) => ({value: type, title: type})),
      tenant: this.props.securityIssues.tenants
        .map((tenant) => ({value: tenant, title: tenant}))
    };
  }

  @action
  changeFilter = (name, value) => {
    this.filterValues[name] = value;
  }

  @computed get filteredIssues() {
    return this.props.securityIssues.items.filter(
      (issue) => every(this.filters,
        ({name, match}) => !this.filterValues[name] || match(issue, this.filterValues[name])
      )
    );
  }

  render() {
    const {regions, securityIssues, params} = this.props;
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

    const issues = securityIssues.items;
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
                    `${this.filteredIssues.length} of ${issues.length} issues shown.`
                  :
                    'No issues found.'
                  }
                </div>
              </div>
              <div className='right' />
            </div>
            {!!this.filteredIssues.length &&
              <div className='data-table'>
                <table className='table table-bordered'>
                  <thead>
                    <tr>
                      <th>{'ID'}</th>
                      {!regionName && <th>{'Region'}</th>}
                      <th>{'Type'}</th>
                      <th>{'Tenant/User'}</th>
                      <th>{'Discovered At'}</th>
                      <th>{'Confirmed At'}</th>
                      <th>{'Resolved At'}</th>
                      <th>{'Description'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.filteredIssues.map((issue, index) =>
                      <tr key={index}>
                        <td>{issue.id}</td>
                        {!regionName && <td>{issue.region}</td>}
                        <td>{issue.type}</td>
                        <td>{compact([issue.tenantId, issue.userId]).join('/')}</td>
                        <td>{formatDate(issue.discoveredAt)}</td>
                        <td>{
                          issue.confirmedAt ? formatDate(issue.confirmedAt) : 'Not confirmed'
                        }</td>
                        <td>{
                          issue.resolvedAt ? formatDate(issue.resolvedAt) : 'Not resolved'
                        }</td>
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
