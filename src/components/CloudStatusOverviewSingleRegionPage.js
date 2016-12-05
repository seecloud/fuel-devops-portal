import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {get} from 'lodash';

import CloudStatusSidebar from './CloudStatusSidebar';
import LineChart from './LineChart';
import StatusDataPeriodPicker from './StatusDataPeriodPicker';
import {formatTimeAsHoursAndMinutes, formatTimeAsDayAndMonth} from '../chartUtils';

@observer(['uiState', 'regions', 'regionAvailabilityData', 'regionHealthData'])
export default class CloudStatusAvailabilityMultiRegionPage extends Component {
  static async fetchData(
    {uiState, regionAvailabilityData, regionHealthData},
    {dataPeriod = uiState.activeStatusDataPeriod} = {}
  ) {
    const url = `/api/v1/region/${
      encodeURIComponent(uiState.activeRegionName)
    }/status/${
      encodeURIComponent(dataPeriod)
    }`;
    const response = await fetch(url);
    const responseBody = await response.json();
    const regionStatusData = responseBody.status[uiState.activeRegionName];
    if (regionStatusData.availability) {
      regionAvailabilityData.update(
        uiState.activeRegionName,
        dataPeriod,
        undefined,
        regionStatusData.availability
      );
    }
    if (regionStatusData.health) {
      regionHealthData.update(
        uiState.activeRegionName,
        dataPeriod,
        undefined,
        regionStatusData.health
      );
    }
  }

  async changeDataPeriod(dataPeriod) {
    await this.constructor.fetchData(this.props, {dataPeriod});
    this.props.uiState.activeStatusDataPeriod = dataPeriod;
  }

  charts = [
    {title: 'Availability', key: 'availability.data'},
    {title: 'FCI Score', key: 'health.fciData'},
    {title: 'Response Time (ms)', key: 'health.responseSizeData'},
    {title: 'Response Size (bytes)', key: 'health.responseTimeData'},
    {title: 'Performance', key: null},
    {title: 'API Calls', key: null}
  ]

  render() {
    const {uiState, regionAvailabilityData, regionHealthData} = this.props;
    const regionName = uiState.activeRegionName;
    const labelInterpolationFnc = uiState.activeStatusDataPeriod === 'day' ?
      formatTimeAsHoursAndMinutes :
      formatTimeAsDayAndMonth;

    return (
      <div>
        <CloudStatusSidebar />
        <div className='container-fluid'>
          <h1>{'Overview: ' + regionName}</h1>
          <div className='btn-toolbar'>
            <StatusDataPeriodPicker
              className='pull-right'
              onDataPeriodChange={(dataPeriod) => this.changeDataPeriod(dataPeriod)}
            />
          </div>
          <div className='service-status'>
            <div className='service-status-container'>
              {this.charts.map(({title, key}) => {
                if (!key) return null;
                const availability = regionAvailabilityData.get(
                  regionName, uiState.activeStatusDataPeriod
                );
                const health = regionHealthData.get(
                  regionName, uiState.activeStatusDataPeriod
                );
                const chartData = get({availability, health}, key);
                if (!chartData) return null;

                return (
                  <div key={title} className='service-status-entry'>
                    <div className='chart-title'>{title}</div>
                    <LineChart
                      key={uiState.activeStatusDataPeriod}
                      className='ct-major-twelfth x-axis-vertical-labels'
                      options={{axisX: {labelInterpolationFnc}}}
                      data={chartData.reduce((result, [time, score]) => {
                        result.series[0].push({x: new Date(time), y: score});
                        return result;
                      }, {series: [[]]})}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
