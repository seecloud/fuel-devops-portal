import React, {Component} from 'react';
import {observable, transaction} from 'mobx';
import {observer} from 'mobx-react';
import {forEach} from 'lodash';
import cx from 'classnames';

import CloudStatusSidebar from './CloudStatusSidebar';
import StatusDataPeriodPicker from './StatusDataPeriodPicker';
import Score from './Score';

@observer(['uiState', 'regions', 'regionAvailabilityData', 'regionHealthData'])
export default class CloudStatusOverviewMultiRegionPage extends Component {
  static async fetchData(
    {uiState, regionAvailabilityData, regionHealthData},
    {dataPeriod = uiState.activeStatusDataPeriod} = {}
    ) {
    const url = `/api/v1/status/${encodeURIComponent(dataPeriod)}`;
    const response = await fetch(url);
    const responseBody = await response.json();
    transaction(() => {
      forEach(responseBody.status, (plainRegionStatusData, regionName) => {
        if (plainRegionStatusData.availability) {
          regionAvailabilityData.update(
            regionName,
            dataPeriod,
            undefined,
            plainRegionStatusData.availability
          );
        }
        if (plainRegionStatusData.health) {
          regionHealthData.update(
            regionName,
            dataPeriod,
            undefined,
            plainRegionStatusData.health
          );
        }
      });
    });
  }

  async changeDataPeriod(dataPeriod) {
    await this.constructor.fetchData(this.props, {dataPeriod});
    this.props.uiState.activeStatusDataPeriod = dataPeriod;
  }

  @observable regionSize = 'large'
  regionSizes = ['small', 'medium', 'large']

  changeRegionSize = (newSize) => {
    this.regionSize = newSize;
  }

  render() {
    return (
      <div>
        <CloudStatusSidebar />
        <div className='container-fluid'>
          <h1>{'Overview: All Regions'}</h1>
          <div className='btn-toolbar'>
            <div className='pull-left cloud-overview-summary'>
              {'Total: '}
              {this.props.regions.items.length}
              {' '}
              {'Error: 0'}
            </div>
            <StatusDataPeriodPicker
              className='pull-right'
              onDataPeriodChange={(dataPeriod) => this.changeDataPeriod(dataPeriod)}
            />
            <div className='btn-group pull-right'>
              <button className='btn btn-default active'>{'All'}</button>
              <button className='btn btn-default'>{'Errors'}</button>
            </div>
            <div className='btn-group pull-right'>
              {this.regionSizes.map((size) => {
                return (
                  <button
                    key={size}
                    className={cx({
                      'btn btn-default': true,
                      active: this.regionSize === size
                    })}
                    onClick={() => this.changeRegionSize(size)}
                  >
                    {size[0].toUpperCase()}
                  </button>
                );
              })}
            </div>
          </div>
          <div className='region-list'>
            {this.props.regions.items.map((region) => {
              return <Region
                key={region.name}
                regionName={region.name}
                size={this.regionSize}
              />;
            })}
          </div>
        </div>
      </div>
    );
  }
}

@observer(['uiState', 'regionAvailabilityData', 'regionHealthData'])
export class Region extends Component {
  render() {
    const {size, regionName, uiState, regionAvailabilityData, regionHealthData} = this.props;
    let health = null;
    let availability = null;
    try {
      health = regionHealthData.get(
        regionName, uiState.activeStatusDataPeriod
      ).fci || null;
    } catch (e) {}
    try {
      availability = regionAvailabilityData.get(
        regionName, uiState.activeStatusDataPeriod
      ).score || null;
    } catch (e) {}

    return (
      <div className={cx('region-container', 'region-' + size)}>
        <div className='region'>
          <h3>{regionName}</h3>
          <div className='sla'>
            <div className='name'>{'SLA'}</div>
            <div className='param'>
              <Score score={1} />
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
              <Score score={1} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
