import { useRecordTypes } from '../../../../hooks';

export const useFilterConfig = () => {
  const { recordTypes = [], isLoading } = useRecordTypes();

  const filterConfig = [
    {
      label: 'Status',
      name: 'status',
      values: ['Active', 'Inactive']
    }, {
      label: 'Visibility',
      name: 'visibility',
      values: ['Shared', 'Private']
    }, {
      label: 'Record types',
      name: 'record_types',
      values: recordTypes?.map((item) => (
        { name: item.id || item.label, displayName: item.label }
      ))
    }
  ];

  return {
    filterConfig,
    isLoadingConfigData: isLoading
  };
};
