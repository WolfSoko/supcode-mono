module.exports = {
  name: 'suphero',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/suphero',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
