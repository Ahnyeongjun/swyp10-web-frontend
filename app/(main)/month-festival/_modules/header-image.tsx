import Image from 'next/image';

export default function HeaderImage({ image }: { image: string }) {
  if (!image) return null;

  return (
    <div className='relative w-full'>
      <Image
        src={image}
        alt='header-image'
        className='h-full w-full object-cover'
        style={{
          aspectRatio: '16/9',
        }}
        width={1000}
        height={200}
      />
    </div>
  );
}
