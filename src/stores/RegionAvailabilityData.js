import {observable, asMap, action} from 'mobx';
import {without} from 'lodash';

export default class RegionAvailbilityData {
  @observable dataByRegion = asMap({})

  @action
  initializeRegionData(regionName, period, serviceName = 'aggregated') {
    if (!this.dataByRegion.get(regionName)) {
      this.dataByRegion.set(regionName, asMap({}));
    }
    if (!this.dataByRegion.get(regionName).get(period)) {
      this.dataByRegion.get(regionName).set(period, asMap({}));
    }
    if (!this.dataByRegion.get(regionName).get(period).get(serviceName)) {
      this.dataByRegion.get(regionName).get(period).set(serviceName, observable({
        data: [],
        score: null,
        lastUpdate: null,
        responseStatus: 200
      }));
    }
    return this.dataByRegion.get(regionName).get(period).get(serviceName);
  }

  @action
  update(
    regionName, period, serviceName = 'aggregated', plainAvailbilityData, responseStatus = 200
  ) {
    const {availability: score, availability_data: data} = plainAvailbilityData;
    Object.assign(this.initializeRegionData(regionName, period, serviceName), {
      data,
      score,
      lastUpdate: new Date(),
      responseStatus
    });
  }

  getResponseStatus(regionName, period, serviceName = 'aggregated') {
    this.initializeRegionData(regionName, period, serviceName);
    return this.dataByRegion.get(regionName).get(period).get(serviceName).responseStatus;
  }

  getRegionServices(regionName, period) {
    this.initializeRegionData(regionName, period);
    return without(this.dataByRegion.get(regionName).get(period).keys(), 'aggregated');
  }

  get(regionName, period, serviceName = 'aggregated') {
    try {
      return this.dataByRegion.get(regionName).get(period).get(serviceName);
    } catch (e) {
      return null;
    }
  }
}
