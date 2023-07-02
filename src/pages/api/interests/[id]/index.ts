import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { interestValidationSchema } from 'validationSchema/interests';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.interest
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getInterestById();
    case 'PUT':
      return updateInterestById();
    case 'DELETE':
      return deleteInterestById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getInterestById() {
    const data = await prisma.interest.findFirst(convertQueryToPrismaUtil(req.query, 'interest'));
    return res.status(200).json(data);
  }

  async function updateInterestById() {
    await interestValidationSchema.validate(req.body);
    const data = await prisma.interest.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteInterestById() {
    const data = await prisma.interest.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
