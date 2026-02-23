import { Nav } from '@/components/nav';
import TabBar from '@/layouts/tab-bar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='relative box-border flex h-screen w-full max-w-[600px] flex-col'>
      <div className='fixed top-0 z-10 flex w-full flex-col bg-white'>
        <Nav />
      </div>

      <div className='mt-[45px] flex-1'>{children}</div>

      <div className='sticky bottom-0 z-10 bg-white'>
        <TabBar />
      </div>
    </div>
  );
}
