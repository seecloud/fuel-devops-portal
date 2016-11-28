import {forEach} from 'lodash';

export default class RegionAvailbilityData {
  dataByRegion = {}

  initializeRegionData(regionName, period) {
    if (!this.dataByRegion[regionName]) this.dataByRegion[regionName] = {};
    if (!this.dataByRegion[regionName][period]) this.dataByRegion[regionName][period] = {};
  }

  update(period, dataByRegion) {
    forEach(dataByRegion, ({availability, data}, regionName) => {
      this.initializeRegionData(regionName, period);
      Object.assign(this.dataByRegion[regionName][period], {
        data,
        score: availability,
        lastUpdate: new Date()
      });
    });
  }

  get(regionName, period) {
    try {
      return this.dataByRegion[regionName][period];
    } catch (e) {
      return null;
    }
  }
}
