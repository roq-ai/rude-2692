const mapping: Record<string, string> = {
  books: 'book',
  'book-owners': 'book_owner',
  interests: 'interest',
  sellers: 'seller',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
