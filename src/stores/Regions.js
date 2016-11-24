import {observable} from 'mobx';

export class Region {
  @observable name = null
  @observable services = []

  constructor({name, services}) {
    Object.assign(this, {name, services});
  }
}

export class Regions {
  model = Region
  @observable items = []
}

export default Regions;
