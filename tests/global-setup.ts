import { writeFileSync } from 'node:fs';
import path from 'node:path';
import type { FixtureData, FixtureItem } from './fixture-data';

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

async function fetchAll(query: string): Promise<FixtureItem[]> {
  const res = await fetch(`${STRAPI_URL}/api/${query}`);
  const json = await res.json();
  return json.data;
}

export default async function globalSetup() {
  const [articles, legalPages, services, teamMembers, newsletters] = await Promise.all([
    fetchAll('articles?pagination[pageSize]=100'),
    fetchAll('legal-pages?pagination[pageSize]=100'),
    fetchAll('services?pagination[pageSize]=100'),
    fetchAll('team-members?pagination[pageSize]=100'),
    fetchAll('newsletters?pagination[pageSize]=200'),
  ]);
  const data: FixtureData = { articles, legalPages, services, teamMembers, newsletters };
  writeFileSync(path.join(__dirname, '.fixture-data.json'), JSON.stringify(data));
}
