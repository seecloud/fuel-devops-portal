import {observable, computed} from 'mobx';
import {uniq, flatMap} from 'lodash';

export class Runbook {
  @observable id = null
  @observable name = null
  @observable description = null
  @observable type = null
  @observable status = null
  @observable regionId = null
  @observable tags = []

  constructor(data) {
    Object.assign(this, data);
  }
}

export class Runbooks {
  model = Runbook
  @observable items = []

  @computed get tags() {
    return uniq(flatMap(this.items, ({tags}) => tags.slice()));
  }
}

export default Runbooks;

