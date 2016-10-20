import './styles/layout.less';
import './styles/main.less';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
  render() {
    return (
      <div>{'It works!'}</div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('container')
);
