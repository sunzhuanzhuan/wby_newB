const path = require('path');
const webpack = require('webpack')
// let BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const { injectBabelPlugin } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const modifyVars = require('./modifyVars.json')

module.exports = function override(config, env) {
	// config = injectBabelPlugin(['import', { libraryName: 'antd', style: 'css' }], config);
    /*config = injectBabelPlugin(['import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true
    }], config);*/
	config = injectBabelPlugin(['lodash'], config);
	config = injectBabelPlugin(['transform-decorators-legacy'], config);
	// config = injectBabelPlugin(['syntax-dynamic-import'], config);
	config = rewireLess.withLoaderOptions({ modifyVars, javascriptEnabled: true })(config, env);
	config.resolve.alias['@'] = path.join(__dirname, 'src')
	if (env === 'production') {
		config.plugins = config.plugins.map(item => {
			if (item.options && item.options.compress) {
				item.options.compress.drop_debugger = true;
				item.options.compress.drop_console = true;
			}
			return item;
		})
		let obj = {};
		obj.main = config.entry
		obj.vendor = ['react', 'react-dom', 'react-redux', 'react-router', 'redux', 'moment', 'antd', path.join(__dirname, 'src', 'index.less'), 'babel-polyfill']
		config.entry = obj
		config.plugins.push(
			/*new BundleAnalyzerPlugin({
				analyzerMode: 'static'
			}),*/
			new webpack.optimize.CommonsChunkPlugin({
				name: 'vendor',
				filedNames: 'vendors.js'
			}))
		return config;
	}

	return config;
};
