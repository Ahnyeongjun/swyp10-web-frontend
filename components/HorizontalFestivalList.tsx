import HorizontalFestivalListItem from './HorizontalFestivalListItem';

interface Festival {
  id: string;
  image: string;
  theme: string;
  title: string;
  location: string;
  isMarked?: boolean;
}

interface HorizontalFestivalListProps {
  festivals: Festival[];
  onFestivalClick?: (festival: Festival) => void;
}

export default function HorizontalFestivalList({
  festivals,
  onFestivalClick,
}: HorizontalFestivalListProps) {
  return (
    <div className='flex flex-col gap-4'>
      <h2 className='text-lg font-bold text-[#090a0c]'>나의 맞춤 축제</h2>
      <div className='flex flex-nowrap gap-3 overflow-x-auto'>
        {festivals.map(festival => (
          <HorizontalFestivalListItem
            key={festival.id}
            image={festival.image}
            theme={festival.theme}
            title={festival.title}
            location={festival.location}
            isMarked={festival.isMarked}
            onClick={() => onFestivalClick?.(festival)}
          />
        ))}
      </div>
    </div>
  );
}
