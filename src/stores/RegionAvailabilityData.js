import {observable} from 'mobx';
import {createModelSchema, alias, primitive, list} from 'serializr';

import RegionStatusData from './RegionStatusData';

export default class RegionAvailbilityData extends RegionStatusData {
  DataElement = RegionAvailbilityDataElement
}

export class RegionAvailbilityDataElement {
  @observable score = null
  @observable data = []
}

createModelSchema(RegionAvailbilityDataElement, {
  score: alias('availability', primitive()),
  data: alias('availability_data', list(list(primitive())))
});
