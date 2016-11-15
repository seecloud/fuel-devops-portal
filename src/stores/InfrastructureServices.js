import {observable} from 'mobx';

export class InfrastructureService {
  @observable id
  @observable name
  @observable description
  @observable url

  constructor(props) {
    Object.assign(this, props);
  }
}

export class InfrastructureServices {
  model = InfrastructureService
  @observable items = []
}

export default InfrastructureServices;
