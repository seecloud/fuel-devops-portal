import React, {Component} from 'react';
import {Link, withRouter} from 'react-router';
import {observable, computed, action} from 'mobx';
import {observer, inject} from 'mobx-react';
import {isEqual} from 'lodash';
import cx from 'classnames';

import {RUNBOOK_RUN_STATUSES} from '../../consts';
import {Runbook} from '../../stores/Runbooks';
import {RunbookRun} from '../../stores/RunbookRuns';
import RunbookForm from './RunbookForm';

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
export default class RunbookPage extends Component {
  static async fetchData(
    {runbooks, runbookRuns, params: {runbookId}}
  ) {
    //const runbookUrl = `/api/v1/runbooks/${runbookId}`;
    //const runbookResponse = await fetch(runbookUrl);
    //const runbookResponseBody = await runbookResponse.json();
    const runbookResponseBody = {
      id: runbookId,
      description: 'Demo runbook description',
      name: 'Demo runbook',
      runbook: 'IyEvYmluL2Jhc2gKCmVjaG8gIkhlbGxvIFdvcmxkISIK',
      type: 'bash',
      tags: ['Monitoring'],
      status: 'scheduled',
      regionId: 'east-3.hooli.net'
    };
    runbooks.items = [new Runbook(runbookResponseBody)];

    //const runbookRunsUrl = `/api/v1/runbook_runs?runbook=${runbookId}`;
    //const runbookRunsResponse = await fetch(runbookRunsUrl);
    //const runbookRunsResponseBody = await runbookRunsResponse.json();
    const runbookRunsResponseBody = {
      runs: [
        {
          id: 434,
          updated_at: null,
          created_at: '2016-12-20T16:18:42.150142',
          status: 'scheduled',
          runbook: {
            id: '602',
            name: 'Demo runbook',
            tags: ['Monitoring']
          },
          regionId: 'region_one',
          user: 'cloud_user'
        },
        {
          id: 251,
          updated_at: '2016-12-20T16:33:42.150344',
          created_at: '2016-12-20T16:18:42.150312',
          status: 'failed',
          runbook: {
            id: '602',
            name: 'Demo runbook',
            tags: ['Monitoring']
          },
          regionId: 'region_one',
          user: 'cloud_user'
        },
        {
          id: 248,
          updated_at: '2016-12-20T16:33:42.150344',
          created_at: '2016-12-20T16:18:42.150385',
          status: 'finished',
          runbook: {
            id: '602',
            name: 'Demo runbook',
            tags: ['Monitoring']
          },
          regionId: 'region_one',
          user: 'cloud_user'
        }
      ]
    };
    runbookRuns.items = runbookRunsResponseBody.runs.map((run) => new RunbookRun(run));
  }

  @observable formKey = Date.now();
  @observable newRunbook = null;

  constructor(props) {
    super(props);
    const {params: {runbookId}, runbooks} = props;
    this.newRunbook = new Runbook(runbooks.get(runbookId));
  }

  @computed get hasChanges() {
    const {params: {runbookId}, runbooks} = this.props;
    return !isEqual(runbooks.get(runbookId), this.newRunbook);
  }

  @action
  updateForm = () => {
    this.formKey = Date.now();
  }

  @action
  cancelChanges = () => {
    const {params: {runbookId}, runbooks} = this.props;
    Object.assign(this.newRunbook, runbooks.get(runbookId));
    this.updateForm();
  }

  @observable actionInProgress = false;

  saveChanges = async () => {
    this.actionInProgress = true;
    const {params: {runbookId}, runbooks} = this.props;
    const runbook = runbooks.get(runbookId);
    const runbookUrl = `/api/v1/region/${
      encodeURIComponent(runbook.regionId)
    }/runbooks/${encodeURIComponent(runbook.id)}`;
    await fetch(runbookUrl, {
      method: 'PUT',
      body: JSON.stringify(this.newRunbook)
    });
    await fetch(runbookUrl);
    //const response = await fetch(runbookUrl);
    //const {latest_run: latestRun, ...attrs} = await response.json();
    //Object.assign(runbook, {latestRun, ...attrs});
    this.actionInProgress = false;
  }

  render() {
    return (
      <div>
        <div className='container-fluid'>
          <h1>{'Runbook'}</h1>
          <div className='btn-toolbar'>
            <div className='pull-left'>
              <Link to='/all-regions/runbooks'>{'Back to runbook list'}</Link>
            </div>
            <div className='pull-right'>
              <button
                className='btn btn-primary'
                disabled={!this.hasChanges}
                onClick={this.cancelChanges}
              >
                {'Cancel Changes'}
              </button>
              <button
                className='btn btn-primary'
                disabled={
                  !this.hasChanges ||
                  !!this.newRunbook.validationErrors ||
                  this.actionInProgress
                }
                onClick={this.saveChanges}
              >
                {'Update Runbook'}
              </button>
            </div>
          </div>
          <div className='runbook-list'>
            <div className='data-table-toolbar'>
              <div className='left' />
              <div className='right' />
            </div>
            <div className='row'>
              <div className='col-xs-6 runbook-form'>
                <RunbookForm
                  key={this.formKey}
                  runbook={this.newRunbook}
                  updateForm={this.updateForm}
                />
              </div>
              <div className='col-xs-6 run-list'>
                <RunbookRuns />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

@inject('runbookRuns')
class RunbookRuns extends Component {
  render() {
    return (
      <div>
        <div className='row'>
          <div className='col-xs-6'>{'Runbook Runs'}</div>
          <div className='col-xs-6' />
        </div>
        <div className='data-table'>
          <table className='table table-bordered table-hover'>
            <thead>
              <tr>
                <th>{'ID'}</th>
                <th>{'Created At'}</th>
                <th>{'Updated At'}</th>
                <th>{'Status'}</th>
              </tr>
            </thead>
            <tbody>
              {this.props.runbookRuns.items.map((runbookRun, index) =>
                <tr key={index}>
                  <td>{runbookRun.id}</td>
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
      </div>
    );
  }
}
