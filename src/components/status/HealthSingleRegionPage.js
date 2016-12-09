import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {transaction} from 'mobx';
import {forEach} from 'lodash';

import ErrorWrapper from '../ErrorWrapper';
import StatusSidebar from './StatusSidebar';
import StatusDataPeriodPicker from './StatusDataPeriodPicker';
import LineChart from '../LineChart';
import Score from '../Score';
import {getFormatTime} from '../../chartUtils';

@observer(['uiState', 'regionHealthData'])
export default class HealthSingleRegionPage extends Component {
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
    const responseStatus = response.status;
    const responseBody = await response.json();
    transaction(() => {
      forEach(responseBody.health, (plainHealthData, serviceName) => {
        regionHealthData.update(regionName, dataPeriod, serviceName, plainHealthData);
      });
      regionHealthData.update(regionName, dataPeriod, undefined, [], responseStatus);
    });
  }

  render() {
    const {uiState, regionHealthData} = this.props;
    const regionName = uiState.activeRegionName;
    return (
      <div>
        <StatusSidebar />
        <div className='container-fluid'>
          <h1>{'Health: ' + regionName}</h1>
          <ErrorWrapper
            responseStatus={regionHealthData.getResponseStatus(
              regionName, uiState.activeStatusDataPeriod
            )}
          >
            <HealthSingleRegionPageContent />
          </ErrorWrapper>
        </div>
      </div>
    );
  }
}

@observer(['uiState', 'regionHealthData'])
export class HealthSingleRegionPageContent extends Component {
  async changeDataPeriod(dataPeriod) {
    await this.constructor.fetchData(this.props, {dataPeriod});
    this.props.uiState.activeStatusDataPeriod = dataPeriod;
  }

  charts = [
    {title: 'FCI Score', key: 'fciData'},
    {title: 'API calls (per min)', key: 'apiCallsData'},
    {title: 'Response Time (ms)', key: 'responseTimeData'},
    {title: 'Response Size (bytes)', key: 'responseSizeData'}
  ]

  render() {
    const {uiState, regionHealthData} = this.props;
    const regionName = uiState.activeRegionName;
    const services = regionHealthData.getRegionServices(regionName, uiState.activeStatusDataPeriod);
    const labelInterpolationFnc = getFormatTime(uiState.activeStatusDataPeriod);

    return (
      <div>
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
                  <div className='service-name'>{serviceName}</div>
                  <div className='service-score text-success'>
                    <Score score={health.fci} />
                  </div>
                </div>
                {this.charts.map(({title, key}) => {
                  return (
                    <div key={title} className='service-status-entry-large'>
                      <div className='chart-title'>{title}</div>
                      <LineChart
                        key={uiState.activeStatusDataPeriod}
                        className='ct-major-twelfth x-axis-vertical-labels'
                        options={{
                          axisX: {labelInterpolationFnc}
                        }}
                        data={health[key].reduce((result, [time, score]) => {
                          result.series[0].push({x: new Date(time), y: score});
                          return result;
                        }, {series: [[]]})}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}