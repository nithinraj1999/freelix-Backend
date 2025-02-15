export interface IOtpService {
    generateOtp(): Promise<string>;
    validateOtp(userOtp: string, generatedOtp: string): Promise<boolean>; // Updated signature
  }