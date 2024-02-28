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
import { t } from '../../../../services';
import { ListsRecordDetails } from '../../../../interfaces';

interface MetaSectionAccordionProps {
  listInfo?: ListsRecordDetails,
  recordType: string
}

export const MetaSectionAccordion: React.FC<MetaSectionAccordionProps> = ({ listInfo, recordType }) => {
  const listSource = listInfo?.isCanned ? (
    <FormattedMessage id="ui-lists.list.info.source.system" />
  ) : (
    listInfo?.createdByUsername
  );

  return (
    <Accordion
      data-testid="metaSectionAccordion"
      label={t("accordion.title.list-information")}
    >
      <MetaSection
        contentId="userInfoRecordMetaContent"
        createdDate={listInfo?.createdDate}
        createdBy={listInfo?.createdByUsername}
        id="userInfoRecordMeta"
        lastUpdatedDate={listInfo?.successRefresh?.refreshEndDate}
        lastUpdatedBy={listInfo?.successRefresh?.refreshedByUsername}
      />
      <KeyValue
        label={<FormattedMessage
          id="ui-lists.list.info.list-name"
        />}
        value={listInfo?.name}
      />
      <KeyValue
        label={t("list.info.description")}
        value={listInfo?.description}
      />

      <Row>
        <Col xs={2}>
          <KeyValue
            label={t("list.info.record-type")}
            value={recordType}
          />
        </Col>
        <Col xs={2}>
          <KeyValue
            label={t("list.info.visibility")}
            value={
              t(listInfo?.isPrivate
                ? "lists.item.private"
                : "lists.item.shared"

            )}
          />
        </Col>
        <Col xs={2}>
          <KeyValue
            label={t("list.info.status")}
            value={t(listInfo?.isActive
                ? "lists.item.active"
                : "lists.item.inactive")}
          />
        </Col>
        <Col xs={2}>
          <KeyValue
            label={t("list.info.source")}
            value={listSource}
          />
        </Col>
      </Row>
    </Accordion>
  );
};
