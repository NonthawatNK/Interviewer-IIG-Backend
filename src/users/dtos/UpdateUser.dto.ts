import { IsNotEmpty } from "class-validator";

export class UpdateUser {

    username: string;

    @IsNotEmpty()
    firstname: string;


    lastname: string;

    @IsNotEmpty()
    password: string;

}