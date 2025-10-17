export type UserPayload = {
    username: string,
    email: string,
    password: string
}

export type UserResponse = {
    _id: string,
    username: string,
    email: string,
    token: string
}

