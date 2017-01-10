import React, {Component} from 'react';
import {Link} from 'react-router';
import {inject, observer} from 'mobx-react';
import {runInAction} from 'mobx';
import {forEach, identity} from 'lodash';

import CloudStatusSidebar from './StatusSidebar';
import StatusDataPeriodPicker from '../StatusDataPeriodPicker';
import LineChart from '../LineChart';
import Score from '../Score';
import {dateFormattersByPeriod} from '../../chartUtils';
import {poll} from '../../decorators';

@inject('uiState', 'regions', 'regionAvailabilityData')
@observer
@poll
export default class AvailabilityMultiRegionPage extends Component {
  static async fetchData(
    {uiState, regionAvailabilityData},
    {dataPeriod = uiState.activeStatusDataPeriod} = {}
  ) {
    const url = `/api/v1/status/availability/${encodeURIComponent(dataPeriod)}`;
    const response = await fetch(url);
    const responseBody = await response.json();
    runInAction(() => {
      forEach(responseBody.availability, (plainAvailabilityData, regionName) => {
        regionAvailabilityData.update(regionName, dataPeriod, undefined, plainAvailabilityData);
      });
    });
  }

  fetchData() {
    return this.constructor.fetchData(this.props);
  }

  async changeDataPeriod(dataPeriod) {
    await this.constructor.fetchData(this.props, {dataPeriod});
    this.props.uiState.activeStatusDataPeriod = dataPeriod;
  }

  render() {
    const {uiState, regionAvailabilityData} = this.props;
    const formatTime = dateFormattersByPeriod[uiState.activeStatusDataPeriod];

    return (
      <div>
        <CloudStatusSidebar />
        <div className='container-fluid'>
          <h1>{'Availability: All Regions'}</h1>
          <div className='btn-toolbar'>
            <StatusDataPeriodPicker
              className='pull-right'
              onDataPeriodChange={(dataPeriod) => this.changeDataPeriod(dataPeriod)}
            />
          </div>
          {this.props.regions.items.map((region) => {
            if (!region.hasService('availability')) return null;
            const regionName = region.name;
            const availability = regionAvailabilityData.get(
              regionName, uiState.activeStatusDataPeriod
            );
            if (!availability) return null;
            return (
              <div key={regionName}>
                <div className='service-status'>
                  <div className='service-status-container'>
                    <div className='service-status-entry'>
                      <div className='service-name'>
                        <Link to={`/region/${encodeURIComponent(regionName)}/status/availability`}>
                          {regionName}
                        </Link>
                      </div>
                      <div className='service-score'>
                        <Score score={availability.score} />
                      </div>
                    </div>
                    <div className='service-status-entry-large'>
                      <div className='chart-title'>{'Availability'}</div>
                      <LineChart
                        key={uiState.activeStatusDataPeriod}
                        className='ct-double-octave x-axis-vertical-labels'
                        options={{
                          axisX: {labelInterpolationFnc: formatTime},
                          axisY: {labelInterpolationFnc: identity}
                        }}
                        data={availability.data.reduce((result, [time, score]) => {
                          result.series[0].push({x: new Date(time), y: score});
                          return result;
                        }, {series: [[]]})}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
