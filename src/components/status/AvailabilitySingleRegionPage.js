import React, {Component} from 'react';
import {inject, observer} from 'mobx-react';
import {transaction} from 'mobx';
import {withRouter} from 'react-router';
import {forEach} from 'lodash';

import StatusSidebar from './StatusSidebar';
import StatusDataPeriodPicker from '../StatusDataPeriodPicker';
import LineChart from '../LineChart';
import Score from '../Score';
import {getFormatTime} from '../../chartUtils';
import {poll} from '../../decorators';

@withRouter
@inject('uiState', 'regions', 'regionAvailabilityData')
@observer
@poll
export default class AvailabilitySingleRegionPage extends Component {
  static async fetchData(
    {uiState, regions, regionAvailabilityData},
    {params: {regionName}},
    {dataPeriod = uiState.activeStatusDataPeriod} = {}
  ) {
    if (!regions.get(regionName).hasService('availability')) return;
    const url = `/api/v1/region/${
      encodeURIComponent(regionName)
    }/status/availability/${
      encodeURIComponent(dataPeriod)
    }`;
    const response = await fetch(url);
    const responseBody = await response.json();
    transaction(() => {
      forEach(responseBody.availability, (plainAvailabilityData, serviceName) => {
        regionAvailabilityData.update(regionName, dataPeriod, serviceName, plainAvailabilityData);
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

  render() {
    const {uiState, regions, regionAvailabilityData, params} = this.props;
    const {regionName} = params;
    const services = regionAvailabilityData.getRegionServices(
      regionName, uiState.activeStatusDataPeriod
    );
    const labelInterpolationFnc = getFormatTime(uiState.activeStatusDataPeriod);

    return (
      <div>
        <StatusSidebar />
        <div className='container-fluid'>
          <h1>{'Availability: ' + regionName}</h1>
          {regions.get(regionName).hasService('availability') ?
            <div className='btn-toolbar'>
              <StatusDataPeriodPicker
                className='pull-right'
                onDataPeriodChange={(dataPeriod) => this.changeDataPeriod(dataPeriod)}
              />
            </div>
          :
            <div className='alert alert-warning'>
              {`Region ${regionName} doesn't have Availability service.`}
            </div>
          }
          {services.map((serviceName) => {
            const availability = regionAvailabilityData.get(
              regionName, uiState.activeStatusDataPeriod, serviceName
            );
            return (
              <div key={serviceName}>
                <div className='service-status'>
                  <div className='service-status-container'>
                    <div className='service-status-entry'>
                      <div className='service-name'>{serviceName}</div>
                      <div className='service-score text-success'>
                        <Score score={availability.score} />
                      </div>
                    </div>
                    <div className='service-status-entry-large'>
                      <div className='chart-title'>{'Availability'}</div>
                      <LineChart
                        key={uiState.activeStatusDataPeriod}
                        className='ct-double-octave x-axis-vertical-labels'
                        options={{
                          axisX: {offset: 40, labelInterpolationFnc}
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
