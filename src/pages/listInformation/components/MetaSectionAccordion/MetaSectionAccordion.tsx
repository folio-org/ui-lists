import React from 'react';
import {
  Col,
  KeyValue,
  Row,
  Accordion,
  // @ts-ignore:next-line
  MetaSection
} from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import { ListsRecordDetails } from '../../../../interfaces';

interface MetaSectionAccordionProps {
  listInfo?: ListsRecordDetails
}

export const MetaSectionAccordion: React.FC<MetaSectionAccordionProps> = ({ listInfo }) => {
  const listSource = listInfo?.isCanned ? (
    <FormattedMessage id="ui-lists.list.info.source.system" />
  ) : (
    listInfo?.createdByUsername
  );
  const lastUpdatedDate = listInfo?.updatedDate || listInfo?.createdDate;
  const lastUpdatedBy = listInfo?.updatedByUsername || listInfo?.createdByUsername;


  return (
    <Accordion
      data-testid="metaSectionAccordion"
      label={<FormattedMessage id="ui-lists.accordion.title.list-information" />}
    >
      <MetaSection
        contentId="userInfoRecordMetaContent"
        createdDate={listInfo?.createdDate}
        createdBy={listInfo?.createdByUsername}
        id="userInfoRecordMeta"
        lastUpdatedDate={lastUpdatedDate}
        lastUpdatedBy={lastUpdatedBy}
      />
      <KeyValue
        label={<FormattedMessage
          id="ui-lists.list.info.list-name"
        />}
        value={listInfo?.name}
      />
      <KeyValue
        label={<FormattedMessage
          id="ui-lists.list.info.description"
        />}
        value={listInfo?.description}
      />

      <Row>
        <Col xs={2}>
          <KeyValue
            label={<FormattedMessage
              id="ui-lists.list.info.visibility"
            />}
            value={(
              <FormattedMessage id={listInfo?.isPrivate
                ? 'ui-lists.lists.item.private'
                : 'ui-lists.lists.item.shared'}
              />
            )}
          />
        </Col>
        <Col xs={2}>
          <KeyValue
            label={<FormattedMessage
              id="ui-lists.list.info.status"
            />}
            value={(
              <FormattedMessage id={listInfo?.isActive
                ? 'ui-lists.lists.item.active'
                : 'ui-lists.lists.item.inactive'}
              />
            )}
          />
        </Col>
        <Col xs={2}>
          <KeyValue
            label={<FormattedMessage
              id="ui-lists.list.info.source"
            />}
            value={listSource}
          />
        </Col>
      </Row>
    </Accordion>
  );
};
