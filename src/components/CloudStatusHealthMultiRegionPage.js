import React, {Component} from 'react';
import {observer} from 'mobx-react';

import CloudStatusSidebar from './CloudStatusSidebar';
import StatusDataPeriodPicker from './StatusDataPeriodPicker';
import LineChart from './LineChart';
import Score from './Score';

@observer(['uiState', 'regions', 'regionHealthData'])
export default class CloudStatusHealthMultiRegionPage extends Component {
  static async fetchData(
    {uiState, regionHealthData},
    {dataPeriod = uiState.activeStatusDataPeriod} = {}
  ) {
    const url = `/api/v1/status/health/${encodeURIComponent(dataPeriod)}`;
    const response = await fetch(url);
    const responseBody = await response.json();
    regionHealthData.update(dataPeriod, responseBody.health);
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

    return (
      <div>
        <CloudStatusSidebar />
        <div className='container-fluid'>
          <h1>{'Cloud Status Health: All Regions'}</h1>
          <div className='btn-toolbar'>
            <StatusDataPeriodPicker
              className='pull-right'
              onDataPeriodChange={(dataPeriod) => this.changeDataPeriod(dataPeriod)}
            />
          </div>
          {this.props.regions.items.map((region) => {
            const health = regionHealthData.get(
              region.name, uiState.activeStatusDataPeriod
            );
            if (!health) return null;
            return (
              <div key={region.name} className='service-status'>
                <div className='service-status-container'>
                  <div className='service-status-entry'>
                    <div className='service-name'>{region.name}</div>
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
                          data={health[key].reduce((result, [time, score]) => {
                            // FIXME(vkramskikh): properly parse time and remove copy-paste
                            const label = uiState.activeStatusDataPeriod === 'day' ?
                              time.replace(/^.*?T/, '') :
                              time.replace(/^\d+-(\d+-\d+)T.*/, '$1');
                            result.labels.push(label);
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
