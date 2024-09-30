export interface jwtInterface {
    generateToken(payload: any): string;
    verifyToken(token: string): any;
  }
