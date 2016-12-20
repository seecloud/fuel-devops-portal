import {observable, asMap, action} from 'mobx';
import {without} from 'lodash';

export default class RegionOverviewData {
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
        sla: null,
        availability: null,
        health: null,
        performance: null
      }));
    }
    return this.dataByRegion.get(regionName).get(period).get(serviceName);
  }

  @action
  update(regionName, period, serviceName = 'aggregated', plainOverviewData) {
    Object.assign(
      this.initializeRegionData(regionName, period, serviceName),
      {...plainOverviewData, lastUpdate: new Date()}
    );
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
