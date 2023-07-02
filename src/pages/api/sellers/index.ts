import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { sellerValidationSchema } from 'validationSchema/sellers';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getSellers();
    case 'POST':
      return createSeller();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getSellers() {
    const data = await prisma.seller
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'seller'));
    return res.status(200).json(data);
  }

  async function createSeller() {
    await sellerValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.interest?.length > 0) {
      const create_interest = body.interest;
      body.interest = {
        create: create_interest,
      };
    } else {
      delete body.interest;
    }
    const data = await prisma.seller.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
