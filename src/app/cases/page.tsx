import type { Metadata } from 'next';
import { caseStudies } from '@/lib/content';
import { CaseCard, InnerCTA, PageIntro } from '@/components/inner-pages';

export const metadata: Metadata = { title: 'Case Studies', description: 'The work speaks for itself. Here’s what growth looks like in practice. Explore Kora’s client case studies.' };

export default function CasesPage() {
  return <main className="inner-page"><PageIntro title="Case studies." description="The work speaks for itself. Here’s what growth looks like in practice." /><section className="container inner-case-list" aria-label="Client case studies">{caseStudies.map(study => <CaseCard study={study} key={study.id} />)}</section><InnerCTA /></main>;
}
