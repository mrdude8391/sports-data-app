export type LoginPayload = {
    email: string;
    password: string;
}

export type RegisterPayload = {
    username: string,
    email: string,
    password: string
}

export type AuthResponse = {
    _id: string,
    username: string,
    email: string,
    token: string
}