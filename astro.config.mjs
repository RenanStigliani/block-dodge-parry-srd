// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
    site: 'https://renanstigliani.github.io',
    base: '/block-dodge-parry-srd',
    integrations: [
        starlight({
            title: 'Block, Dodge, Parry',
            description: 'A levelless, classless expansion of Cairn — System Reference Document (SRD).',
            customCss: ['./src/styles/custom.css'],
            components: {
                TableOfContents: './src/components/TableOfContentsWithReport.astro',
                MobileTableOfContents: './src/components/MobileTableOfContentsWithReport.astro',
            },
            locales: {
                root: { label: 'Português (Brasil)', lang: 'pt-BR' },
            },
            social: [
                { icon: 'github', label: 'GitHub', href: 'https://github.com/renanstigliani/block-dodge-parry-srd' },
            ],
            sidebar: [
                { label: 'Início', link: '/' },
                { label: 'Introdução', link: '/introduction/' },
                { label: 'Princípios Básicos', link: '/basic-principles/' },
                { label: 'Criação de Personagem', link: '/character-creation/' },
                { label: 'Regras', link: '/rules/' },
                { label: 'Tarefas Complexas', link: '/complex-tasks/' },
                { label: 'Conflito Social', link: '/social-conflict/' },
                { label: 'Combate', link: '/combat/' },
                { label: 'Carreiras e Perícias', link: '/careers-skills/' },
                { label: 'Aprimoramento de Personagem', link: '/character-improvement/' },
                { label: 'Armas, Armaduras e Equipamento', link: '/weapons-armor-gear/' },
                { label: 'Magia', link: '/magic/' },
                {
                    label: 'Conduzindo Aventuras',
                    items: [
                        { label: 'Visão Geral', link: '/running-adventures/' },
                        { label: 'Assentamentos', link: '/running-adventures/settlements/' },
                        { label: 'Natureza Selvagem', link: '/running-adventures/wilderness/' },
                        { label: 'Masmorras', link: '/running-adventures/dungeons/' },
                    ],
                },
                { label: 'Amigos, Inimigos e Monstros', link: '/friends-foes-monsters/' },
                { label: 'Ferramentas e Tabelas', link: '/tools-tables/' },
                { label: 'Créditos e Agradecimentos', link: '/credits-acknowledgements/' },
                { label: 'Expansões, Módulos e Masmorras', link: '/expansions/' },
                { label: 'Recursos', link: '/resources/' },
            ],
        }),
    ],
});
