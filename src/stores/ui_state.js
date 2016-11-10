import {observable} from 'mobx';

export class UIState {
  @observable
  authenticated = true;
}

export default new UIState();
