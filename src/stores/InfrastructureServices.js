import {observable, asMap, action} from 'mobx';

export class InfrastructureService {
  @observable id = null
  @observable title = null
  @observable description = null
  @observable urls = []

  constructor({id, title, description, urls}) {
    Object.assign(this, {id, title, description, urls});
  }
}

export class InfrastructureServices {
  @observable dataByRegion = asMap({})

  @action
  update(regionName, infrastructureServices) {
    this.dataByRegion.set(regionName, infrastructureServices);
  }

  get(regionName, infrastructureServiceId) {
    const infrastructureServices = this.dataByRegion.get(regionName) || [];
    if (infrastructureServiceId) {
      return infrastructureServices.find((infrastructureService) => {
        return infrastructureService.id === infrastructureServiceId;
      }) || null;
    } else {
      return infrastructureServices;
    }
  }
}

export default InfrastructureServices;
