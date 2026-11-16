import { redirect } from 'next/navigation';

// /docs is removed from the app — all documentation lives in README.md on GitHub.
export default function DocsPage() {
  redirect('/dashboard');
}
