export interface order {
  phone: number;
  name: string;
  gender: string;
  dob: Date;
  orderDate: Date;
  orderType: string;
  quantity: number;
  cryptoPair: string;
  pairPrice: number;
  qrCode?: string;
}
