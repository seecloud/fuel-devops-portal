import React, {Component} from 'react';
import {Link, withRouter} from 'react-router';
import {observable, computed, action} from 'mobx';
import {observer, inject} from 'mobx-react';
import {isEqual} from 'lodash';
import cx from 'classnames';
import {serialize, deserialize, update} from 'serializr';
import FileSaver from 'file-saver';
import moment from 'moment';

import request from '../../request';
import {RUNBOOK_RUN_STATUSES, DEFAULT_DATE_FORMAT} from '../../consts';
import {Runbook} from '../../stores/Runbooks';
import {RunbookRun} from '../../stores/RunbookRuns';
import RunbookForm from './RunbookForm';

@withRouter
@inject('runbooks', 'runbookRuns')
@observer
export default class RunbookPage extends Component {
  static async fetchData(
    {runbooks, runbookRuns, params: {runbookId}}
  ) {
    //const runbookUrl = `/api/v1/runbooks/${runbookId}`;
    //const runbookResponse = await request(runbookUrl);
    const runbookResponse = {
      id: runbookId,
      description: 'Demo runbook description',
      name: 'Demo runbook',
      runbook: 'IyEvYmluL2Jhc2gKCmVjaG8gIkhlbGxvIFdvcmxkISIK',
      type: 'bash',
      tags: ['Monitoring'],
      status: 'scheduled',
      regionId: 'east-3.hooli.net'
    };
    runbooks.items = [deserialize(Runbook, runbookResponse)];

    //const runbookRunsUrl = `/api/v1/runbook_runs?runbook=${runbookId}`;
    //const runbookRunsResponse = await request(runbookRunsUrl);
    const runbookRunsResponse = {
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
    runbookRuns.items = runbookRunsResponse.runs.map((plainRunbookRun) => {
      return deserialize(RunbookRun, plainRunbookRun);
    });
  }

  @observable formKey = Date.now();
  @observable newRunbook = null;

  constructor(props) {
    super(props);
    const {params: {runbookId}, runbooks} = props;
    this.newRunbook = deserialize(Runbook, serialize(runbooks.get(runbookId)));
  }

  @computed get hasChanges() {
    const {params: {runbookId}, runbooks} = this.props;
    return !isEqual(serialize(runbooks.get(runbookId)), serialize(this.newRunbook));
  }

  @action
  updateForm = () => {
    this.formKey = Date.now();
  }

  @action
  cancelChanges = () => {
    const {params: {runbookId}, runbooks} = this.props;
    update(this.newRunbook, serialize(runbooks.get(runbookId)));
    this.updateForm();
  }

  @observable actionInProgress = false;

  saveChanges = async () => {
    this.actionInProgress = true;
    const {params: {runbookId}, runbooks} = this.props;
    const runbook = runbooks.get(runbookId);
    const runbookUrl = `/api/v1/region/${
      encodeURIComponent(runbook.regionId)
    }/runbooks/${
      encodeURIComponent(runbook.id)
    }`;
    await request(runbookUrl, {
      method: 'PUT',
      body: serialize(this.newRunbook)
    });
    //const response = await request(runbookUrl);
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
            <Link to='/all-regions/runbooks'>
              <i className='glyphicon glyphicon-chevron-left' />
              {'Back to runbook list'}
            </Link>
          </div>
          <div className='row'>
            <div className='col-xs-5 runbook-form'>
              <RunbookForm
                key={this.formKey}
                runbook={this.newRunbook}
                updateForm={this.updateForm}
              />
              <div className='form-group form-control-buttons'>
                <button
                  className='btn btn-primary'
                  disabled={
                    !this.hasChanges ||
                    !!this.newRunbook.validationErrors ||
                    this.actionInProgress
                  }
                >
                  {'Update Runbook'}
                </button>
                <button
                  className='btn btn-default'
                  disabled={!this.hasChanges}
                  onClick={this.cancelChanges}
                >
                  {'Cancel Changes'}
                </button>
                <button
                  className='btn btn-default'
                  onClick={() => {
                    FileSaver.saveAs(
                      new Blob([this.newRunbook.runbook], {type: 'application/octet-stream'}),
                      this.newRunbook.name
                    );
                  }}
                >
                  {'Download Runbook'}
                </button>
              </div>
            </div>
            <div className='col-xs-7'>
              <RunbookRuns />
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
      <div className='runbook-table'>
        <h4>{'Runbook Runs'}</h4>
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
              {this.props.runbookRuns.items.map((runbookRun) =>
                <tr key={runbookRun.id}>
                  <td>{runbookRun.id}</td>
                  <td>{moment(runbookRun.createdAt).format(DEFAULT_DATE_FORMAT)}</td>
                  <td>
                    {runbookRun.updatedAt &&
                      moment(runbookRun.updatedAt).format(DEFAULT_DATE_FORMAT)
                    }
                  </td>
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
