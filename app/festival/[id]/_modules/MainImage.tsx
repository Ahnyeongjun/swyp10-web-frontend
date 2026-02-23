import Image from 'next/image';
import { useRouter } from 'next/navigation';

import BackIcon from '@/assets/icons/back.svg';

interface MainImageProps {
  src: string;
  alt: string;
}

export default function MainImage({ src, alt }: MainImageProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className='relative aspect-[2/1] w-full overflow-hidden'>
      <Image
        src={src || '/image/text-logo.png'}
        alt={alt}
        className='h-full w-full object-cover'
        fill
      />
      {/* Shadow overlay */}
      <div className='absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent'></div>
      {/* 뒤로가기 버튼 */}
      <div className='absolute top-2 left-3 z-10'>
        <button
          className='flex h-8 w-8 items-center justify-center rounded-full bg-black/20'
          onClick={handleBack}
        >
          <BackIcon className='h-[13px] w-[7px]' />
        </button>
      </div>
    </div>
  );
}
