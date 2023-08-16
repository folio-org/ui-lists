import React, { useEffect, useRef } from 'react';
// @ts-ignore:next-line
import { Callout } from '@folio/stripes/components';
import { useMessageContext } from '../../../../contexts/MessageContext';

export const Message = () => {
  const { messageData } = useMessageContext();
  const callout = useRef();

  useEffect(() => {
    if (messageData?.message && callout.current) {
      // @ts-ignore
      callout?.current?.sendCallout(messageData);
    }
  }, [messageData]);

  return (
    <Callout ref={callout} />
  );
};
