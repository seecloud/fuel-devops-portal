import React, {Component} from 'react';
import {observable, transaction} from 'mobx';
import {observer} from 'mobx-react';
import {withRouter} from 'react-router';
import {forEach} from 'lodash';
import cx from 'classnames';

import StatusSidebar from './StatusSidebar';
import StatusDataPeriodPicker from '../StatusDataPeriodPicker';
import Score from '../Score';
import {poll} from '../../decorators';

@withRouter
@observer(['uiState', 'regions', 'regionOverviewData'])
@poll
export default class StatusOverviewSingleRegionPage extends Component {
  static async fetchData(
    {uiState, regionOverviewData},
    {params: {regionName}},
    {dataPeriod = uiState.activeStatusDataPeriod} = {}
  ) {
    const url = `/api/v1/region/${
      encodeURIComponent(regionName)
    }/status/${
      encodeURIComponent(dataPeriod)
    }`;
    const response = await fetch(url);
    const responseBody = await response.json();
    transaction(() => {
      forEach(responseBody.status, (plainServiceOverviewData, serviceName) => {
        regionOverviewData.update(regionName, dataPeriod, serviceName, plainServiceOverviewData);
      });
    });
  }

  fetchData() {
    return this.constructor.fetchData(this.props, this.props);
  }

  async changeDataPeriod(dataPeriod) {
    await this.constructor.fetchData(this.props, this.props, {dataPeriod});
    this.props.uiState.activeStatusDataPeriod = dataPeriod;
  }

  @observable serviceSize = 'large'
  serviceSizes = ['small', 'medium', 'large']

  changeServiceSize = (newSize) => {
    this.serviceSize = newSize;
  }

  render() {
    const {uiState, regionOverviewData, params} = this.props;
    const {regionName} = params;
    const services = regionOverviewData.getRegionServices(
      regionName, uiState.activeStatusDataPeriod
    );

    return (
      <div>
        <StatusSidebar />
        <div className='container-fluid'>
          <h1>{'Overview: ' + regionName}</h1>
          <div className='btn-toolbar'>
            <StatusDataPeriodPicker
              className='pull-right'
              onDataPeriodChange={(dataPeriod) => this.changeDataPeriod(dataPeriod)}
            />
            <div className='btn-group pull-right'>
              {this.serviceSizes.map((size) => {
                return (
                  <button
                    key={size}
                    className={cx('btn btn-default', {active: this.serviceSize === size})}
                    onClick={() => this.changeServiceSize(size)}
                  >
                    {size[0].toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
          <div className='region-list'>
            {services.map((serviceName) =>
              <Service
                key={serviceName}
                serviceName={serviceName}
                regionName={regionName}
                size={this.serviceSize}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

@observer(['uiState', 'regionOverviewData'])
export class Service extends Component {
  render() {
    const {size, serviceName, regionName, uiState, regionOverviewData} = this.props;

    const overviewData = regionOverviewData.get(
      regionName, uiState.activeStatusDataPeriod, serviceName
    );
    const {
      sla = null,
      availability = null,
      health = null,
      performance = null
    } = (overviewData || {});

    return (
      <div className={cx('region-container', 'region-' + size)}>
        <div className='region'>
          <h3>{serviceName}</h3>
          <div className='sla'>
            <div className='name'>{'SLA'}</div>
            <div className='param'>
              <Score score={sla} />
            </div>
          </div>
          <div className='availability'>
            <div className='name'>{'Availability'}</div>
            <div className='param'>
              <Score score={availability} />
            </div>
          </div>
          <div className='health'>
            <div className='name'>{'Health (FCI)'}</div>
            <div className='param'>
              <Score score={health} />
            </div>
          </div>
          <div className='performance'>
            <div className='name'>{'Performance'}</div>
            <div className='param'>
              <Score score={performance} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
