import { IsNotEmpty } from "class-validator";

export class loginUser {

    @IsNotEmpty()
    username:  string ;
    @IsNotEmpty()
    password : string;
}