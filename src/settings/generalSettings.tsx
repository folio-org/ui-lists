import React, { FunctionComponent } from 'react';
import { Pane } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import { IGeneralSettings } from './generalSettings.types';

export const GeneralSettings: FunctionComponent<IGeneralSettings> = ({ label }) => {
  return (
    <Pane defaultWidth="fill" fluidContentWidth paneTitle={label}>
      <div data-test-application-settings-general-message>
        <FormattedMessage id="ui-lists.settings.general.message" />
      </div>
    </Pane>
  );
};
