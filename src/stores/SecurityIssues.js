import {observable, computed} from 'mobx';
import {uniq} from 'lodash';
import {createModelSchema, alias, primitive, identifier} from 'serializr';

export class SecurityIssue {
  @observable id = null
  @observable description = null
  @observable type = null
  @observable region = null
  @observable confirmedAt = null
  @observable discoveredAt = null
  @observable resolvedAt = null
  @observable tenantId = null
  @observable userId = null
}

createModelSchema(SecurityIssue, {
  id: alias('object_id', identifier()),
  description: primitive(),
  region: primitive(),
  type: primitive(),
  confirmedAt: alias('confirmed_at', primitive()),
  discoveredAt: alias('discovered_at', primitive()),
  resolvedAt: alias('resolved_at', primitive()),
  tenantId: alias('tenant_id', primitive()),
  userId: alias('user_id', primitive())
});

export class SecurityIssues {
  model = SecurityIssue
  @observable items = []

  @computed get types() {
    return uniq(this.items.map((issue) => issue.type));
  }

  @computed get tenants() {
    return uniq(this.items.map((issue) => issue.tenantId));
  }
}

export default SecurityIssues;
