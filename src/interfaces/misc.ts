export type FqlQuery = Record<string, unknown> | undefined;

export type RelatedUser = {
  id: string,
  fullName?: string,
};

export type RelatedUsersResponse = {
  totalRecords: number,
  relatedUsers: RelatedUser[],
};
