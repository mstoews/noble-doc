// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import sitemap from '@astrojs/sitemap';


import nobleledger from './vendor/integration';

// https://astro.build/config
export default defineConfig({
	integrations: [		
		tailwind({
			applyBaseStyles: false,
		}),
		sitemap(),
		
		icon({
			include: {
			  tabler: ['*'],
			  'flat-color-icons': [
				'template',
				'gallery',
				'approval',
				'document',
				'advertising',
				'currency-exchange',
				'voice-presentation',
				'business-contact',
				'database',
			  ],
			},
		}),
		starlight({
			title: 'Noble Ledger',
			social: {
				github: 'https://github.com/mstoews/noble-cp',
			},
			
			sidebar: [				
				{
					label: 'Noble Ledger',
					autogenerate: { directory: 'noble_ledger' },
				},				
				{
					label: 'Accounting',
					autogenerate: { directory: 'accounting' },					
				},
				{
					label: 'Guides',
					autogenerate: { directory: 'guides' },					
				},
				{
					label: 'Company Policies',
					autogenerate: { directory: 'policy' },					
				},
				
			],
			
		}),
		mdx(),
		nobleledger({
			config: './src/config.yaml',
		}),
	],
});
