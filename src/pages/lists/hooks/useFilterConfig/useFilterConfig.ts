import { useRecordTypes } from '../../../../hooks';

export const useFilterConfig = () => {
  const { recordTypes = [], isLoading } = useRecordTypes();

  const filterConfig = [
    {
      label: 'Status',
      name: 'status',
      cql: 'status',
      values: ['Active', 'Inactive']
    }, {
      label: 'Visibility',
      name: 'visibility',
      cql: 'visibility',
      values: ['Shared', 'Private']
    }, {
      label: 'Record types',
      name: 'record_types',
      cql: 'record.types',
      values: recordTypes?.map((item) => (
        { name: item.id ?? item.label, displayName: item.label, cql: item.id }
      ))
    }
  ];

  return {
    filterConfig,
    isLoadingConfigData: isLoading
  };
};
