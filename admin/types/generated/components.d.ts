import type { Schema, Attribute } from '@strapi/strapi';

export interface SharedPrice extends Schema.Component {
  collectionName: 'components_shared_prices';
  info: {
    displayName: 'Price';
    icon: 'chartPie';
  };
  attributes: {
    cost: Attribute.Integer;
    duration: Attribute.Integer;
  };
}

export interface SharedPricelist extends Schema.Component {
  collectionName: 'components_shared_priceList';
  info: {
    displayName: 'priceList';
    icon: 'briefcase';
  };
  attributes: {
    pricesList: Attribute.Component<'shared.price', true>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'shared.price': SharedPrice;
      'shared.pricelist': SharedPricelist;
    }
  }
}
