import {observable} from 'mobx';
import {PERIODS} from '../consts';

export default class UIState {
  @observable authenticated = true;
  @observable pendingRequestsCount = 0;
  @observable activeRegionName = null;
  @observable activeStatusDataPeriod = PERIODS[0];
}
