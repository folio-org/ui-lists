import { IntlShape } from 'react-intl';
import { EntityType, ListsRecord, ListsResponse } from '../interfaces';
import { tString } from '../services';

export function deduplicateRecordTypeLabels(
  recordTypes: EntityType[],
  intl: IntlShape,
): Record<string, string> {
  const entitiesByLabel: Record<string, EntityType[]> = recordTypes.reduce(
    (acc, recordType) => {
      if (!acc[recordType.label]) {
        acc[recordType.label] = [];
      }
      acc[recordType.label].push(recordType);
      return acc;
    },
    {} as Record<string, EntityType[]>,
  );

  return Object.fromEntries(
    Object.values(entitiesByLabel).flatMap((entities) => {
      if (entities.length === 1) {
        return [[entities[0].id, entities[0].label]];
      }

      const builtIn = entities.find((e) => e.isCustom === false);
      const customs = entities
        .filter((e) => e.isCustom === true)
        .toSorted((a, b) => a.createdAt!.localeCompare(b.createdAt!));

      if (builtIn) {
        return [
          [
            builtIn.id,
            tString(intl, 'record-types.label.deduplication.built-in', {
              label: builtIn.label,
            }),
          ],
          ...customs.map((e, index) => [
            e.id,
            tString(intl, 'record-types.label.deduplication.custom.with-built-ins', {
              label: e.label,
              number: index + 1,
            }),
          ]),
        ];
      } else {
        return customs.map((e, index) => [
          e.id,
          tString(intl, 'record-types.label.deduplication.custom.no-built-ins', {
            label: e.label,
            number: index + 1,
          }),
        ]);
      }

      return [];
    }),
  );
}

export function injectLabelsIntoRecordTypes(
  recordTypes: EntityType[],
  labelMapping: Record<string, string>,
): EntityType[] {
  return recordTypes.map((rt) => ({
    ...rt,
    label: labelMapping[rt.id] ?? rt.label,
  }));
}

export function injectLabelsIntoListsResponse(
  response: ListsResponse<ListsRecord[]> | undefined,
  labelMapping: Record<string, string>,
): ListsResponse<ListsRecord[]> | undefined {
  if (response === undefined) {
    return response;
  }

  return {
    ...response,
    content: response.content.map((list) => ({
      ...list,
      entityTypeName: labelMapping[list.entityTypeId],
    })),
  };
}
