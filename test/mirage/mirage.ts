import { createServer, Response } from 'miragejs';
import lists from '../data/lists.json';
import listsUpdate from '../data/lists-update.json'
import listDetailsRefreshed from '../data/listDetails.refreshed.json';
import entityTypeDetails from '../data/entityTypeDetails.json';
import exportStarted from '../data/exportStarted.json';
import entityTypes from '../data/entityTypes.json';

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

      this.get('lists', (schema, request) => {
        const updatedAsOf = request.queryParams.updatedAsOf;

        if (updatedAsOf) {
          return listsUpdate;
        } else {
          return lists;
        }
      });

      this.get('lists/:id', () => new Response(200, {}, listDetailsRefreshed));

      this.delete('lists/:id', () => new Response(204, {}));

      this.put('lists/:id', () => new Response(200, {}));

      this.get('lists/configuration', () => new Response(200, {}, { maxListSize: '100' }));

      this.get('entity-types/:id', () => entityTypeDetails);

      this.get('entity-types', () => entityTypes);

      this.delete('lists/:listId/refresh', () => new Response(200));

      this.post('lists/:listId/exports/:exportId/cancel', () => new Response(204));

      this.get('lists/:listId/exports/:exportId/download', (shem, req) => new Response(200, {}, { exportStarted, listId: req.params.listId }));

      this.post('lists/:listId/exports', (shem, req) => new Response(201, {}, { exportStarted, listId: req.params.listId }));

      this.post('lists/:listId/refresh', () => new Response(200, {}, { success: 'true' }));
    },
  });
};
