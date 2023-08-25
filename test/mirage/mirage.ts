import { createServer, Response } from 'miragejs';
import lists from '../data/lists.json';
import listDetails from '../data/listDetails.json';
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

      this.get('lists/:id', () => new Response(200, {}, listDetails));

      this.delete('lists/:id', () => new Response(200, {}));

      this.put('lists/;id', () => new Response(200, {}));

      this.get('lists/configuration', () => new Response(200, {}, { maxListSize: '100' }));

      this.get('entity-types/:id', () => entityTypeDetails);

      this.get('entity-types', () => [entityTypeDetails, entityTypeDetails]);

      this.delete('lists/:listId/refresh', () => new Response(200));

      this.post('lists/:listId/refresh', () => new Response(200, {}, { success: 'true' }));
    },
  });
};
