export interface Plan {
  id: number;
  name: string;
  price: number;
  cvs: number;
  description: string;
  permissions: {
    id: number;
    name: string;
    description: string;
    categiory: string;
  }[];
}