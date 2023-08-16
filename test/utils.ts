import { useIntl } from 'react-intl';
import { QueryClient } from 'react-query';

// The method GetTranslateText can be used outside of React components.
// Currently, this method is using only for testing.
// In your components use FormattedMessage component instead of this method.
export const GetTranslateText = (textId: string): string => {
  const intl = useIntl();
  return intl.formatMessage({ id: textId });
};

export const queryClient = new QueryClient();
