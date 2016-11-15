import {observable} from 'mobx';

export default class UIState {
  @observable
  authenticated = true;
}
