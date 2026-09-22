import { permanentRedirect } from 'next/navigation';
export default async function LegacyContact({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams;
  permanentRedirect(`/contact-us${typeof service === 'string' ? `?service=${encodeURIComponent(service)}` : ''}`);
}
