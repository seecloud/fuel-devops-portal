import React from 'react';
import {Modal} from 'react-bootstrap';

import Dialog from './Dialog';

export default class FetchDataErrorDialog extends Dialog {
  render() {
    return (
      <Modal show={this.visible} onHide={this.close} onExited={this.unmount}>
        <Modal.Header closeButton>
          <Modal.Title>{'Failed to load page'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-danger'>
          {this.props.error || 'Unable to fetch data.'}
        </Modal.Body>
        <Modal.Footer>
          <button
            className='btn btn-default'
            onClick={this.close}
          >
            {'Close'}
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}
