import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';

@observer
export default class Dialog extends Component {
  @observable visible = true

  static show() {
    ReactDOM.render(
      React.createElement(this),
      document.getElementById('modal-container')
    );
  }

  unmount() {
    ReactDOM.unmountComponentAtNode(document.getElementById('modal-container'));
  }

  @action
  close = () => {
    this.visible = false;
  }
}
