import {observable} from 'mobx';
import {PERIODS} from '../consts';

export default class UIState {
  @observable authenticated = true;
  @observable fetchingData = false;
  @observable activeRegionName = null;
  @observable statusDataPeriod = PERIODS[0];
}
