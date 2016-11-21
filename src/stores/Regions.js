import {observable} from 'mobx';

export class Region {
  @observable name

  constructor({name}) {
    Object.assign(this, {name});
  }
}

export class Regions {
  model = Region
  @observable items = []
}

export default Regions;
