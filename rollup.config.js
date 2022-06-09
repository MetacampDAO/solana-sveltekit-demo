// ... other imports
import json from '@rollup/plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import globals from 'rollup-plugin-node-globals';

export default {
	// ... other configs
	plugins: [
		// ... other rollup plugins
		resolve({
			browser: true,
			dedupe: ['svelte'],
			preferBuiltins: false
		}),
		// ... more rollup plugins
		json(),
		globals(),
		builtins()
	]
};