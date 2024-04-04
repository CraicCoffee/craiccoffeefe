// @ts-ignore
import { Request, Response } from 'express';

export default {
  'GET /debug/log': (req: Request, res: Response) => {
    res.status(200).send({});
  },
};
