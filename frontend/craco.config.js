const path = require(`path`);

process.env.BROWSER = 'none';

const alias = (prefix = `src`) => ({
  '@': `${prefix}/`,
  '@pages': `${prefix}/pages`,
  '@components': `${prefix}/components`,
  '@shared': `${prefix}/shared`,
  '@actions': `${prefix}/shared/actions`,
  '@constants': `${prefix}/shared/constants`,
  '@hooks': `${prefix}/shared/hooks`,
  '@reducers': `${prefix}/shared/reducers`,
  '@selectors': `${prefix}/shared/selectors`,
  '@services': `${prefix}/shared/services`,
  '@utils': `${prefix}/shared/utils`,
  '@home': `${prefix}/pages/Home`,
});

const resolvedAliases = Object.fromEntries(Object.entries(alias()).map(([key, value]) => [key, path.resolve(__dirname, value)]));

module.exports = {
  webpack: {
    alias: resolvedAliases,
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
};
