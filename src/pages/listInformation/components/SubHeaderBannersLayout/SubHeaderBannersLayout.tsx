import React, { FC, ReactElement } from 'react';

export const SubHeaderBannersLayout: FC<{hasBannersToDisplay: boolean, children: ReactElement[]}> = ({ hasBannersToDisplay, children }) => {
  const wrapperIndent = {
    paddingRight: '15px',
    paddingLeft: '15px'
  };

  if (!hasBannersToDisplay) {
    return null;
  }

  return (
    <div style={wrapperIndent}>
      {children}
    </div>
  );
};
