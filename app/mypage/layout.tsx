export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='relative box-border flex min-h-screen w-full max-w-[600px] flex-col'>
      <div className='relative flex-1'>{children}</div>
    </div>
  );
}
