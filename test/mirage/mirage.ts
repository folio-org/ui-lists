import { createServer, Response } from 'miragejs';
import lists from '../data/lists.json';
import listDetailsRefreshed from '../data/listDetails.refreshed.json';
import entityTypeDetails from '../data/entityTypeDetails.json';

interface IParams {
  urlPrefix?: string;
  environment?: string;
}
export const startMirage = ({
  urlPrefix = 'https://test.c',
  environment = 'test'
}: IParams) => {
  return createServer({
    environment,

    routes() {
      this.urlPrefix = urlPrefix;
      this.namespace = '';

      this.get('lists', () => lists);

      this.get('lists/:id', () => new Response(200, {}, listDetailsRefreshed));

      this.delete('lists/:id', () => new Response(204, {}));

      this.put('lists/;id', () => new Response(200, {}));

      this.get('lists/configuration', () => new Response(200, {}, { maxListSize: '100' }));

      this.get('entity-types/:id', () => entityTypeDetails);

      this.get('entity-types', () => [entityTypeDetails, entityTypeDetails]);

      this.delete('lists/:listId/refresh', () => new Response(200));

      this.post('lists/:listId/refresh', () => new Response(200, {}, { success: 'true' }));
    },
  });
};
