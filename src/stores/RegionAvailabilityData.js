import {observable, asMap, action} from 'mobx';
import {forEach} from 'lodash';

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
        lastUpdate: null
      }));
    }
    return this.dataByRegion.get(regionName).get(period).get(serviceName);
  }

  @action
  update(period, serviceName = 'aggregated', dataByRegion) {
    forEach(dataByRegion, ({availability: score, data}, regionName) => {
      Object.assign(this.initializeRegionData(regionName, period, serviceName), {
        data,
        score,
        lastUpdate: new Date()
      });
    });
  }

  get(regionName, period, serviceName = 'aggregated') {
    try {
      return this.dataByRegion.get(regionName).get(period).get(serviceName);
    } catch (e) {
      return null;
    }
  }
}
