import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function View() {
  const session = await auth();

  if (!session?.user) {
    return redirect('/');
  } else {
    redirect('/view/info');
  }
}
