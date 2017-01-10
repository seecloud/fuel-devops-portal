import {observable} from 'mobx';
import {includes} from 'lodash';
import {createModelSchema, primitive, identifier, list} from 'serializr';

export class Region {
  @observable name = null
  @observable services = []

  hasService(serviceName) {
    return includes(this.services, serviceName);
  }
}

createModelSchema(Region, {
  name: identifier(),
  services: list(primitive())
});

export class Regions {
  model = Region
  @observable items = []

  get(regionName) {
    return this.items.find((region) => region.name === regionName) || null;
  }
}

export default Regions;
