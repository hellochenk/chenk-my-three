const { alias, configPaths } = require('react-app-rewire-alias')
// const { override, fixBabelImports }  = require("customize-cra")
// const { addWebpackModuleRule} = require('customize-cra')

module.exports = function override(config) {

  alias(configPaths('./tsconfig.paths.json'))(config)
  // addWebpackModuleRule(
  //   {
  //     test: /\.worker\.js$/,
  //     use: { loader: 'worker-loader' }
  //   }
  // )
  config.module.rules = [...config.module.rules, 
    {
      test: /\.worker\.js$/,
      use: { loader: 'worker-loader' }
    }
  ]

  return config
}