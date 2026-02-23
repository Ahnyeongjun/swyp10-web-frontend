interface FilterItem {
  type: string;
  label: string;
}

interface FilterSectionProps {
  label: string;
  list: FilterItem[];
  value: string | null;
  setValue: React.Dispatch<React.SetStateAction<string | null>>;
  showAllOption?: boolean;
}

interface FilterItemComponentProps {
  itemLabel: string;
  onclick: () => void;
  checked: boolean;
}

function FilterItemComponent({
  itemLabel,
  onclick,
  checked,
}: FilterItemComponentProps) {
  return (
    <div
      className={`flex h-[36px] w-[76px] items-center justify-center rounded-lg ${
        checked ? 'border border-gray-400 bg-gray-50' : 'border border-gray-100'
      } cursor-pointer`}
      onClick={onclick}
    >
      {itemLabel}
    </div>
  );
}

export default function FilterSection({
  label,
  list,
  value,
  setValue,
  showAllOption = true,
}: FilterSectionProps) {
  return (
    <div className='flex flex-col gap-2'>
      <p className='ui-text-sub-head'>{label}</p>
      <div className='flex flex-wrap gap-x-1 gap-y-2'>
        {list.map(item => {
          return (
            <FilterItemComponent
              checked={value === item.type}
              itemLabel={item.label}
              key={item.type}
              onclick={() => {
                setValue(item.type);
              }}
            />
          );
        })}
        {showAllOption && (
          <FilterItemComponent
            checked={value === null}
            itemLabel={'전체'}
            onclick={() => {
              setValue(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export type { FilterItem, FilterSectionProps };
