import {observable, asMap, action} from 'mobx';
import {forEach} from 'lodash';

export default class RegionHealthData {
  @observable dataByRegion = asMap({})

  @action
  initializeRegionData(regionName, period) {
    if (!this.dataByRegion.get(regionName)) {
      this.dataByRegion.set(regionName, asMap({}));
    }
    if (!this.dataByRegion.get(regionName).get(period)) {
      this.dataByRegion.get(regionName).set(period, observable({
        fci: null,
        fciData: [],
        responseSizeData: [],
        responseTimeData: [],
        lastUpdate: null
      }));
    }
    return this.dataByRegion.get(regionName).get(period);
  }

  @action
  update(period, dataByRegion) {
    forEach(dataByRegion, ({
      fci,
      fci_data: fciData,
      repsonse_size_data: responseSizeData,
      response_time_data: responseTimeData
    }, regionName) => {
      Object.assign(this.initializeRegionData(regionName, period), {
        fci,
        fciData,
        responseSizeData,
        responseTimeData,
        lastUpdate: new Date()
      });
    });
  }

  get(regionName, period) {
    try {
      return this.dataByRegion.get(regionName).get(period);
    } catch (e) {
      return null;
    }
  }
}
