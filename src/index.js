import MagicString from 'magic-string';
import { createFilter } from 'rollup-pluginutils';

function escape(str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

function functor(thing) {
	if (typeof thing === 'function') return thing;
	return () => thing;
}

function longest(a, b) {
	return b.length - a.length;
}

export default function replace(options = {}) {
	const filter = createFilter(options.include, options.exclude);
	const delimiters = (options.delimiters || ['', '']).map(escape);

	let values;

	if (options.values) {
		values = options.values;
	} else {
		values = Object.assign({}, options);
		delete values.delimiters;
		delete values.include;
		delete values.exclude;
	}

	const keys = Object.keys(values).sort(longest).map(escape);
	const pattern = new RegExp(
		delimiters[0] + '(' + keys.join('|') + ')' + delimiters[1],
		'g'
	);

	// convert all values to functions
	Object.keys(values).forEach(key => {
		values[key] = functor(values[key]);
	});

	return {
		name: 'replace',

		transform(code, id) {
			if (!filter(id)) return null;

			const magicString = new MagicString(code);

			let hasReplacements = false;
			let match;
			let start, end, replacement;

			while ((match = pattern.exec(code))) {
				hasReplacements = true;

				start = match.index;
				end = start + match[0].length;
				replacement = String(values[match[1]](id));

				magicString.overwrite(start, end, replacement);
			}

			if (!hasReplacements) return null;

			let result = { code: magicString.toString() };
			if (options.sourceMap !== false)
				result.map = magicString.generateMap({ hires: true });

			return result;
		}
	};
}
