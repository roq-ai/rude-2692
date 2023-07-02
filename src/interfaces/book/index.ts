import { InterestInterface } from 'interfaces/interest';
import { BookOwnerInterface } from 'interfaces/book-owner';
import { GetQueryInterface } from 'interfaces';

export interface BookInterface {
  id?: string;
  title: string;
  description?: string;
  image?: string;
  book_owner_id?: string;
  created_at?: any;
  updated_at?: any;
  interest?: InterestInterface[];
  book_owner?: BookOwnerInterface;
  _count?: {
    interest?: number;
  };
}

export interface BookGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  description?: string;
  image?: string;
  book_owner_id?: string;
}
