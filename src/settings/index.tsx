import React, { FC } from 'react';
import { FormattedMessage } from 'react-intl';
import { Settings } from '@folio/stripes/smart-components';
import { GeneralSettings } from './generalSettings';

interface ListsAppSettings {
  match: {
    path: string
  };
  showSettings: boolean;
}

const pages = [
  {
    route: 'general',
    label: <FormattedMessage id="ui-lists.settings.general" />,
    component: GeneralSettings,
  }
];

export const ListsSettings: FC<ListsAppSettings> = (props) => {
  return (
    // @ts-ignore:next-line
    <Settings {...props} pages={pages} paneTitle="lists" />
  );
};
