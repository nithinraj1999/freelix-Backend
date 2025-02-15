export interface jwtInterface {
  generateAccessToken(payload: any): string;   // Method to generate access token
  generateRefreshToken(payload: any): string;  // Method to generate refresh token
  verifyAccessToken(token: string): any;       // Method to verify access token
  verifyRefreshToken(token: string): any;      // Method to verify refresh token
}
