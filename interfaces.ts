export interface USER_LOGIN_DATA {
    uid: string;
    name: string;
}

export interface USER_DATA {
    uid?         : string;
    classid?     : string;
    id?          : string;
    email?       : string;
    password?    : string;
    name?        : string;
    mobile?      : string;
    gender?      : string;
    birthday?    : string;
}

export interface USER_REGISTRATION_FORM extends USER_DATA {
}

