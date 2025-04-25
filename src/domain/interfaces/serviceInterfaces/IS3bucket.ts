export interface IS3bucket {
    uploadProfilePic(
        originalname: string,
        buffer: string,
        fileType: string,
        folder: string
    ): any,

    deleteS3object (fileName:string):any
}
