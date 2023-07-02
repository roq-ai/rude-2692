import { BookInterface } from 'interfaces/book';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface BookOwnerInterface {
  id?: string;
  name: string;
  description?: string;
  image?: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;
  book?: BookInterface[];
  user?: UserInterface;
  _count?: {
    book?: number;
  };
}

export interface BookOwnerGetQueryInterface extends GetQueryInterface {
  id?: string;
  name?: string;
  description?: string;
  image?: string;
  user_id?: string;
}
