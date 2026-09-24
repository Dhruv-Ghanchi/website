"use client";

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Plus } from 'lucide-react';
import { accordionSpring, Person, Reveal } from './ui';
import type { TeamMember } from '@/lib/content';
import type { FaqItem, SiteSettings } from '@/lib/strapi';

export function FAQ({ contact = false, siteSettings, teamMembers, faqItems }: { contact?: boolean; siteSettings: SiteSettings; teamMembers: TeamMember[]; faqItems: FaqItem[] }) {
  const questions = faqItems.reduce<Record<string, FaqItem[]>>((acc, item) => {
    (acc[item.category] ||= []).push(item);
    return acc;
  }, {});
  const tabs = Object.keys(questions);
  const [category, setCategory] = useState(tabs[0] || '');
  const [active, setActive] = useState<number | null>(0);
  const key = (tab: string) => tab.toLowerCase().replaceAll(' ', '-');
  if (!category) return null;
  return <section className={`faq-section container section-space ${contact ? 'contact-faq' : ''}`} id="faq"><Reveal><h2 className="display-title">{siteSettings.faqHeading}</h2></Reveal><div className="faq-layout"><Reveal><div className="faq-tabs" role="tablist" aria-label="Frequently asked question categories" aria-orientation={contact ? 'horizontal' : 'vertical'}>{tabs.map((tab, i) => <button key={tab} id={`faq-tab-${key(tab)}`} role="tab" aria-selected={category === tab} aria-controls="faq-panel" tabIndex={category === tab ? 0 : -1} onClick={() => { setCategory(tab); setActive(0); }} onKeyDown={event => { if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); const next = tabs[event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (i + (event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; setCategory(next); setActive(0); document.getElementById(`faq-tab-${key(next)}`)?.focus(); } }}><span>{tab}</span><ArrowUpRight size={16}/></button>)}</div></Reveal><div id="faq-panel" role="tabpanel" aria-labelledby={`faq-tab-${key(category)}`} className="faq-items">{questions[category].map((item, i) => <div className={`faq-item ${active === i ? 'open' : ''}`} key={item.id}><h3><button aria-expanded={active === i} aria-controls={`faq-answer-${key(category)}-${i}`} onClick={() => setActive(active === i ? null : i)}>{item.question}<Plus size={22}/></button></h3><AnimatePresence initial={false}>{active === i && <motion.div id={`faq-answer-${key(category)}-${i}`} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={accordionSpring}><p>{item.answer}</p></motion.div>}</AnimatePresence></div>)}<div className="faq-help"><Person image={teamMembers[0]?.headshot || ''} name={siteSettings.moreQuestionsLabel} role={siteSettings.moreQuestionsSubtext} focalX={teamMembers[0]?.headshotFocalX} focalY={teamMembers[0]?.headshotFocalY}/>{!contact && <Link href="/contact-us">{siteSettings.talkLinkLabel} <ArrowUpRight size={17}/></Link>}</div></div></div></section>;
}
