/* eslint-env mocha */
/* eslint-disable no-console */

const assert = require('assert');
const { rollup } = require('rollup');
const replace = require('../dist/rollup-plugin-replace.cjs.js');
const fs = require('fs');

process.chdir(__dirname);

function execute(code, context = {}) {
	let fn;
	const contextKeys = Object.keys(context);
	const argNames = contextKeys.concat('module', 'exports', 'assert', code);

	try {
		fn = new Function(...argNames);
	} catch (err) {
		// syntax error
		console.log(code);
		throw err;
	}
	const module = { exports: {} };
	const argValues = contextKeys.map(key => context[key]).concat(module, module.exports, assert);

	fn(...argValues);

	return module.exports;
}

const getOutputFromGenerated = generated => (generated.output ? generated.output[0] : generated);

async function getCodeFromBundle(bundle, customOptions = {}) {
	const options = Object.assign({ format: 'cjs' }, customOptions);
	return getOutputFromGenerated(await bundle.generate(options)).code;
}

describe('rollup-plugin-replace', () => {
	describe('form', () => {
		const transformContext = {};

		fs.readdirSync('form').forEach(dir => {
			let config;

			try {
				config = require(`./form/${dir}/_config.js`);
			} catch (err) {
				config = {};
			}

			(config.solo ? it.only : it)(`${dir}: ${config.description}`, () => {
				const { transform } = replace(config.options);
				const input = fs.readFileSync(`form/${dir}/input.js`, 'utf-8');
				const expected = fs.readFileSync(`form/${dir}/output.js`, 'utf-8').trim();

				return Promise.resolve(transform.call(transformContext, input, 'input.js')).then(
					transformed => {
						const actual = (transformed ? transformed.code : input).trim();
						assert.equal(actual, expected);
					}
				);
			});
		});
	});

	describe('function', () => {
		fs.readdirSync('function').forEach(dir => {
			let config;

			try {
				config = require(`./function/${dir}/_config.js`);
			} catch (err) {
				config = {};
			}

			(config.solo ? it.only : it)(`${dir}: ${config.description}`, async () => {
				const options = Object.assign(
					{
						input: `function/${dir}/main.js`
					},
					config.options || {},
					{
						plugins: [
							...((config.options && config.options.plugins) || []),
							replace(config.pluginOptions)
						]
					}
				);

				const bundle = await rollup(options);
				const code = await getCodeFromBundle(bundle);
				if (config.show || config.solo) {
					console.error(code);
				}
				const exports = execute(code, config.context);

				if (config.exports) config.exports(exports);
			});
		});
	});

	describe('misc', () => {
		it('does not mutate the values map properties', async () => {
			const valuesMap = { ANSWER: '42' };
			const bundle = await rollup({
				input: 'main.js',
				plugins: [
					replace({ values: valuesMap }),
					{
						resolveId(id) {
							return id;
						},
						load(importee) {
							if (importee === 'main.js') {
								return 'console.log(ANSWER);';
							}
						}
					}
				]
			});

			const { code } = getOutputFromGenerated(await bundle.generate({ format: 'es' }));
			assert.equal(code.trim(), 'console.log(42);');
			assert.deepEqual(valuesMap, { ANSWER: '42' });
		});
	});
});
