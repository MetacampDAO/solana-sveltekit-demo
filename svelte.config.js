import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import path from 'path'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess( 
		{
			sourceMap: true
		}
	),

	kit: {
		adapter: adapter(),

		// Override http methods in the Todo forms
		methodOverride: {
			allowed: ['PATCH', 'DELETE']
		},
		vite: {
			// SOLANA WALLET ADAPTER
			define: {
				'process.env.BROWSER': true
			},
			optimizeDeps: {
				include: ['@solana/web3.js', 'buffer']
			},
		}
	}
};

export default config;
