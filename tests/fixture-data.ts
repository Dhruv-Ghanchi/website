export type FixtureItem = { id: number; slug?: string; title?: string; name?: string; url?: string | null };
export type FixtureData = {
  articles: FixtureItem[];
  legalPages: FixtureItem[];
  services: FixtureItem[];
  teamMembers: FixtureItem[];
  newsletters: FixtureItem[];
};
