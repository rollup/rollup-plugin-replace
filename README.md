# rollup-plugin-replace

**Experimental - depends on unreleased version of Rollup**

Replace strings in files while bundling them.


## Installation

```bash
npm install --save-dev rollup-plugin-replace
```


## Usage

```js
import { rollup } from 'rollup';
import replace from 'rollup-plugin-replace';

rollup({
  entry: 'main.js',
  plugins: [
    replace({
      ENVIRONMENT: JSON.stringify( 'production' )
    })
  ]
}).then(...)
```


## Options

```js
{
  // a minimatch pattern, or array of patterns, of files that
  // should be processed by this plugin (if omitted, all files
  // are included by default)...
  include: 'config.js',

  // ...and those that shouldn't, if `include` is otherwise
  // too permissive
  exclude: 'node_modules/**',

  // To replace every occurence of `<@foo@>` instead of every
  // occurence of `foo`, supply delimiters
  delimiters: [ '<@', '@>' ],

  // All other options are treated as `string: replacement`
  // replacers...
  foo: 'bar',
  ENVIRONMENT: JSON.stringify( 'development' ),

  // ...unless you want to be careful about separating
  // replacers from other options, in which case you can:
  replacers: {
    foo: 'bar',
    ENVIRONMENT: JSON.stringify( 'development' )
  }
}
```


## License

MIT
