import { PageContainer } from '@/components/page-container';
import { useUserStore } from '@/stores/user.store';
import { CheckCircleOutlined, WarningOutlined } from '@ant-design/icons';
import moment from 'moment';
import {SectionCard} from "@/components/section-card";

export default function () {
  const { user } = useUserStore();

  if (!user) return null;
  return (
    <PageContainer hideBreadcrumb>
      <SectionCard title="时间额度">
        {user.alreadyExpired ? (
          <>
            <WarningOutlined style={{ color: 'red', marginRight: '0.4em' }} />
            {user.expiresAt ? `您的账户已于 ${user.expiresAt} 过期` : '您的账户暂未开通服务'}
          </>
        ) : (
          <>
            <CheckCircleOutlined style={{ color: 'green', marginRight: '0.4em' }} />
            {`您的账户有效期至 ${moment(user.expiresAt).format('YYYY-MM-DD HH:mm')}`}
          </>
        )}
      </SectionCard>
    </PageContainer>
  );
}
