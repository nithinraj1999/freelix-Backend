export interface IOTPUseCase{
    verification(otp: string, email: string):Promise<any>
}