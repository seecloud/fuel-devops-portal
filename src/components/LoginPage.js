import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {observable} from 'mobx';
import {observer} from 'mobx-react';
import {get} from 'lodash';

@withRouter
@observer(['uiState'])
export default class LoginPage extends Component {
  @observable actionInProgress = false

  onSubmit = (e) => {
    e.preventDefault();
    const {router, location, uiState} = this.props;
    this.actionInProgress = true;
    setTimeout(() => {
      uiState.authenticated = true;
      router.replace(get(location, 'state.nextPathname', '/'));
    }, 1000);
  }

  render() {
    return (
      <div className='container-fluid dark-bg'>
        <div className='login-container'>
          <div className='logo-container'>
            <div className='logo' />
          </div>
          <div className='form-container'>
            <h1>{'Log In'}</h1>
            <form className='form-horizontal' onSubmit={this.onSubmit}>
              <div className='form-group'>
                <div className='col-xs-12'>
                  <input
                    className='form-control input-sm'
                    type='text'
                    name='username'
                    ref='username'
                    placeholder={'Username'}
                  />
                </div>
              </div>
              <div className='form-group'>
                <div className='col-xs-12'>
                  <input
                    className='form-control input-sm'
                    type='password'
                    name='password'
                    ref='password'
                    placeholder={'Password'}
                  />
                </div>
              </div>
              <div className='form-group'>
                <div className='submit-button'>
                  <button
                    type='submit'
                    className='btn btn-primary btn-block'
                    disabled={this.actionInProgress}
                  >
                    {'Log In'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
