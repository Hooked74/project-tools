const babelJest = require("babel-jest");

module.exports = babelJest.createTransformer({
  presets: [require.resolve("babel-preset-react-app")],
  plugins: [
    [
      require.resolve("@babel/plugin-proposal-decorators"),
      {
        legacy: true,
      },
    ],
    require.resolve("babel-plugin-parameter-decorator"),
  ],
  babelrc: false,
  configFile: false,
});
