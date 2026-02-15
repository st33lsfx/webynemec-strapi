/**
 * contact router - pouze create pro formulář (find/findOne nepotřebujeme pro veřejnost)
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::contact.contact', {
  only: ['create'],
});
