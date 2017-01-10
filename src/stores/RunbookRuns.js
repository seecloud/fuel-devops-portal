import {observable, computed} from 'mobx';
import {uniq, flatMap} from 'lodash';
import {
  createModelSchema, createSimpleSchema, alias, primitive, identifier, object, list
} from 'serializr';

export class RunbookRun {
  @observable id = null
  @observable status = null
  @observable createdAt = null
  @observable updatedAt = null
  @observable runbook = null
}

createModelSchema(RunbookRun, {
  id: identifier(),
  status: primitive(),
  createdAt: alias('created_at', primitive()),
  updatedAt: alias('updated_at', primitive()),
  runbook: object(createSimpleSchema({
    id: primitive(),
    name: primitive(),
    regionId: primitive(),
    tags: list(primitive())
  }))
});

export class RunbookRuns {
  model = RunbookRun
  @observable items = []

  @computed get runbookTags() {
    return uniq(flatMap(this.items, ({runbook}) => runbook.tags.slice()));
  }
}

export default RunbookRuns;

