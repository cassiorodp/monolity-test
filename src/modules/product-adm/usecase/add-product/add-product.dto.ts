export interface AddProductInputDto {
  id?: string;
  name: string;
  description: string;
  purchasePrice: number;
  stock: number;
  salesPrice?: number;
}

export interface AddProductOutputDto {
  id: string;
  name: string;
  description: string;
  purchasePrice: number;
  stock: number;
  salesPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}
