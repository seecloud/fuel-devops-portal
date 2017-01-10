import React, {Component} from 'react';
import {Link, withRouter} from 'react-router';
import {Modal} from 'react-bootstrap';
import {observable, computed, action} from 'mobx';
import {observer, inject} from 'mobx-react';
import {every, map, includes, compact} from 'lodash';
import cx from 'classnames';
import {deserialize} from 'serializr';
import moment from 'moment';

import {poll} from '../../decorators';
import DataFilter from '../DataFilter';
import {RUNBOOK_RUN_STATUSES, DEFAULT_DATE_FORMAT} from '../../consts';
import {Runbook} from '../../stores/Runbooks';
import RunbookSidebar from './RunbookSidebar';
import RunbookForm from './RunbookForm';

@withRouter
@inject('runbooks', 'regions')
@observer
@poll
export default class RunbooksPage extends Component {
  static async fetchData(
    {runbooks}
    //{runbooks, params: {regionName}}
  ) {
    //const url = `/api/v1${
    //  regionName ? '/region/' + encodeURIComponent(regionName) : ''
    //}/runbooks/`;
    //const response = await fetch(url);
    //const responseBody = await response.json();
    const responseBody = {
      runbooks: [
        {
          id: '602',
          description: 'Demo runbook description',
          name: 'Demo runbook',
          runbook: 'IyEvYmluL2Jhc2gKCmVjaG8gIkhlbGxvIFdvcmxkISIK',
          type: 'bash',
          tags: ['Monitoring'],
          latest_run: {
            status: 'scheduled',
            created_at: '2016-12-20T16:18:42.150736'
          },
          regionId: 'east-3.hooli.net',
          parameters: [
            {name: 'attr1', default: 'str1', type: 'string'},
            {name: 'attr2', default: 'str2', type: 'string'}
          ]
        },
        {
          id: '246',
          description: 'Demo runbook description',
          name: 'Demo runbook',
          runbook: 'IyEvYmluL2Jhc2gKCmVjaG8gIkhlbGxvIFdvcmxkISIK',
          type: 'bash',
          tags: ['Monitoring'],
          latest_run: {
            status: 'failed',
            created_at: '2016-12-20T16:18:42.150736'
          },
          regionId: 'east-3.hooli.net'
        },
        {
          id: '161',
          description: 'Demo runbook description',
          name: 'Demo runbook',
          runbook: 'IyEvYmluL2Jhc2gKCmVjaG8gIkhlbGxvIFdvcmxkISIK',
          type: 'bash',
          tags: ['Monitoring', 'Databases'],
          latest_run: {
            status: 'finished',
            created_at: '2016-12-20T16:18:42.150736'
          },
          regionId: 'east-3.hooli.net'
        },
        {
          id: '622',
          description: 'Demo runbook description',
          name: 'Demo runbook',
          runbook: 'IyEvYmluL2Jhc2gKCmVjaG8gIkhlbGxvIFdvcmxkISIK',
          type: 'bash',
          tags: ['Monitoring', 'Databases'],
          latest_run: {
            status: 'failed',
            created_at: '2016-12-20T16:18:42.150736'
          },
          regionId: 'east-3.hooli.net'
        },
        {
          id: '622',
          description: 'Demo runbook description',
          name: 'Demo runbook',
          runbook: 'IyEvYmluL2Jhc2gKCmVjaG8gIkhlbGxvIFdvcmxkISIK',
          type: 'bash',
          tags: ['Monitoring', 'Databases'],
          latest_run: null,
          regionId: 'east-3.hooli.net'
        }
      ]
    };
    runbooks.items = responseBody.runbooks.map((plainRunbook) => {
      return deserialize(Runbook, plainRunbook);
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
      match: (runbook, value) => includes(runbook.tags, value)
    },
    {
      name: 'status',
      title: 'Latest run status',
      placeholder: 'Any status',
      match: (runbook, value) => runbook.latestRunStatus === value,
      showOptionsFilter: false
    },
    {
      name: 'search',
      placeholder: 'Search',
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
      status: map(RUNBOOK_RUN_STATUSES, (title, status) => ({value: status, title}))
    };
  }

  changeFilter = (name, value) => {
    this.filterValues[name] = value;
  }

  @computed get filteredRunbooks() {
    return this.props.runbooks.items.filter(
      (runbook) => every(this.filters,
        ({name, match}) => !this.filterValues[name] || match(runbook, this.filterValues[name])
      )
    );
  }

  @observable isCreateRunbookDialogOpen = false;

  async onRunbookCreate() {
    await this.constructor.fetchData(this.props);
  }

  @observable openRunRunbookDialogId = null;

  async onRunbookRun() {
    await this.constructor.fetchData(this.props);
  }

  render() {
    const {params: {regionName}, regions} = this.props;
    const runbooks = this.props.runbooks.items;
    return (
      <div>
        <RunbookSidebar />
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
              <button
                className='btn btn-primary'
                onClick={() => {
                  this.isCreateRunbookDialogOpen = true;
                }}
              >
                {'Create Runbook'}
              </button>
            </div>
          </div>
          <div className='runbook-list'>
            <div className='data-table-toolbar'>
              <div className='left'>
                <div className='filter-result-text'>
                  {runbooks.length ?
                    `${this.filteredRunbooks.length} of ${runbooks.length} runbooks shown.`
                  :
                    'No runbooks found.'
                  }
                </div>
              </div>
              <div className='right' />
            </div>
            {!!this.filteredRunbooks.length &&
              <div className='data-table'>
                <table className='table table-bordered table-hover'>
                  <thead>
                    <tr>
                      <th>{'Name'}</th>
                      <th>{'Tags'}</th>
                      {!regionName && <th>{'Region'}</th>}
                      <th>{'Latest Run'}</th>
                      <th>{'Status'}</th>
                      <th>{'Description'}</th>
                      <th>{'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.filteredRunbooks.map((runbook, index) =>
                      <tr key={index}>
                        <td>
                          <Link to={
                            `/region/${
                              encodeURIComponent(runbook.regionId)
                            }/runbook/${
                              encodeURIComponent(runbook.id)
                            }`
                          }>
                            {runbook.name}
                          </Link>
                        </td>
                        <td>
                          {runbook.tags.map((tag) =>
                            <span key={tag} className='label label-default'>{tag}</span>
                          )}
                        </td>
                        {!regionName && <td>{runbook.regionId}</td>}
                        <td>
                          {runbook.latestRunDate &&
                            moment(runbook.latestRunDate).format(DEFAULT_DATE_FORMAT)
                          }
                        </td>
                        <td className={cx({
                          'text-success': runbook.latestRunStatus === 'finished',
                          'text-danger': runbook.latestRunStatus === 'failed'
                        })}>
                          {RUNBOOK_RUN_STATUSES[runbook.latestRunStatus]}
                        </td>
                        <td>{runbook.description}</td>
                        <td>
                          <button
                            className='btn btn-default btn-sm btn-block'
                            onClick={() => {
                              this.openRunRunbookDialogId = runbook.id;
                            }}
                          >
                            {'Run'}
                          </button>
                          <RunRunbookDialog
                            show={this.openRunRunbookDialogId === runbook.id}
                            runbook={runbook}
                            onRunbookRun={() => this.onRunbookRun()}
                            close={() => {
                              this.openRunRunbookDialogId = null;
                            }}
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            }
            <CreateRunbookDialog
              show={this.isCreateRunbookDialogOpen}
              regionName={regionName || regions.items[0].name}
              onRunbookCreate={() => this.onRunbookCreate()}
              close={() => {
                this.isCreateRunbookDialogOpen = false;
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

@observer
class CreateRunbookDialog extends Component {
  @observable formKey = Date.now();
  @observable actionInProgress = false;
  @observable newRunbook;

  constructor(props) {
    super(props);
    this.newRunbook = new Runbook();
    this.newRunbook.regionId = props.regionName;
  }

  @action
  updateForm = () => {
    this.formKey = Date.now();
  }

  createRunbook = async () => {
    this.actionInProgress = true;
    const url = `/api/v1/region/${encodeURIComponent(this.newRunbook.regionId)}/runbooks/`;
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(this.newRunbook)
    });
    this.actionInProgress = false;
    this.props.close();
    this.props.onRunbookCreate();
  }

  render() {
    return (
      <Modal show={this.props.show} backdrop='static' onHide={this.props.close}>
        <Modal.Header closeButton>
          <Modal.Title>{'Create Runbook'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RunbookForm
            key={this.formKey}
            runbook={this.newRunbook}
            updateForm={this.updateForm}
          />
        </Modal.Body>
        <Modal.Footer>
          <button
            className='btn btn-default'
            onClick={this.props.close}
          >
            {'Close'}
          </button>
          <button
            className='btn btn-primary'
            onClick={this.createRunbook}
            disabled={!!this.newRunbook.validationErrors || this.actionInProgress}
          >
            {'Create'}
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

@observer
class RunRunbookDialog extends Component {
  @observable parameters = [];
  @observable actionInProgress = false;

  constructor(props) {
    super(props);
    this.parameters = props.runbook.parameters.slice();
  }

  runRunbook = async () => {
    this.actionInProgress = true;
    const url = `/api/v1/region/${
      encodeURIComponent(this.props.runbook.regionId)
    }/runbooks/${encodeURIComponent(this.props.runbook.id)}/run`;
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        parameters: this.parameters.reduce((result, parameter) => {
          result[parameter.name] = parameter.default;
          return result;
        }, {})
      })
    });
    this.actionInProgress = false;
    this.props.close();
    this.props.onRunbookRun();
  }

  @action
  changeParameter = (index, value) => {
    this.parameters[index].default = value;
  }

  @computed get errors() {
    return this.parameters.map((parameter) => parameter.default ? null : 'Empty value');
  }

  render() {
    return (
      <Modal show={this.props.show} backdrop='static' onHide={this.props.close}>
        <Modal.Header closeButton>
          <Modal.Title>{'Run Runbook: ' + this.props.runbook.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='runbook-form'>
            {'Click Run to confirm.'}
            {!!this.parameters.length &&
              <div className='runbook-parameters'>
                <label className='control-label'>{'Parameters'}</label>
                {this.parameters.map((parameter, index) => {
                  return (
                    <div
                      key={'parameter' + parameter.name}
                      className={cx('form-group', {'has-error': !!this.errors[index]})}
                    >
                      <label className='control-label'>{parameter.name}</label>
                      <input
                        type='text'
                        className='form-control'
                        defaultValue={parameter.default}
                        onChange={(e) => this.changeParameter(index, e.target.value)}
                      />
                    </div>
                  );
                })}
              </div>
            }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className='btn btn-default'
            onClick={this.props.close}
          >
            {'Close'}
          </button>
          <button
            className='btn btn-primary'
            onClick={this.runRunbook}
            disabled={this.actionInProgress || !!compact(this.errors).length}
          >
            {'Run'}
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}
