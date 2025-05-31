export interface RegisterMutation {
    email: string;
    displayName: string;
    password: string;
}

export interface User {
    _id: string;
    email: string;
    displayName: string;
    token: string;
}

export interface ValidationError {
    errors: {
        [key: string]: {
            name: string;
            message: string;
        }
    },
    message: string;
    name: string;
    _message: string;
}

export interface LoginMutation {
    email: string;
    password: string;
}

export interface GlobalError {
    error: string;
}