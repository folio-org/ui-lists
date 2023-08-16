import { createServer } from 'miragejs';
import lists from './data/lists.json';
import listDetails from './data/listDetails.json';
import entityTypeDetails from './data/entityTypeDetails.json';

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

      this.get('lists/:id', () => listDetails);

      this.get('entity-types/:id', () => entityTypeDetails);

      this.get('entity-types', () => [entityTypeDetails, entityTypeDetails]);
    },
  });
};
