import React, {Component} from 'react';
import {withRouter} from 'react-router';
import {observable} from 'mobx';
import {observer, inject} from 'mobx-react';
import {get} from 'lodash';

@withRouter
@inject('uiState')
@observer
export default class LoginPage extends Component {
  @observable actionInProgress = false

  onSubmit = (e) => {
    e.preventDefault();
    this.actionInProgress = true;
    const {router, location, uiState} = this.props;
    setTimeout(() => {
      uiState.authenticated = true;
      router.replace(get(location, 'state.nextPathname', '/'));
    }, 500);
  }

  render() {
    return (
      <div>
        <h1>{'Login'}</h1>
        <form className='form-horizontal' onSubmit={this.onSubmit}>
          <div className='form-group'>
            <div className='col-xs-6 col-xs-offset-3'>
              <input
                className='form-control input-sm'
                type='text'
                name='username'
                ref='username'
                placeholder={'Username'}
                onChange={this.onChange}
              />
            </div>
          </div>
          <div className='form-group'>
            <div className='col-xs-6 col-xs-offset-3'>
              <input
                className='form-control input-sm'
                type='password'
                name='password'
                ref='password'
                placeholder={'Password'}
                onChange={this.onChange}
              />
            </div>
          </div>
          <div className='form-group'>
            <div className='col-xs-12 text-center'>
              <button
                type='submit'
                className={'btn btn-success'}
                disabled={this.actionInProgress}
              >
                {'Log In'}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
