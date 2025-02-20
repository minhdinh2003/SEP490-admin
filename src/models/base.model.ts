export interface BaseEntity {
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface Product extends BaseEntity {
  ImageURL: string;
  CategoryName: string;
  Description: string;
  ProductID: number;
}
