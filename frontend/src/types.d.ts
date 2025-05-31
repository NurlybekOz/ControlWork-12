export interface RegisterMutation {
    email: string;
    displayName: string;
    password: string;
}

export interface User {
    _id: string;
    email: string;
    role: string;
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

export interface GroupMutation {
    title: string;
    image: string | null;
    description: string;
}

export interface IGroup {
    _id: string;
    user: User;
    title: string;
    image: string | null;
    description: string;
    isPublished: boolean;
    people:
        {
            user: User;
            _id: string
        }[]
}
