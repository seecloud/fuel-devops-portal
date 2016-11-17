import React, {Component} from 'react';
import {observable, autorun} from 'mobx';
import {observer, inject} from 'mobx-react';

@inject('uiState')
@observer
export default class DataFetchingProgressBar extends Component {
  static defaultProps = {
    initialProgress: 10,
    maxProgress: 94,
    progressStep: 2,
    stepDelay: 300
  }

  @observable progress = this.props.initialProgress

  toggleProgressBar = autorun(() => {
    if (this.props.uiState.fetchingData) {
      this.showProgressBar();
    } else {
      this.hideProgressBar();
    }
  })

  showProgressBar() {
    this.progress = this.props.initialProgress;
    this.activeInterval = setInterval(() => {
      if (this.progress < this.props.maxProgress) {
        this.progress += this.props.progressStep;
      }
    }, this.props.stepDelay);
  }

  hideProgressBar() {
    clearInterval(this.activeInterval);
    this.progress = 100;
    setTimeout(() => {
      this.progress = this.props.initialProgress;
    }, 400);
  }

  componentWillUnmount() {
    clearInterval(this.activeInterval);
  }

  render() {
    return (
      <div
        className='data-fetching-progress'
        style={{opacity: this.props.uiState.fetchingData ? 1 : 0}}
      >
        <div
          className='data-fetching-progress-bar'
          style={{width: this.progress + '%'}}
        />
      </div>
    );
  }
}
