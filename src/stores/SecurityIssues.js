import {observable, computed} from 'mobx';
import {uniq} from 'lodash';

export class SecurityIssue {
  @observable id = null
  @observable confirmedAt = null
  @observable description = null
  @observable discoveredAt = null
  @observable tenantId = null
  @observable userId = null
  @observable resolvedAt = null
  @observable region = null
  @observable type = null

  constructor({
    object_id: id,
    confirmed_at: confirmedAt,
    discovered_at: discoveredAt,
    resolved_at: resolvedAt,
    tenant_id: tenantId,
    user_id: userId,
    ...attrs
  }) {
    Object.assign(this,
      {id, confirmedAt, discoveredAt, resolvedAt, tenantId, userId, ...attrs}
    );
  }
}

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
