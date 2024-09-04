import React, { FC } from 'react';
import { HasCommand, checkScope } from '@folio/stripes/components';

type HasCommandWrapperProps = {
  children: React.ReactNode;
  commands: {
    handler: (event: KeyboardEvent) => void;
    name: string
  }[]
}

export const HasCommandWrapper: FC<HasCommandWrapperProps> = ({ children, commands }) => {
  return (
    <HasCommand
      commands={commands}
      isWithinScope={checkScope}
      scope={document.body}
    >
        {children}
    </HasCommand>
  );
};
