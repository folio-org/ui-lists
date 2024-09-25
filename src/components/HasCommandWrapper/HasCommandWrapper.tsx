import React, { FC } from 'react';
import { HasCommand, checkScope } from '@folio/stripes/components';
import { AddCommand } from '../../keyboard-shortcuts';
import { handleKeyCommand } from '../../utils';
import { useKeyCommandsMessages } from '../../hooks';


type Command = {
  handler: (event: KeyboardEvent) => void;
  name: string
};

type HasCommandWrapperProps = {
  children: React.ReactNode;
  commands: Command[]
}

export const HasCommandWrapper: FC<HasCommandWrapperProps> = ({ children, commands }) => {
  const { actionUnavailableError } = useKeyCommandsMessages();

  const defaultCommands = [
    AddCommand.duplicate(handleKeyCommand(() => {
      actionUnavailableError();
    })),
    AddCommand.save(handleKeyCommand(() => {
      actionUnavailableError();
    })),
    AddCommand.create(handleKeyCommand(() => {
      actionUnavailableError();
    })),
    AddCommand.edit(handleKeyCommand(() => {
      actionUnavailableError();
    })),
    AddCommand.collapseSections(handleKeyCommand(() => {
      actionUnavailableError();
    })),
    AddCommand.expandSections(handleKeyCommand(() => {
      actionUnavailableError();
    }))
  ];

  const commandsList = defaultCommands.map((defaultCommand) => {
    const listSpecificCommand = commands.find((command) => {
      return defaultCommand.name === command.name;
    });

    if (listSpecificCommand) {
      return listSpecificCommand;
    }

    return defaultCommand;
  });

  return (
    <HasCommand
      commands={commandsList}
      isWithinScope={checkScope}
      scope={document.body}
    >
      {children}
    </HasCommand>
  );
};
