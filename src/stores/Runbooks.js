import {observable, computed} from 'mobx';
import {uniq, flatMap} from 'lodash';

export class Runbook {
  @observable id = null
  @observable name = null
  @observable description = null
  @observable type = null
  @observable latestRun = {}
  @observable regionId = null
  @observable tags = []

  constructor({latest_run: latestRun, ...attrs}) {
    Object.assign(this, {latestRun, ...attrs});
  }

  @computed get latestRunStatus() {
    if (this.latestRun) return this.latestRun.status;
    return null;
  }

  @computed get latestRunDate() {
    if (this.latestRun) return new Date(this.latestRun.created_at).toLocaleString('en-us');
    return null;
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

