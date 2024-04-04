// @ts-ignore
import { Request, Response } from 'express';

export default {
  'POST /api/v0/auth/login': (req: Request, res: Response) => {
    res.status(200).send({
      success: false,
      data: { type: 588, currentAuthority: 'admin' },
      errorMessage: '将该身空化法非表何你此四再全。',
      requestId: 'b7Af913D-BBD5-1242-C7dF-a7Eecd6d0891',
    });
  },
};
