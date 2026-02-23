import { showCustomToast } from '@/components/CustomToast';

export const useShareThisPage = () => {
  const share = async () => {
    try {
      const url = `${window.location.href}&shared=true`;
      await navigator.clipboard.writeText(url);
      showCustomToast({ message: '링크가 복사되었습니다.', type: 'success' });
    } catch {
      showCustomToast({ message: '복사에 실패했어요.', type: 'error' });
    }
  };

  return { share };
};
