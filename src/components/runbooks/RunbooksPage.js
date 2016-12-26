import React, {Component} from 'react';
import {Link, withRouter} from 'react-router';
import {observable} from 'mobx';
import {observer, inject} from 'mobx-react';
import {every, map, includes} from 'lodash';
import {poll} from '../../decorators';

import DataFilter from '../DataFilter';
import {RUNBOOK_STATUSES} from '../../consts';
import {Runbook} from '../../stores/Runbooks';

@withRouter
@inject('runbooks')
@observer
@poll
export default class RunbooksPage extends Component {
  static async fetchData(
    {runbooks}
    //{params: {regionName}}
  ) {
    //const url = `/api/v1${
    //  regionName ? '/region/' + encodeURIComponent(regionName) : ''
    //}/runbooks/`;
    //const response = await fetch(url);
    //const responseBody = await response.json();
    const responseBody = [
      {
        id: '602',
        description: 'Demo runbook description',
        name: 'Demo runbook',
        runbook: 'IyEvYmluL2Jhc2gKCmVjaG8gIkhlbGxvIFdvcmxkISIK',
        type: 'bash',
        tags: ['Monitoring'],
        status: 'scheduled',
        regionId: 'east-3.hooli.net'
      },
      {
        id: '246',
        description: 'Demo runbook description',
        name: 'Demo runbook',
        runbook: 'IyEvYmluL2Jhc2gKCmVjaG8gIkhlbGxvIFdvcmxkISIK',
        type: 'bash',
        tags: ['Monitoring'],
        status: 'in-progress',
        regionId: 'east-3.hooli.net'
      },
      {
        id: '161',
        description: 'Demo runbook description',
        name: 'Demo runbook',
        runbook: 'IyEvYmluL2Jhc2gKCmVjaG8gIkhlbGxvIFdvcmxkISIK',
        type: 'bash',
        tags: ['Monitoring', 'Databases'],
        status: 'finished',
        regionId: 'east-3.hooli.net'
      },
      {
        id: '622',
        description: 'Demo runbook description',
        name: 'Demo runbook',
        runbook: 'IyEvYmluL2Jhc2gKCmVjaG8gIkhlbGxvIFdvcmxkISIK',
        type: 'bash',
        tags: ['Monitoring', 'Databases'],
        status: 'failed',
        regionId: 'east-3.hooli.net'
      },
      {
        id: '622',
        description: 'Demo runbook description',
        name: 'Demo runbook',
        runbook: 'IyEvYmluL2Jhc2gKCmVjaG8gIkhlbGxvIFdvcmxkISIK',
        type: 'bash',
        tags: ['Monitoring', 'Databases'],
        status: null,
        regionId: 'east-3.hooli.net'
      }
    ];
    runbooks.items = responseBody.map((runbook) => new Runbook(runbook));
  }

  fetchData() {
    return this.constructor.fetchData(this.props);
  }

  @observable filters = [
    {
      name: 'tag',
      title: 'Any tag',
      match: (runbook, value) => includes(runbook.tags, value)
    },
    {
      name: 'status',
      title: 'Any status',
      match: (runbook, value) => runbook.status === value
    },
    {
      name: 'search',
      title: 'Search',
      match: (runbook, value) => runbook.name.indexOf(value) >= 0 ||
        runbook.description.indexOf(value) >= 0
    }
  ];

  @observable filterValues = {
    tag: '',
    status: '',
    search: ''
  };

  get filterOptions() {
    return {
      tag: this.props.runbooks.tags.map((tag) => ({value: tag, title: tag})),
      status: map(RUNBOOK_STATUSES, (title, status) => ({value: status, title}))
    };
  }

  changeFilter = (name, value) => {
    this.filterValues[name] = value;
  }

  render() {
    const {params: {regionName}} = this.props;
    const runbooks = this.props.runbooks.items;
    const filteredRunbooks = runbooks.filter(
      (runbook) => every(this.filters,
        ({name, match}) => !this.filterValues[name] || match(runbook, this.filterValues[name])
      )
    );

    return (
      <div>
        <div className='container-fluid'>
          <h1>{'Runbooks: ' + (regionName || 'All Regions')}</h1>
          <div className='btn-toolbar'>
            <div className='filters'>
              {this.filters.map((filter) =>
                <DataFilter
                  key={filter.name}
                  {...filter}
                  value={this.filterValues[filter.name]}
                  options={this.filterOptions[filter.name]}
                  onChange={this.changeFilter}
                  disabled={!runbooks.length}
                />
              )}
            </div>
            <div className='pull-right'>
              <button className='btn btn-default'>{'Create Runbook'}</button>
            </div>
          </div>
          <div className='runbook-list'>
            <div className='data-table-toolbar'>
              <div className='left'>
                <div className='filter-result-text'>
                  {runbooks.length ?
                    `${filteredRunbooks.length} of ${runbooks.length} runbooks shown.`
                  :
                    'No runbooks found.'
                  }
                </div>
              </div>
              <div className='right' />
            </div>
            {!!filteredRunbooks.length &&
              <div className='data-table'>
                <table className='table table-bordered table-hover'>
                  <thead>
                    <tr>
                      <th>{'Name'}</th>
                      <th>{'Tags'}</th>
                      {!regionName && <th>{'Region'}</th>}
                      <th>{'Status'}</th>
                      <th>{'Description'}</th>
                      <th>{'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRunbooks.map((runbook, index) =>
                      <tr key={index}>
                        <td>
                          <Link to={'/region/' + runbook.regionId + '/runbook/' + runbook.id}>
                            {runbook.name}
                          </Link>
                        </td>
                        <td>{runbook.tags.join(', ')}</td>
                        {!regionName && <td>{runbook.regionId}</td>}
                        <td>{RUNBOOK_STATUSES[runbook.status]}</td>
                        <td>{runbook.description}</td>
                        <td>
                          <button
                            className='btn btn-default'
                            onClick={() => this.runRunbook(runbook.id)}
                          >
                            {'Run'}
                          </button>
                        </td>
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
