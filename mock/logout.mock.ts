// @ts-ignore
import { Request, Response } from 'express';

export default {
  'POST /api/v0/auth/logout': (req: Request, res: Response) => {
    res.status(200).send({
      success: true,
      errorMessage: '合矿位来出所增须中离还革史。',
      requestId: 'eA21ED34-De4F-9DB9-d1c7-9c6aA2192CEA',
    });
  },
};
