import {observable, asMap, action} from 'mobx';
import {createModelSchema, primitive, list} from 'serializr';

export class InfrastructureService {
  @observable id = null
  @observable title = null
  @observable description = null
  @observable urls = []
}

createModelSchema(InfrastructureService, {
  id: primitive(),
  title: primitive(),
  description: primitive(),
  urls: list(list(primitive()))
});

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
