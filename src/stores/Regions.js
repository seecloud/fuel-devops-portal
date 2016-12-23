import {observable} from 'mobx';
import {includes} from 'lodash';

export class Region {
  @observable name = null
  @observable services = []

  constructor({name, services}) {
    Object.assign(this, {name, services});
  }

  hasService(serviceName) {
    return includes(this.services, serviceName);
  }
}

export class Regions {
  model = Region
  @observable items = []

  get(regionName) {
    return this.items.find((region) => region.name === regionName) || null;
  }
}

export default Regions;
