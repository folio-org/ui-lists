import React, { FC, useEffect, useState } from 'react';
import { Layout, Headline } from '@folio/stripes/components';
import { HTTPError } from 'ky';
import { t, parseErrorPayload } from '../../services';

import css from './ErrorComponents.module.css';

export const ErrorComponent: FC<{ error: HTTPError }> = ({ error }) => {
  const [errorKey, setErrorKey] = useState('');

  useEffect(() => {
    (async () => {
      if (error) {
        const payload = await parseErrorPayload(error);
        if (payload?.code) {
          setErrorKey(payload.code);
        } else {
          setErrorKey('unknown');
        }
      }
    })();
  }, [error]);

  if (!errorKey) {
    return null;
  }

  return (
    <section className={css.errorTitleWrapper}>
      <Layout className="display-flex flex-align-items-center centerContent">
        <Headline size="x-large" tag="h1" faded>
          {t(`error-component.${errorKey}`)}
        </Headline>
      </Layout>
    </section>
  );
};
