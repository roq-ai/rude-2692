import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { bookOwnerValidationSchema } from 'validationSchema/book-owners';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getBookOwners();
    case 'POST':
      return createBookOwner();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBookOwners() {
    const data = await prisma.book_owner
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'book_owner'));
    return res.status(200).json(data);
  }

  async function createBookOwner() {
    await bookOwnerValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.book?.length > 0) {
      const create_book = body.book;
      body.book = {
        create: create_book,
      };
    } else {
      delete body.book;
    }
    const data = await prisma.book_owner.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
