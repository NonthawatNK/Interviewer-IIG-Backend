import {
    Controller,
    Get,
    Post,
    Body,
    UseInterceptors,
    UploadedFile,
    HttpException,
    HttpStatus,
    ParseFilePipe,
    FileTypeValidator,
    MaxFileSizeValidator
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Observable, of } from 'rxjs';
import { UsersService } from 'src/users/services/users/users.service';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { loginUser } from 'src/users/dtos/LoginUser.dto';

export const storage = {
    storage: diskStorage({
        destination: "./uploads/profileimages",
        filename: (reg, file, cb) => {
            const filename: string = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
            const extension: string = path.parse(file.originalname).ext;
            cb(null, `${filename}${extension}`)
        }
    }),

}

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService) {

    }

    @Get()
    getUsers() {
        console.log(`GET /All user`);
        return this.userService.fetchUsers();
    }




    @Post("login")
    @UseInterceptors(FileInterceptor('body'))
    getUser(
        @Body() body: loginUser

    ) {
        console.log(`POST /${body}`);
        return this.userService.findUserBynameandPassword(body)
    }



    @Post('editeprofile')
    @UseInterceptors(FileInterceptor('file', storage))
   async updateUserByUsername(
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({ fileType: /(jpg|jpeg|png|bmp)$/ }),
                    new MaxFileSizeValidator({ maxSize: 5120 * 1000 })
                ],
            })
        ) file: Express.Multer.File,
        @Body('username') username: string,
        @Body('password') password: string,
        @Body('firstname') firstname: string,
        @Body('lastname') lastname: string,
    ) {
        console.log(`POST /${File}`);
        console.log(`POST /${storage}`);

        const userDetails = {
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname,
        }

        //* String contains two letters */
        const ckpassword = String(userDetails.password)
        const lower = []
        const numberascii = []
        lower.push(ckpassword.toLowerCase())

        for (let i = 0; i < lower[0].length; i++) {
            const fir = String(lower[0][i]).charCodeAt(0)
            numberascii.push(fir)
        }
        for (let i = 0; i < numberascii.length; i++) {
            if (numberascii[i] + 1 === numberascii[i + 1]) {
                throw new HttpException("Password Not 123456 , ABCDE , 364555", HttpStatus.BAD_REQUEST)
            }
        }

       await this.userService.updateUserByUsername(userDetails, file.path)


    }


    @Post('create')
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(

        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({ fileType: /(jpg|jpeg|png|bmp)$/ }),
                    new MaxFileSizeValidator({ maxSize: 5120 * 1000 })
                ],
            })
        ) file: Express.Multer.File,
        @Body('username') username: string,
        @Body('password') password: string,
        @Body('firstname') firstname: string,
        @Body('lastname') lastname: string,

    ): Observable<Object> {

    
        const userDetails = {
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname,
        }

        console.log(`POST /${file}`);
        console.log(`POST /${userDetails}`);

        //* String contains two letters */
        const ckpassword = password
        const lower = []
        const numberascii = []
        lower.push(ckpassword.toLowerCase())
        for (let i = 0; i < lower.length; i++) {
            const fir = String(lower[0][i]).charCodeAt(0)
            numberascii.push(fir)
        }
        for (let i = 0; i < numberascii.length; i++) {
            if (numberascii[i] + 1 === numberascii[i + 1]) {
                throw new HttpException("Password Not 123456 , ABCDE , 364555", HttpStatus.BAD_REQUEST)
            }
        }


        console.log(file)
        return of(this.userService.createUsers(userDetails, file.path))
    }


    // @Get("test")
    // async test() {
    //     const password = ["ABCDEF", "QWERAB"]
    //     const lower = []
    //     const number = []
    //     console.log(lower.push(password[0].toLowerCase()), lower.push(password[1].toLowerCase()))


    //     console.log(lower)


    //     for (let i = 0; i < lower[1].length; ++i) {

    //         const fir = String(lower[1][i]).charCodeAt(0)
    //         number.push(fir)

    //     }
    //     console.log(number)

    //     for (let i = 0; i < number.length; i++) {
    //         if (number[i] + 1 === number[i + 1]) {
    //             console.log("In")
    //         }
    //     }
    //     // this.userService.test()
    // }




}
