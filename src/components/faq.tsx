"use client";

import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight, Plus } from 'lucide-react';
import { accordionSpring, Person, Reveal } from './ui';
import { teamMembers } from '@/lib/content';

const questions: Record<string, { question: string; answer: string }[]> = {
  General: [
    { question: 'What does Ghanchi Investments do?', answer: 'We provide goal-based financial planning and support across life insurance, health insurance, mutual funds, retirement, child education, personal accident, general insurance and employer–employee insurance.' },
    { question: 'Who do you work with?', answer: 'Our clients include individuals, families, business owners, NRIs and professionals across India and abroad. Advice considers your specific needs rather than a standard package.' },
    { question: 'Where are you based?', answer: 'Our office is at Shop no. 27, Sector 11, Balaji Bhavan, CBD Belapur, Navi Mumbai, Maharashtra 400614. Call +91 9820926446 or +91 7977061717 to get in touch.' },
  ],
  Planning: [
    { question: 'How does financial planning begin?', answer: 'We begin by understanding your goals, concerns, risk appetite and cash flows. Recommendations are customized around those needs.' },
    { question: 'Do you help implement the plan?', answer: 'Yes. Ghanchi Investments assists with implementing recommendations and provides an annual review.' },
    { question: 'What should I share in an enquiry?', answer: 'Tell us your broad goal and the services you are interested in. Do not include passwords, account credentials or sensitive financial documents in the website form.' },
  ],
  Protection: [
    { question: 'How do I choose insurance cover?', answer: 'Start with your needs and dependants, and review coverage, exclusions, waiting periods, premiums and eligibility. Benefits depend on the selected policy and its terms.' },
    { question: 'Do you assist with claims?', answer: 'Ghanchi Investments provides after-sales service and assistance with claim settlement. The insurer determines claim eligibility under the policy terms.' },
  ],
  'Online Services': [
    { question: 'Where can I access my investments or renew a policy?', answer: 'The Online Services page links to LIC, Fundz Bazar, NJ account portals and insurer renewal pages. These are external provider websites with their own terms and security controls.' },
    { question: 'Are the ratings updated live?', answer: 'No. The displayed 5.0 rating is the owner-approved value from the existing Ghanchi website. Google synchronization has not been connected.' },
    { question: 'Do you guarantee investment returns?', answer: 'No. Mutual fund investments are subject to market risks and past performance does not guarantee future returns. Review all scheme and policy documents before deciding.' },
  ],
};
export function FAQ({ contact = false }: { contact?: boolean }) {
  const [category, setCategory] = useState('General');
  const [active, setActive] = useState<number | null>(0);
  const tabs = Object.keys(questions);
  const key = (tab: string) => tab.toLowerCase().replaceAll(' ', '-');
  return <section className={`faq-section container section-space ${contact ? 'contact-faq' : ''}`} id="faq"><Reveal><h2 className="display-title">FAQ</h2></Reveal><div className="faq-layout"><Reveal><div className="faq-tabs" role="tablist" aria-label="Frequently asked question categories" aria-orientation={contact ? 'horizontal' : 'vertical'}>{tabs.map((tab, i) => <button key={tab} id={`faq-tab-${key(tab)}`} role="tab" aria-selected={category === tab} aria-controls="faq-panel" tabIndex={category === tab ? 0 : -1} onClick={() => { setCategory(tab); setActive(0); }} onKeyDown={event => { if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) { event.preventDefault(); const next = tabs[event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (i + (event.key === 'ArrowDown' || event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; setCategory(next); setActive(0); document.getElementById(`faq-tab-${key(next)}`)?.focus(); } }}><span>{tab}</span><ArrowUpRight size={16}/></button>)}</div></Reveal><div id="faq-panel" role="tabpanel" aria-labelledby={`faq-tab-${key(category)}`} className="faq-items">{questions[category].map((item, i) => <div className={`faq-item ${active === i ? 'open' : ''}`} key={`${category}-${item.question}`}><h3><button aria-expanded={active === i} aria-controls={`faq-answer-${key(category)}-${i}`} onClick={() => setActive(active === i ? null : i)}>{item.question}<Plus size={22}/></button></h3><AnimatePresence initial={false}>{active === i && <motion.div id={`faq-answer-${key(category)}-${i}`} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={accordionSpring}><p>{item.answer}</p></motion.div>}</AnimatePresence></div>)}<div className="faq-help"><Person image={teamMembers[0].headshot} name="More questions?" role="Reach out anytime."/><Link href="/contact-us">Let’s talk <ArrowUpRight size={17}/></Link></div></div></div></section>;
}
