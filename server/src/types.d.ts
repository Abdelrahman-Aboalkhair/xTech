declare namespace Express {
  export interface Request {
    user?: {
      id: string;
    };
    session: {
      destroy(arg0: (err: any) => void): unknown;
      cart?: {
        id: string;
        items: {
          product: any;
          quantity: number;
        }[];
      };
    };
  }
  export interface Response {
    user: any;
  }
}
