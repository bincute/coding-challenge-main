import React from 'react';
import { storiesOf } from '@storybook/react';
import { Layout } from './index';

storiesOf('Examples/Layouts', module).add('Layout', () => {
  return (
    <>
      <Layout>
        Hello
      </Layout>
    </>
  );
});
