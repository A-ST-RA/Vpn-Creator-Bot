import { backendApi } from '../api';
import { typographyReplacer } from '../utils/typographyReplacer';
import * as defaultData from './defaultTextData.json';

export const getWelcomeText = async (): Promise<string> => {
  try {
    const { data } = await backendApi.get('/bot-content');
    return typographyReplacer(data.data.attributes.Welcome || defaultData.Welcome);
    
  } catch {
    return typographyReplacer(defaultData.Welcome);
  }
}

export const getMainText = async (): Promise<string> => {
  try {
    const { data } = await backendApi.get('/bot-content');
    return typographyReplacer(data.data.attributes.Main || defaultData.Main);
   } catch {  
    return typographyReplacer(defaultData.Main);
  }
}

export const getHowToVpnText = async (): Promise<string> => {
  try {
    const { data } = await backendApi.get('/bot-content');
    return typographyReplacer(data.data.attributes.howToVpn || defaultData.howToVpn);
   } catch {  
    return typographyReplacer(defaultData.Main);
  }
}

export const getHelpContent = async (): Promise<{helpText: string, helpLink: string}> => {
  try {
    const { data } = await backendApi.get('/bot-content');
    const helpText = typographyReplacer(data.data.attributes.help || defaultData.help);
    const helpLink = data.data.attributes.helpLink || 'https://google.com';
    
    return {
      helpText,
      helpLink,
    }
   } catch {  
    return {
      helpText: defaultData.help,
      helpLink: defaultData.helpLink,
    }
  }
}

export const getPriceList = async (): Promise<{cost: number, duration: number}[] | null> => {
  try {
    const { data } = await backendApi.get('/bot-content?populate=*');
    const priceList = data.data.attributes.priceList || defaultData.priceList;
    
    return priceList;
   } catch(error) {  
    console.error(error);
    return defaultData.priceList;
  }
}
