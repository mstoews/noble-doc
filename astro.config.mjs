// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Noble Ledger',
			social: {
				github: 'https://github.com/mstoews/noble-cp',
			},
			sidebar: [				
				{
					label: 'Accounting',
					autogenerate: { directory: 'accounting' },					
				},
				{
					label: 'Guides',
					autogenerate: { directory: 'guides' },					
				},
				{
					label: 'Noble Ledger',
					autogenerate: { directory: 'noble_ledger' },
				},				
			],
		}),
	],
});
