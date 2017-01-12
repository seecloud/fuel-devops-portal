import {observable} from 'mobx';
import {PERIODS} from '../consts';

export default class UIState {
  @observable previousPathname = null;
  @observable authenticated = true;
  @observable pendingRequestsCount = 0;
  @observable activeStatusDataPeriod = PERIODS[0];
}
