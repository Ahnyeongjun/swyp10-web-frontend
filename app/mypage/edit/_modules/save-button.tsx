'use client';

import { Button } from '@/components/Button';

export default function SaveButton({ onClick }: { onClick: () => void }) {
  return (
    <Button size='sm' onClick={onClick}>
      저장
    </Button>
  );
}
