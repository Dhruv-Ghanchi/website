export type RichTextBlock = { heading?: string; paragraphs: string[] };
export type Testimonial = { id: string; quote: string; name: string; role: string; image: string; focalX: number; focalY: number; sourceUrl: string };
export type Service = { id: string; title: string; icon: string; shortDesc: string; longDesc: string; deliverables: string[]; image: string; imageFocalX: number; imageFocalY: number; testimonial: Testimonial; sourceUrl: string };
export type TeamMember = { id: string; name: string; role: string; headshot: string; headshotFocalX: number; headshotFocalY: number; bio: string; socialLinks: { label: string; url: string }[] };
export type Category = { id: string; name: string };
export type Article = { id: string; title: string; coverImage: string; coverFocalX: number; coverFocalY: number; publishDate: string; content: RichTextBlock[]; categoryId: string; sourceUrl: string; editorialNote: string };
export type Newsletter = { id: string; title: string; issueMonth: string; coverImage: string; url: string | null };
export type GalleryItem = { id: string; title: string; image: string; sourceUrl: string };
export type OnlineService = { id: string; title: string; description: string; url: string; type: 'internal' | 'external' };
export type LegalPage = { id: string; title: string; content: RichTextBlock[] };
export type NavItem = { title: string; href: string; children?: { title: string; href: string }[] };
export type Stat = { value: number; suffix: string; label: string; decimals?: number };
export const asset = (name: string) => `/assets/${name}`;
export const getCategory = (article: Article, categories: Category[]) => categories.find(item => item.id === article.categoryId);
export const formatDate = (value: string) => new Intl.DateTimeFormat('en-IN', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(value));
export const formatIssue = (value: string) => new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}-01`));
export function safeUrl(value: string) {
  if (/^\/(?!\/)/.test(value) && !/[\\\s]/.test(value)) return true;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; } catch { return false; }
}
