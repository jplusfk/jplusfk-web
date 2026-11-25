import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Celý obsah webu je v jednom souboru src/content/web/uvod.yml,
// který se upravuje v administraci (/admin/). Struktura polí odpovídá public/admin/config.yml.

const odkaz = z.object({
  text: z.string(),
  url: z.string(),
});

const web = defineCollection({
  loader: glob({ pattern: '*.yml', base: './src/content/web' }),
  schema: ({ image }) =>
    z.object({
      seo: z.object({
        title: z.string(),
        description: z.string(),
        og_image: image().optional(),
      }),
      hero: z.object({
        nadtitul: z.string().optional(),
        nazev: z.string(),
        autor: z.string(),
        podtitul: z.string().optional(),
        obalka: image().optional(),
        obalka_alt: z.string().default(''),
        tlacitko: z.string().optional(),
        cenovka: z
          .object({
            zobrazit: z.boolean().default(true),
            cena: z.string(),
            puvodni: z.string().optional(),
            text: z.string().optional(),
          })
          .optional(),
      }),
      kniha: z.object({
        nadpis: z.string(),
        text: z.string(),
        foto: image().optional(),
        foto_alt: z.string().default(''),
        parametry: z.array(z.object({ nazev: z.string(), hodnota: z.string() })).default([]),
        koupit_nadpis: z.string().optional(),
        koupit_text: z.string().optional(),
        koupit_odkazy: z.array(odkaz).default([]),
      }),
      galerie: z.object({
        zobrazit: z.boolean().default(true),
        nadpis: z.string().optional(),
        fotky: z.array(z.object({ foto: image(), alt: z.string().default('') })).default([]),
      }),
      soundtrack: z.object({
        nadpis: z.string(),
        text: z.string(),
        foto: image().optional(),
        foto_alt: z.string().default(''),
        interpreti: z.array(z.object({ jmeno: z.string(), role: z.string().optional() })).default([]),
        poslech_nadpis: z.string().optional(),
        platformy: z
          .array(z.object({ nazev: z.string(), url: z.string(), zobrazit: z.boolean().default(true) }))
          .default([]),
        poznamka: z.string().optional(),
      }),
      pomoc: z.object({
        zobrazit: z.boolean().default(true),
        nadpis: z.string(),
        cislo: z.string().optional(),
        text: z.string(),
        odkaz: z.object({ text: z.string().optional(), url: z.string().optional() }).optional(),
        ucet: z
          .object({
            nazev: z.string().optional(),
            cislo: z.string().optional(),
            iban: z.string().optional(),
            majitel: z.string().optional(),
            qr: z.boolean().default(true),
          })
          .optional(),
      }),
      recenze: z
        .object({
          zobrazit: z.boolean().default(false),
          nadpis: z.string().default('Napsali o knize'),
          polozky: z
            .array(
              z.object({
                citat: z.string(),
                autor: z.string().optional(),
                zdroj: z.string().optional(),
                url: z.string().optional(),
              }),
            )
            .default([]),
        })
        .default({ zobrazit: false, nadpis: 'Napsali o knize', polozky: [] }),
      autor: z.object({
        zobrazit: z.boolean().default(true),
        nadpis: z.string(),
        text: z.string(),
        foto: image().optional(),
        foto_alt: z.string().default(''),
      }),
      vydavatelstvi: z.object({
        nadpis: z.string(),
        text: z.string(),
      }),
      kontakt: z.object({
        nadpis: z.string(),
        nazev: z.string(),
        adresa: z.string().optional(),
        ico: z.string().optional(),
        email: z.string().optional(),
        telefon: z.string().optional(),
        formular: z
          .object({
            zobrazit: z.boolean().default(true),
            nadpis: z.string().optional(),
            text: z.string().optional(),
            klic: z.string().optional(),
            souhlas: z.string().optional(),
          })
          .optional(),
      }),
      paticka: z.object({
        text: z.string().optional(),
        tiraz: z.array(z.object({ nazev: z.string(), hodnota: z.string() })).default([]),
      }),
    }),
});

export const collections = { web };
