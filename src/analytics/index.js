import { Platform } from 'react-native';
import { prop, assoc, __ } from 'ramda';
import { postEvent } from './analytics';

const getIp = () =>
  fetch('https://api.ipify.org?format=json').then(r => r.json());
const s4 = () =>
  Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
const guid = () => `${s4()}-${s4()}-${s4()}-${s4()}-${s4()}-${s4()}-${s4()}`;

export const sendAnalyticEvent = (
  key,
  properties = {},
  shouldStringifyValue = Platform.select({ android: false, ios: true })
) => {
  const event = {
    key,
    properties,
    id: properties.uuid || guid(),
    timestamp: Math.floor(Date.now() / 1000)
  };

  const options = {
    event: shouldStringifyValue ? JSON.stringify(event) : event
  };

  return getIp()
    .then(prop('ip'))
    .then(assoc('ip', __, options))
    .then(postEvent('MorpheusEvent'))
    .catch(console.warn); // eslint-disable-line no-console
};
