import themeList from '@/constants/themeList';

export default function ThemeTag({ type }: { type: string }) {
  const theme = themeList.find(theme => theme.type === type);

  if (!theme) return <div />;

  return (
    <div
      className={`flex h-[22px] w-[54px] items-center justify-center rounded-sm`}
      style={{
        backgroundColor: theme.bgColor,
        color: theme.color,
      }}
    >
      <p className={`ui-text-sub-head-3`}>{theme.label}</p>
    </div>
  );
}
