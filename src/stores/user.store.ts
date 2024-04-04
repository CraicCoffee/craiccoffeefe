import { currentUser } from '@/services/insightMon/authController';
import { createGlobalStore } from 'hox';
import useSWR from 'swr';

export const [useUserStore] = createGlobalStore(() => {
  const { data: user } = useSWR(
    'current-user',
    async () => {
      const res = await currentUser();
      return res.data;
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 1000 * 60 * 60, // 1 小时刷新一次
    },
  );

  return {
    user, // TODO: 后面可以考虑优化一下 user 的空值判断问题
  };
});
