import {observable, computed} from 'mobx';
import {uniq, flatMap, forEach, isEmpty, compact} from 'lodash';
import {
  createModelSchema, createSimpleSchema, alias, primitive, identifier, date, object, list
} from 'serializr';

export class Runbook {
  @observable id = null
  @observable name = ''
  @observable description = ''
  @observable type = null
  @observable latestRun = null
  @observable region = null
  @observable tags = []
  @observable parameters = []
  @observable runbook = ''

  @computed get isNew() {
    return this.id === null;
  }

  @computed get latestRunStatus() {
    if (this.latestRun) return this.latestRun.status;
    return null;
  }

  @computed get latestRunDate() {
    if (this.latestRun) return this.latestRun.createdAt;
    return null;
  }

  @computed get validationErrors() {
    let errors = {};
    forEach(['name', 'type'], (attr) => {
      if (!this[attr]) errors[attr] = 'Empty value';
    });
    let tagErrors = [];
    forEach(this.tags, (tag, index) => {
      tagErrors[index] = tag ? null : 'Empty value';
    });
    if (compact(tagErrors).length) errors.tags = tagErrors;
    let parameterErrors = [];
    forEach(this.parameters, (parameter, index) => {
      if (!parameter.name || !parameter.default) {
        parameterErrors[index] = {
          name: parameter.name ? null : 'Empty value',
          default: parameter.default ? null : 'Empty value'
        };
      }
    });
    if (parameterErrors.length) errors.parameters = parameterErrors;
    return isEmpty(errors) ? null : errors;
  }
}

createModelSchema(Runbook, {
  id: identifier(),
  name: primitive(),
  description: primitive(),
  type: primitive(),
  latestRun: alias('latest_run', object(createSimpleSchema({
    status: primitive(),
    createdAt: alias('created_at', date())
  }))),
  region: primitive(),
  tags: list(primitive()),
  parameters: list(object(createSimpleSchema({
    name: primitive(),
    default: primitive(),
    type: primitive()
  }))),
  runbook: primitive()
});

export class Runbooks {
  model = Runbook
  @observable items = []

  get(runbookId) {
    return this.items.find((runbook) => runbook.id === runbookId) || null;
  }

  @computed get tags() {
    return uniq(flatMap(this.items, ({tags}) => tags.slice()));
  }
}

export default Runbooks;

