import {observable, asMap, action} from 'mobx';
import {forEach} from 'lodash';

export default class RegionAvailbilityData {
  @observable dataByRegion = asMap({})

  @action
  initializeRegionData(regionName, period) {
    if (!this.dataByRegion.get(regionName)) {
      this.dataByRegion.set(regionName, asMap({}));
    }
    if (!this.dataByRegion.get(regionName).get(period)) {
      this.dataByRegion.get(regionName).set(period, observable({
        data: [],
        score: null,
        lastUpdate: null
      }));
    }
    return this.dataByRegion.get(regionName).get(period);
  }

  @action
  update(period, dataByRegion) {
    forEach(dataByRegion, ({availability, data}, regionName) => {
      Object.assign(this.initializeRegionData(regionName, period), {
        data: data,
        score: availability,
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
