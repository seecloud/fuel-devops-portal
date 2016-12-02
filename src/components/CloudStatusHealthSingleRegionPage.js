import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {transaction} from 'mobx';
import {forEach} from 'lodash';

import CloudStatusSidebar from './CloudStatusSidebar';
import StatusDataPeriodPicker from './StatusDataPeriodPicker';
import LineChart from './LineChart';
import Score from './Score';
import {formatTimeAsHoursAndMinutes, formatTimeAsDayAndMonth} from '../chartUtils';

@observer(['uiState', 'regions', 'regionHealthData'])
export default class CloudStatusHealthSingleRegionPage extends Component {
  static async fetchData(
    {uiState, regionHealthData},
    {dataPeriod = uiState.activeStatusDataPeriod} = {}
  ) {
    const regionName = uiState.activeRegionName;
    const url = `/api/v1/region/${
      encodeURIComponent(regionName)
    }/status/health/${
      encodeURIComponent(dataPeriod)
    }`;
    const response = await fetch(url);
    const responseBody = await response.json();
    transaction(() => {
      forEach(responseBody.health, (plainHealthData, serviceName) => {
        regionHealthData.update(regionName, dataPeriod, serviceName, plainHealthData);
      });
    });
  }

  async changeDataPeriod(dataPeriod) {
    await this.constructor.fetchData(this.props, {dataPeriod});
    this.props.uiState.activeStatusDataPeriod = dataPeriod;
  }

  charts = [
    {title: 'FCI Score', key: 'fciData'},
    {title: 'Response Time (ms)', key: 'responseSizeData'},
    {title: 'Response Size (bytes)', key: 'responseTimeData'}
  ]

  render() {
    const {uiState, regionHealthData} = this.props;
    const regionName = uiState.activeRegionName;
    const services = regionHealthData.getRegionServices(regionName, uiState.activeStatusDataPeriod);
    const labelInterpolationFnc = uiState.activeStatusDataPeriod === 'day' ?
      formatTimeAsHoursAndMinutes :
      formatTimeAsDayAndMonth;

    return (
      <div>
        <CloudStatusSidebar />
        <div className='container-fluid'>
          <h1>{'Health: ' + regionName}</h1>
          <div className='btn-toolbar'>
            <StatusDataPeriodPicker
              className='pull-right'
              onDataPeriodChange={(dataPeriod) => this.changeDataPeriod(dataPeriod)}
            />
          </div>
          {services.map((serviceName) => {
            const health = regionHealthData.get(
              regionName, uiState.activeStatusDataPeriod, serviceName
            );
            return (
              <div key={serviceName} className='service-status'>
                <div className='service-status-container'>
                  <div className='service-status-entry'>
                    <div className='service-name'>{serviceName}{' '}{'FCI'}</div>
                    <div className='service-score text-success'>
                      <Score score={health.fci} />
                    </div>
                  </div>
                  {this.charts.map(({title, key}) => {
                    return (
                      <div key={title} className='service-status-entry'>
                        <div className='chart-title'>{title}</div>
                        <LineChart
                          key={uiState.activeStatusDataPeriod}
                          className='ct-major-twelfth x-axis-vertical-labels'
                          options={{
                            axisX: {labelInterpolationFnc}
                          }}
                          data={health[key].reduce((result, [time, score]) => {
                            result.labels.push(time);
                            result.series[0].push(score);
                            return result;
                          }, {labels: [], series: [[]]})}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
