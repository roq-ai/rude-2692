import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { bookOwnerValidationSchema } from 'validationSchema/book-owners';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.book_owner
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getBookOwnerById();
    case 'PUT':
      return updateBookOwnerById();
    case 'DELETE':
      return deleteBookOwnerById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBookOwnerById() {
    const data = await prisma.book_owner.findFirst(convertQueryToPrismaUtil(req.query, 'book_owner'));
    return res.status(200).json(data);
  }

  async function updateBookOwnerById() {
    await bookOwnerValidationSchema.validate(req.body);
    const data = await prisma.book_owner.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteBookOwnerById() {
    const data = await prisma.book_owner.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
