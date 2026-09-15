import { Button } from '@/components/ui';

export default function NotFound() {
  return <main id="main" className="not-found container"><p>404 — Page not found</p><h1>Let’s get you<br/>back on track.</h1><p>The page you’re looking for doesn’t exist or has moved.</p><Button href="/" variant="dark" dot>Back to home</Button></main>;
}
