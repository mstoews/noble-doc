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
					label: 'Condominiums Guide',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Algorithms Example', slug: 'guides/chat' },
						{ label: 'Condo Requirements', slug: 'guides/condo_requirements' },						
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
