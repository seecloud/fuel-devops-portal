import React, {Component} from 'react';
import {observer} from 'mobx-react';
import {transaction} from 'mobx';
import {forEach} from 'lodash';

import CloudStatusSidebar from './CloudStatusSidebar';
import StatusDataPeriodPicker from './StatusDataPeriodPicker';
import LineChart from './LineChart';
import Score from './Score';
import {getFormatTime} from '../chartUtils';

@observer(['uiState', 'regions', 'regionAvailabilityData'])
export default class CloudStatusAvailabilitySingleRegionPage extends Component {
  static async fetchData(
    {uiState, regionAvailabilityData},
    {dataPeriod = uiState.activeStatusDataPeriod} = {}
  ) {
    const regionName = uiState.activeRegionName;
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

  async changeDataPeriod(dataPeriod) {
    await this.constructor.fetchData(this.props, {dataPeriod});
    this.props.uiState.activeStatusDataPeriod = dataPeriod;
  }

  render() {
    const {uiState, regionAvailabilityData} = this.props;
    const regionName = uiState.activeRegionName;
    const services = regionAvailabilityData.getRegionServices(
      regionName, uiState.activeStatusDataPeriod
    );
    const labelInterpolationFnc = getFormatTime(uiState.activeStatusDataPeriod);

    return (
      <div>
        <CloudStatusSidebar />
        <div className='container-fluid'>
          <h1>{'Availability: ' + regionName}</h1>
          <div className='btn-toolbar'>
            <StatusDataPeriodPicker
              className='pull-right'
              onDataPeriodChange={(dataPeriod) => this.changeDataPeriod(dataPeriod)}
            />
          </div>
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
                          result.labels.push(time);
                          result.series[0].push(score);
                          return result;
                        }, {labels: [], series: [[]]})}
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
