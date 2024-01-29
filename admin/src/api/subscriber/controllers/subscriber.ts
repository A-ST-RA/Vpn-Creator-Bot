/**
 * subscriber controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::subscriber.subscriber', ({ strapi }) => ({
  async updateCheck (ctx) {
    const { id } = ctx.params;
    console.log(ctx.request.body.data);

    try {
      const data = await strapi.db.query('api::subscriber.subscriber').findOne({ where: { telegramId: id }});
      
      await strapi.db.query('api::subscriber.subscriber').update({where: {id: data.id}, data: { ...ctx.request.body.data }});
    } catch (error) {
      console.error(error);
    }
  }
}));
