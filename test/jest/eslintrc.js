module.exports = {
  'extends': ['@folio/eslint-config-stripes'],
  'parser': '@typescript-eslint/parser',
  'overrides': [
    {
      'files': ['src/**/tests/*', 'test/**/*'],
    }
  ],
  'env': {
    'jest': true
  }
};
