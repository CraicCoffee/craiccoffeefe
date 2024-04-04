import { useLockFn } from 'ahooks';
import { Button, Input, message } from 'antd';
import { useState } from 'react';
import { verifyGiftCard } from '../service';

export default function () {
  const [code, setCode] = useState('');

  const verify = useLockFn(async () => {
    if (!code) return;
    const response = await verifyGiftCard(code);
    if (response.data.verified) {
      message.success(`兑换成功，增加了${response.data.days}天的账户有效期`);
      setCode('');
    } else {
      message.error('兑换失败，请检查礼品卡代码是否正确');
    }
  });

  return (
    <div>
      <Input
        style={{ width: 500, marginRight: 16 }}
        placeholder="请输入礼品卡代码"
        value={code}
        onChange={(v) => {
          setCode(v.target.value);
        }}
      />
      <Button type="primary" onClick={verify}>
        兑换
      </Button>
    </div>
  );
}
