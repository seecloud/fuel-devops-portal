import {observable} from 'mobx';

export default class UIState {
  @observable authenticated = true;
  @observable fetchingData = false;
  @observable activeRegionName = null;
}
