import ky from 'ky';

const kyMock = ky.create({
  prefixUrl: 'https://test.c',
});

jest.mock('@folio/stripes/core', () => {
  return {
    IfInterface: jest.fn(({ name, children }) => {
      return name === 'interface' ? children : null;
    }),
    IfPermission: jest.fn(({ perm, children }) => {
      return perm === 'permission' ? children : null;
    }),
    AppContextMenu: jest.fn(({ children }) => (typeof children === 'function' ? children(jest.fn()) : children)),
    coreEvents: {
      LOGIN: 'LOGIN',
      LOGOUT: 'LOGOUT',
      SELECT_MODULE: 'SELECT_MODULE',
      CHANGE_SERVICE_POINT: 'CHANGE_SERVICE_POINT',
      ERROR: 'ERROR',
    },
    Pluggable: jest.fn(({ children }) => [children]),
    TitleManager: jest.fn(({ children }) => <>{children}</>),
    AppIcon: jest.fn((props) => (
      <span data-testid="app-icon">
        {JSON.stringify(props)}
      </span>)),
    useOkapiKy: () => kyMock,
    useStripes: () => ({
      hasPerm: jest.fn().mockReturnValue(true)
    }),
    useNamespace: (string) => `${string}-test-space`,
  };
});
