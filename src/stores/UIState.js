import {observable} from 'mobx';
import {PERIODS} from '../consts';

export default class UIState {
  @observable authenticated = true;
  @observable fetchingData = false;
  @observable activeRegionName = null;
  @observable activeStatusDataPeriod = PERIODS[0];
}
