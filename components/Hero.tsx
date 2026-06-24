'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { Locale } from '@/lib/i18n';
import type { UIDict } from '@/lib/dictionary';
import { ArrowRight } from './icons';

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({
  image,
  locale,
  ui,
  stats,
}: {
  image: string;
  locale: Locale;
  ui: UIDict;
  stats: string;
}) {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: 0.1 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
  };

  return (
    <section className="relative overflow-hidden pt-28 sm:pt-32">
      <div className="shell">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.p variants={item} className="eyebrow flex items-center gap-3">
            <span className="h-px w-8 bg-ember" />
            {ui.hero.eyebrow}
          </motion.p>

          <h1 className="mt-6 font-display text-[clamp(2.75rem,9vw,7.5rem)] font-semibold leading-[0.92] tracking-tight text-ink">
            <span className="block overflow-hidden">
              <motion.span variants={item} className="block">
                {ui.hero.titleA}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span variants={item} className="block italic text-ember">
                {ui.hero.titleB}
              </motion.span>
            </span>
          </h1>

          <div className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <motion.p
              variants={item}
              className="max-w-prose text-lg leading-relaxed text-muted"
            >
              {ui.hero.lede}
            </motion.p>
            <motion.div variants={item} className="flex shrink-0 items-center gap-3">
              <Link
                href={`/${locale}/recipes`}
                className="flex cursor-pointer items-center gap-2 rounded-full bg-ink px-6 py-3 font-mono text-xs uppercase tracking-label text-paper transition-colors hover:bg-ember"
              >
                {ui.hero.browse}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={`/${locale}/cuisines`}
                className="rounded-full border border-line bg-surface px-6 py-3 font-mono text-xs uppercase tracking-label text-ink transition-colors hover:border-ink/40"
              >
                {ui.hero.cuisines}
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: reduce ? 1 : 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.15 }}
          className="relative mt-14 aspect-[16/9] overflow-hidden rounded-3xl border border-line bg-line sm:aspect-[2.4/1]"
        >
          <Image
            src={image}
            alt={ui.hero.quote}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 right-5 flex flex-wrap items-end justify-between gap-4">
            <p className="max-w-xs font-display text-lg italic text-paper drop-shadow">
              “{ui.hero.quote}”
            </p>
            <span className="rounded-full bg-paper/90 px-4 py-1.5 font-mono text-[0.62rem] uppercase tracking-label text-ink backdrop-blur">
              {stats}
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
