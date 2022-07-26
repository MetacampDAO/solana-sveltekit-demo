import { sveltekit } from '@sveltejs/kit/vite';
import builtins from 'rollup-plugin-node-builtins';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [
		sveltekit(),
		builtins()
	],
	server: {
		port: 3000
	}
};

export default config;
