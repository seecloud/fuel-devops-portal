import {observable, asMap, action} from 'mobx';

export default class RegionServicesOverviewData {
  @observable dataByService = asMap({})

  @action
  initializeServiceData(regionServiceName, period, serviceName = 'aggregated') {
    if (!this.dataByService.get(regionServiceName)) {
      this.dataByService.set(regionServiceName, asMap({}));
    }
    if (!this.dataByService.get(regionServiceName).get(period)) {
      this.dataByService.get(regionServiceName).set(period, asMap({}));
    }
    if (!this.dataByService.get(regionServiceName).get(period).get(serviceName)) {
      this.dataByService.get(regionServiceName).get(period).set(serviceName, observable({
        sla: null,
        availability: null,
        health: null,
        performance: null
      }));
    }
    return this.dataByService.get(regionServiceName).get(period).get(serviceName);
  }

  @action
  update(regionServiceName, period, serviceName = 'aggregated', plainOverviewData) {
    Object.assign(
      this.initializeServiceData(regionServiceName, period, serviceName),
      {...plainOverviewData, lastUpdate: new Date()}
    );
  }

  getServiceNames() {
    return this.dataByService.keys();
  }

  get(regionServiceName, period, serviceName = 'aggregated') {
    try {
      return this.dataByService.get(regionServiceName).get(period).get(serviceName);
    } catch (e) {
      return {sla: null, availability: null, health: null, performance: null};
    }
  }
}
