import Image from 'next/image';

export default function Splash() {
  return (
    <div className='flex min-h-screen w-full max-w-[600px] flex-col items-center justify-center bg-black'>
      <Image src='/image/logo_image.png' alt='loading' width={55} height={44} />
      <Image
        src='/image/logo_white.png'
        alt='loading'
        className='mt-8'
        width={116}
        height={40}
      />
    </div>
  );
}
