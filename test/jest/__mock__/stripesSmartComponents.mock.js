import React from 'react';

jest.mock('@folio/stripes/smart-components', () => ({
  ViewMetaData: jest.fn(({ metadata, ...rest }) => (
    <div {...rest}>{metadata.createdDate}</div>
  )),
  CheckboxFilter: jest.fn(({ columns = [] }) => (
    <div>
      {columns.map(col => (
        <label htmlFor={col.name}>
          {col.labelAlias}
          <input id={col.name} type="checkbox" checked={col.selected} />
        </label>
      ))}
    </div>
  )),
  CollapseFilterPaneButton: jest.fn(({ onClick }) => <div onClick={onClick} />)
}));
