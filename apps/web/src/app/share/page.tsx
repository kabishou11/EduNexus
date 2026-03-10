import { redirect } from 'next/navigation';

export default async function SharePage({
  searchParams,
}: {
  searchParams: { title?: string; text?: string; url?: string };
}) {
  // Handle shared content
  const { title, text, url } = searchParams;

  // Process shared content (save to database, etc.)
  console.log('Shared content:', { title, text, url });

  // Redirect to appropriate page
  // For now, redirect to knowledge base with shared content as query params
  const params = new URLSearchParams();
  if (title) params.set('title', title);
  if (text) params.set('text', text);
  if (url) params.set('url', url);

  redirect(`/kb?${params.toString()}`);
}
