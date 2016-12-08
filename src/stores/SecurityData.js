import {observable, asMap, action} from 'mobx';
import {uniq} from 'lodash';

export default class SecurityData {
  @observable dataByPeriod = asMap({})

  @action
  initializePeriodData(period) {
    if (!this.dataByPeriod.get(period)) {
      this.dataByPeriod.set(period, observable({
        issues: [],
        lastUpdate: null
      }));
    }
    return this.dataByPeriod.get(period);
  }

  @action
  update(period, plainSecurityData) {
    Object.assign(this.initializePeriodData(period), {
      issues: plainSecurityData,
      lastUpdate: new Date()
    });
  }

  getIssueTypes(period) {
    try {
      return uniq(this.dataByPeriod.get(period).issues.map(({issueType}) => issueType));
    } catch (e) {
      return [];
    }
  }

  getTenants(period) {
    try {
      return uniq(
        this.dataByPeriod.get(period).issues.map(({subject}) => subject.tenantId)
      );
    } catch (e) {
      return [];
    }
  }

  get(period) {
    try {
      return this.dataByPeriod.get(period);
    } catch (e) {
      return [];
    }
  }
}
