import { useAuthStore } from '@/store/use-auth-store';
import { redirect } from 'next/navigation';

export default async function View() {
  // to-do
  // const { authenticated } = useAuthStore.getState();
  // if (!authenticated) {
  return redirect('/');
  // } else {
  //   redirect('/view/info');
  // }
}
