import {observable} from 'mobx';
import {createModelSchema, primitive} from 'serializr';

import RegionStatusData from './RegionStatusData';

export default class RegionOverviewData extends RegionStatusData {
  DataElement = RegionOverviewDataElement
}

export class RegionOverviewDataElement {
  @observable sla = null
  @observable availability = null
  @observable health = null
  @observable performance = null
}

createModelSchema(RegionOverviewDataElement, {
  sla: primitive(),
  availability: primitive(),
  health: primitive(),
  performance: primitive()
});
