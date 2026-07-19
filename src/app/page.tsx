import { redirect } from 'next/navigation';

/** The dashboard is the authenticated application's landing page. */
export default function Home() {
  redirect('/dashboard');
}
