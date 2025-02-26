
export type UserSignup = {
    _id?:string;
    firstName:string,
    lastName: string;
    email: string;
    password: string;
    phone:string;
    profile_image:string
}

export type UserProfileType = {
    _id?:string
    firstname:string,
    lastname: string;
    email: string;
    password: string;
    phone_number:string;
    profile_image:string
}