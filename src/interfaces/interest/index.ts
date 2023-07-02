import { SellerInterface } from 'interfaces/seller';
import { BookInterface } from 'interfaces/book';
import { GetQueryInterface } from 'interfaces';

export interface InterestInterface {
  id?: string;
  seller_id?: string;
  book_id?: string;
  created_at?: any;
  updated_at?: any;

  seller?: SellerInterface;
  book?: BookInterface;
  _count?: {};
}

export interface InterestGetQueryInterface extends GetQueryInterface {
  id?: string;
  seller_id?: string;
  book_id?: string;
}
