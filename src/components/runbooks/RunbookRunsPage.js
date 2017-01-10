import React, {Component} from 'react';
import {Link, withRouter} from 'react-router';
import {observable, computed} from 'mobx';
import {observer, inject} from 'mobx-react';
import {every, map, includes} from 'lodash';
import cx from 'classnames';
import {deserialize} from 'serializr';

import {poll} from '../../decorators';
import DataFilter from '../DataFilter';
import {RUNBOOK_RUN_STATUSES} from '../../consts';
import {RunbookRun} from '../../stores/RunbookRuns';
import RunbookSidebar from './RunbookSidebar';

function formatDate(date) {
  let d = new Date(date);
  return d.toLocaleDateString(
    'en-US',
    {month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'}
  );
}

@withRouter
@inject('runbooks', 'runbookRuns')
@observer
@poll
export default class RunbookRunsPage extends Component {
  static async fetchData(
    {runbookRuns}
    //{params: {regionName}}
  ) {
    //const url = `/api/v1${
    //  regionName ? '/region/' + encodeURIComponent(regionName) : ''
    //}/runbook_runs/`;
    //const response = await fetch(url);
    //const responseBody = await response.json();
    const responseBody = {
      runs: [
        {
          id: 434,
          updated_at: '2016-12-20T16:27:42.150227',
          created_at: '2016-12-20T16:18:42.150142',
          status: 'scheduled',
          runbook: {
            id: 602,
            name: 'Demo runbook',
            regionId: 'east-3.hooli.net',
            tags: ['Monitoring']
          }
        },
        {
          id: 435,
          updated_at: '2016-12-20T16:27:42.150227',
          created_at: '2016-12-20T16:18:42.150142',
          status: 'scheduled',
          runbook: {
            id: 602,
            name: 'Demo runbook',
            regionId: 'east-3.hooli.net',
            tags: ['Monitoring', 'Databases']
          }
        },
        {
          id: 436,
          updated_at: null,
          created_at: '2016-12-20T16:18:42.150142',
          status: 'in-progress',
          runbook: {
            id: 602,
            name: 'Demo runbook',
            regionId: 'east-3.hooli.net',
            tags: ['Monitoring', 'Databases']
          }
        },
        {
          id: 437,
          updated_at: '2016-12-20T16:27:42.150227',
          created_at: '2016-12-20T16:18:42.150142',
          status: 'finished',
          runbook: {
            id: 602,
            name: 'Demo runbook',
            regionId: 'east-3.hooli.net',
            tags: []
          }
        },
        {
          id: 438,
          updated_at: '2016-12-20T16:27:42.150227',
          created_at: '2016-12-20T16:18:42.150142',
          status: 'scheduled',
          runbook: {
            id: 602,
            name: 'Demo runbook',
            regionId: 'east-3.hooli.net',
            tags: ['Databases']
          }
        }
      ]
    };
    runbookRuns.items = responseBody.runs.map((plainRunbookRun) => {
      return deserialize(RunbookRun, plainRunbookRun);
    });
  }

  fetchData() {
    return this.constructor.fetchData(this.props);
  }

  @observable filters = [
    {
      name: 'tag',
      title: 'Runbook tag',
      placeholder: 'Any tag',
      match: (runbookRun, value) => includes(runbookRun.runbook.tags, value)
    },
    {
      name: 'status',
      title: 'Latest run status',
      placeholder: 'Any status',
      match: (runbookRun, value) => runbookRun.status === value,
      showOptionsFilter: false
    },
    {
      name: 'search',
      placeholder: 'Search',
      match: (runbookRun, value) => runbookRun.runbook.name.indexOf(value) >= 0
    }
  ];

  @observable filterValues = {
    tag: '',
    status: '',
    search: ''
  };

  get filterOptions() {
    return {
      tag: this.props.runbookRuns.runbookTags.map((tag) => ({value: tag, title: tag})),
      status: map(RUNBOOK_RUN_STATUSES, (title, status) => ({value: status, title}))
    };
  }

  changeFilter = (name, value) => {
    this.filterValues[name] = value;
  }

  @computed get filteredRunbookRuns() {
    return this.props.runbookRuns.items.filter(
      (runbookRun) => every(this.filters,
        ({name, match}) => !this.filterValues[name] || match(runbookRun, this.filterValues[name])
      )
    );
  }

  render() {
    const {params: {regionName}} = this.props;
    const runbookRuns = this.props.runbookRuns.items;
    return (
      <div>
        <RunbookSidebar />
        <div className='container-fluid'>
          <h1>{'Runbook Runs: ' + (regionName || 'All Regions')}</h1>
          <div className='btn-toolbar'>
            <div className='filters'>
              {this.filters.map((filter) =>
                <DataFilter
                  key={filter.name}
                  {...filter}
                  value={this.filterValues[filter.name]}
                  options={this.filterOptions[filter.name]}
                  onChange={this.changeFilter}
                  disabled={!runbookRuns.length}
                />
              )}
            </div>
            <div className='pull-right' />
          </div>
          <div className='runbook-runs-list'>
            <div className='data-table-toolbar'>
              <div className='left'>
                <div className='filter-result-text'>
                  {runbookRuns.length ?
                    `${
                      this.filteredRunbookRuns.length
                    } of ${runbookRuns.length} runbook runs shown.`
                  :
                    'No runbook runs found.'
                  }
                </div>
              </div>
              <div className='right' />
            </div>
            {!!this.filteredRunbookRuns.length &&
              <div className='data-table'>
                <table className='table table-bordered table-hover'>
                  <thead>
                    <tr>
                      <th>{'ID'}</th>
                      {!regionName && <th>{'Region'}</th>}
                      <th>{'Runbook'}</th>
                      <th>{'Runbook Tags'}</th>
                      <th>{'Created At'}</th>
                      <th>{'Updated At'}</th>
                      <th>{'Status'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.filteredRunbookRuns.map((runbookRun, index) =>
                      <tr key={index}>
                        <td>{runbookRun.id}</td>
                        {!regionName && <td>{runbookRun.runbook.regionId}</td>}
                        <td>
                          <Link to={
                            `/region/${
                              encodeURIComponent(runbookRun.runbook.regionId)
                            }/runbook/${
                              encodeURIComponent(runbookRun.runbook.id)
                            }`
                          }>
                            {runbookRun.runbook.name}
                          </Link>
                        </td>
                        <td>
                          {runbookRun.runbook.tags.map((tag) =>
                            <span key={tag} className='label label-default'>{tag}</span>
                          )}
                        </td>
                        <td>{formatDate(runbookRun.createdAt)}</td>
                        <td>{runbookRun.updatedAt && formatDate(runbookRun.updatedAt)}</td>
                        <td className={cx({
                          'text-success': runbookRun.status === 'finished',
                          'text-danger': runbookRun.status === 'failed'
                        })}>
                          {RUNBOOK_RUN_STATUSES[runbookRun.status]}
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
