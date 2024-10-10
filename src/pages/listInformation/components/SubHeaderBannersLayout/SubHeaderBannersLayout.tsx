import React, { FC, ReactElement } from 'react';

export const SubHeaderBannersLayout: FC<{hasBannersToDisplay: boolean, children: ReactElement[]}> = ({ hasBannersToDisplay, children }) => {
  const wrapperIndent = {
    marginTop: hasBannersToDisplay ? '15px' : 0,
    paddingRight: '15px',
    paddingLeft: '15px'
  };

  return (
    <div style={wrapperIndent}>
      {children}
    </div>
  );
};
