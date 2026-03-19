/** Manual mock for react-native-vector-icons */
const React = require('react');
const {Text} = require('react-native');

const Icon = ({name, testID, ...props}) =>
  React.createElement(Text, {testID: testID || `icon-${name}`}, name);

module.exports = Icon;
module.exports.default = Icon;
