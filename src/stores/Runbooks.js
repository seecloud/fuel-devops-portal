import {observable, computed} from 'mobx';
import {uniq, flatMap, forEach, isEmpty} from 'lodash';

export class Runbook {
  @observable id = null
  @observable name = null
  @observable description = null
  @observable type = null
  @observable latestRun = {}
  @observable regionId = null
  @observable tags = []
  @observable parameters = []
  @observable runbook = null

  constructor({latest_run: latestRun, ...attrs}) {
    Object.assign(this, {latestRun, ...attrs});
  }

  @computed get latestRunStatus() {
    if (this.latestRun) return this.latestRun.status;
    return null;
  }

  @computed get latestRunDate() {
    if (this.latestRun) {
      return new Date(this.latestRun.created_at).toLocaleDateString('en-US',
        {month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'}
      );
    }
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
    if (tagErrors.length) errors.tags = tagErrors;
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

