// @ts-ignore
import { Request, Response } from 'express';

export default {
  'GET /api/v0/overview': (req: Request, res: Response) => {
    res.status(200).send({});
  },
};
