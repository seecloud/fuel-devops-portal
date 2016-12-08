import React, {Component} from 'react';
import {observable, transaction} from 'mobx';
import {observer} from 'mobx-react';
import {forEach} from 'lodash';
import cx from 'classnames';

import StatusSidebar from './StatusSidebar';
import StatusDataPeriodPicker from './StatusDataPeriodPicker';
import Score from '../Score';

@observer(['uiState', 'regions', 'regionServicesOverviewData'])
export default class StatusOverviewSingleRegionPage extends Component {
  static async fetchData(
    {uiState, regionServicesOverviewData},
    {dataPeriod = uiState.activeStatusDataPeriod} = {}
  ) {
    const url = `/api/v1/region/${
      encodeURIComponent(uiState.activeRegionName)
    }/status/${
      encodeURIComponent(dataPeriod)
    }`;
    const response = await fetch(url);
    const responseBody = await response.json();
    transaction(() => {
      forEach(responseBody.status, (plainServiceOverviewData, serviceName) => {
        regionServicesOverviewData.update(
          serviceName, dataPeriod, undefined, plainServiceOverviewData
        );
      });
    });
  }

  async changeDataPeriod(dataPeriod) {
    await this.constructor.fetchData(this.props, {dataPeriod});
    this.props.uiState.activeStatusDataPeriod = dataPeriod;
  }

  @observable serviceSize = 'large'
  serviceSizes = ['small', 'medium', 'large']

  changeServiceSize = (newSize) => {
    this.serviceSize = newSize;
  }

  render() {
    const {uiState, regionServicesOverviewData} = this.props;
    const services = regionServicesOverviewData.getServiceNames();
    return (
      <div>
        <StatusSidebar />
        <div className='container-fluid'>
          <h1>{'Overview: ' + uiState.activeRegionName}</h1>
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
            {services.map((service) =>
              <Service
                key={service}
                serviceName={service}
                size={this.serviceSize}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

@observer(['uiState', 'regionServicesOverviewData'])
export class Service extends Component {
  render() {
    const {size, serviceName, uiState, regionServicesOverviewData} = this.props;

    let data;
    try {
      data = regionServicesOverviewData.get(serviceName, uiState.activeStatusDataPeriod);
    } catch (e) {}
    const {sla = null, availability = null, health = null, performance = null} = data;

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
