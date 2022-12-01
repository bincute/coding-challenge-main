const useESModules = !!process.env.MODULE;

module.exports = (api) => {
  api.cache(() => process.env.MODULE);
  return {
    plugins: [
      ['@babel/transform-runtime', { useESModules }],
      '@babel/proposal-object-rest-spread',
      '@babel/proposal-class-properties',
      '@babel/proposal-export-default-from',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      '@emotion',
      'inline-react-svg',
      'macros'
    ],
    // when you upgrade babel 
    // Babel >= 7.13.0 (https://babeljs.io/docs/en/assumptions)
    // https://mobx.js.org/installation.html#use-spec-compliant-transpilation-for-class-properties
    // assumptions: {
    //   setPublicClassFields: false
    // },
    presets: useESModules ? [
      '@babel/typescript',
      '@babel/react'
    ] : [
      '@babel/typescript',
      '@babel/env',
      '@babel/react'
    ]
  };
};
