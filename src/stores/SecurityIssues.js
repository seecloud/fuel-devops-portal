import {observable, computed} from 'mobx';
import {uniq} from 'lodash';

export class SecurityIssue {
  @observable description = null
  @observable issueType = null
  @observable regionId = null
  @observable subject = {}

  constructor(data) {
    Object.assign(this, data);
  }
}

export class SecurityIssues {
  model = SecurityIssue
  @observable items = []

  @computed get types() {
    return uniq(this.items.map((issue) => issue.issueType));
  }

  @computed get tenants() {
    return uniq(this.items.map((issue) => issue.subject.tenantId));
  }
}

export default SecurityIssues;
