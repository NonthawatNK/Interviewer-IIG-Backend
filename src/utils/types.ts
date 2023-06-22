export type CreateUserType = {


    username: string;
    password: string;
    firstname: string;
    lastname: string;


}

export type userLoginType = {


    username:  string ;

    password : string;
}


export type UpdateUserType = {

    username : string;

    firstname: string;

    lastname: string;

    password: string;
}


export type addProfileUserType = {

    username : string ;
}