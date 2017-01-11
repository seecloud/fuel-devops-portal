import {observable} from 'mobx';
import {createModelSchema, alias, primitive, list} from 'serializr';

import RegionStatusData from './RegionStatusData';

export default class RegionHealthData extends RegionStatusData {
  DataElement = RegionHealthDataElement
}

export class RegionHealthDataElement {
  @observable fci = null
  @observable fciData = []
  @observable apiCalls = null
  @observable apiCallsData = []
  @observable responseSize = null
  @observable responseSizeData = []
  @observable responseTime = null
  @observable responseTimeData = []
}

createModelSchema(RegionHealthDataElement, {
  fci: primitive(),
  fciData: alias('fci_data', list(list(primitive()))),
  apiCalls: alias('api_calls_count', primitive()),
  apiCallsData: alias('api_calls_count_data', list(list(primitive()))),
  responseSize: alias('response_size', primitive()),
  responseSizeData: alias('response_size_data', list(list(primitive()))),
  responseTime: alias('response_time', primitive()),
  responseTimeData: alias('response_time_data', list(list(primitive())))
});
