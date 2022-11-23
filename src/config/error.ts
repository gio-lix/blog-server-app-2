export class ApiError extends Error {
    status
    errors

    constructor(status: number, message:string, errors:any = [] ) {
        super(message)
        this.status = status
        this.errors = errors
    }

    static UnauthorizedError() {
        return new ApiError(401, "This account does not exist", )
    }
    static BadRequest(message: string, errors:string[] = []){
        return new ApiError(400, message, errors)
    }
}

