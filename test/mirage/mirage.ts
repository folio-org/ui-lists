import { createServer, Response } from 'miragejs';
import lists from '../data/lists.json';
import listsUpdate from '../data/lists-update.json';
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
        const rawSearch = request.queryParams.search;
        const search = (Array.isArray(rawSearch) ? rawSearch[0] : rawSearch)?.toLowerCase();

        const rawCreatedBy = request.queryParams.createdBy;
        const createdBy = Array.isArray(rawCreatedBy) ? rawCreatedBy[0] : rawCreatedBy;
        const rawUpdatedBy = request.queryParams.updatedBy;
        const updatedBy = Array.isArray(rawUpdatedBy) ? rawUpdatedBy[0] : rawUpdatedBy;

        if (search || createdBy || updatedBy) {
          const content = lists.content.filter((list) => {
            const normalizedName = list.name?.toLowerCase() || '';
            const normalizedDescription = (
              'description' in list && typeof list.description === 'string'
                ? list.description
                : ''
            ).toLowerCase();

            const matchesSearch = !search
              || normalizedName.includes(search)
              || normalizedDescription.includes(search);
            const matchesCreatedBy = !createdBy
              || ('createdBy' in list && list.createdBy === createdBy);
            const matchesUpdatedBy = !updatedBy
              || ('updatedBy' in list && list.updatedBy === updatedBy);

            return matchesSearch && matchesCreatedBy && matchesUpdatedBy;
          });

          return {
            ...lists,
            content,
            totalRecords: content.length,
            totalPages: content.length ? 1 : 0,
            numberOfElements: content.length,
            empty: content.length === 0,
            first: true,
            last: true,
          };
        }

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

      this.get('entity-types', () => ({
        entityTypes,
        _version: '3'
      }));

      this.delete('lists/:listId/refresh', () => new Response(200));

      this.post('lists/:listId/exports/:exportId/cancel', () => new Response(204));

      this.get('lists/:listId/exports/:exportId/download', (shem, req) => new Response(200, {}, { exportStarted, listId: req.params.listId }));

      this.post('lists/:listId/exports', (shem, req) => new Response(201, {}, { exportStarted, listId: req.params.listId }));

      this.post('lists/:listId/refresh', () => new Response(200, {}, { success: 'true' }));
    },
  });
};
