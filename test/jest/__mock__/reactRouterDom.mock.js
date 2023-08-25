jest.mock('react-router-dom', () => ({ ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({}),
  useHistory: jest.fn(() => ({ push: jest.fn(() => null) })),
  useParams: jest.fn().mockReturnValue({}) }
));
