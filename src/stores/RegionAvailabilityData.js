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
      this.dataByRegion.get(regionName).set(period, asMap({}));
    }
    return this.dataByRegion.get(regionName).get(period);
  }

  @action
  update(period, dataByRegion) {
    forEach(dataByRegion, ({availability, data}, regionName) => {
      const regionData = this.initializeRegionData(regionName, period);
      regionData.set('data', data);
      regionData.set('score', availability);
      regionData.set('lastUpdate', new Date());
    });
  }

  get(regionName, period) {
    try {
      return this.dataByRegion.get(regionName).get(period).toJS();
    } catch (e) {
      return null;
    }
  }
}
