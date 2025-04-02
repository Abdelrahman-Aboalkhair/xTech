declare namespace Express {
  export interface Request {
    user?: {
      id: string;
      emailVerified: boolean;
      role: string;
    };
    session: {
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
