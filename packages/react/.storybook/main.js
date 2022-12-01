module.exports = {
  stories: ["../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-toolbars",
    "@storybook/addon-storysource",
    '@storybook/addon-links/register',
    '@storybook/addon-viewport/register',
    '@storybook/addon-knobs/register',
    '@chakra-ui/storybook-addon'
  ]
}