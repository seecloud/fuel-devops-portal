import {observable} from 'mobx';

export class Region {
  @observable id
  @observable name

  constructor(props) {
    Object.assign(this, props);
  }
}

export class Regions {
  model = Region
  @observable items = []
}

export default Regions;
