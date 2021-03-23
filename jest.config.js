module.exports = {
  testEnvironment: 'node',
  testTimeout: 15000,
  reporters: [
    'default',
    [
      'jest-junit',
      {
        suiteName: 'jest tests',
        outputDirectory: '.',
        outputName: 'report.xml',
        uniqueOutputName: 'false',
        classNameTemplate: '{classname} - {title}',
        titleTemplate: '{classname} - {title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: 'true',
      },
    ],
  ],
};
