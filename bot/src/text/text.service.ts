import api from '../api';
import { typographyReplacer } from '../utils/typographyReplacer';
import * as defaultData from './defaultTextData.json';

export const getWelcomeText = async (): Promise<string> => {
  const { data } = await api.get('/bot-content');

  return typographyReplacer(data.data.attributes.Welcome || defaultData.Welcome);
}

export const getMainText = async (): Promise<string> => {
  const { data } = await api.get('/bot-content');
  
  return typographyReplacer(data.data.attributes.Main || defaultData.Main);
}
