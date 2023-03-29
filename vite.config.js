import { sveltekit } from '@sveltejs/kit/vite';
import inject from '@rollup/plugin-inject';
import path from 'path';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	define: {
		'process.env.BROWSER': true,
		'process.env.NODE_DEBUG': JSON.stringify(''),
		'process.env.VERSION': JSON.stringify(process.env.npm_package_version)
	},
	optimizeDeps: {
		include: ['@solana/web3.js', 'buffer'],
		esbuildOptions: {
			target: 'es2020'
		}
	},
	resolve: {
		alias: {
			$stores: path.resolve('./src/stores')
		}
	},
	build: {
		rollupOptions: {
			plugins: [inject({ Buffer: ['buffer', 'Buffer'] })]
		},
		target: 'es2020'
	},
	server: {
		port: 3000
	}
};

export default config;
