import {observable, action} from 'mobx';
import {without} from 'lodash';
import {deserialize, update} from 'serializr';

export default class RegionStatusData {
  dataByRegion = observable.map()

  @action
  initializeRegionData(regionName, period, serviceName = 'aggregated') {
    if (!this.dataByRegion.get(regionName)) {
      this.dataByRegion.set(regionName, observable.map());
    }
    if (!this.dataByRegion.get(regionName).get(period)) {
      this.dataByRegion.get(regionName).set(period, observable.map());
    }
    return this.dataByRegion.get(regionName).get(period).get(serviceName);
  }

  @action
  update(regionName, period, serviceName = 'aggregated', plainData) {
    const existingData = this.initializeRegionData(regionName, period, serviceName);
    if (existingData) {
      update(existingData, plainData);
    } else {
      this.dataByRegion.get(regionName).get(period).set(
        serviceName,
        deserialize(this.DataElement, plainData)
      );
    }
  }

  getRegionServices(regionName, period) {
    try {
      return without(this.dataByRegion.get(regionName).get(period).keys(), 'aggregated');
    } catch (e) {
      return [];
    }
  }

  get(regionName, period, serviceName = 'aggregated') {
    try {
      return this.dataByRegion.get(regionName).get(period).get(serviceName) || null;
    } catch (e) {
      return null;
    }
  }
}
