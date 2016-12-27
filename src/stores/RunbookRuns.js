import {observable, computed} from 'mobx';
import {uniq, flatMap} from 'lodash';

export class RunbookRun {
  @observable id = null
  @observable createdAt = null
  @observable updatedAt = null
  @observable status = null
  @observable runbook = {}

  constructor({created_at: createdAt, updated_at: updatedAt, ...attrs}) {
    Object.assign(this, {createdAt, updatedAt, ...attrs});
  }
}

export class RunbookRuns {
  model = RunbookRun
  @observable items = []

  @computed get runbookTags() {
    return uniq(flatMap(this.items, ({runbook}) => runbook.tags.slice()));
  }
}

export default RunbookRuns;

