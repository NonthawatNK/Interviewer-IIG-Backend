import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/typeorm/entities/Profile';
import { User } from 'src/typeorm/entities/User';
import { Password } from 'src/typeorm/entities/password';
import { CreateUserType, UpdateUserType, userLoginType } from 'src/utils/types';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Profile) private profileRepository: Repository<Profile>,
        @InjectRepository(Password) private passwordRepository: Repository<Password>


    ) { }

    fetchUsers() {
        return this.userRepository.find({
            relations: {
                passwordOlds: true,
                profile: true
            },
        })
    }

    async findUserBynameandPassword(userdetail: userLoginType) {

        const user = await this.userRepository.findOneBy({
            username: userdetail.username
        })
        console.log(user)
        if (!user) {
            throw new HttpException(
                "find not found user",
                HttpStatus.BAD_REQUEST
            )
        } else {
            const isMatch = await bcrypt.compare(userdetail.password, user.password);
            if (isMatch) {
                return {
                    message: "Login success ",
                    userName: `${user.username}`,
                    path: `${user.profileimage}`
                }
            }
            else {
                throw new HttpException("password is wrong", HttpStatus.BAD_REQUEST)
            }
        }
    }



    async createUsers(userDetails: CreateUserType, path: string) {

        const user = await this.userRepository.findOneBy({ username: userDetails.username })
        if (!user) {
            const saltOrRounds = 17;
            const passworduser = userDetails.password;
            const hash = await bcrypt.hash(passworduser, saltOrRounds)

            const profile = this.profileRepository.create({
                firstname: userDetails.firstname,
                lastname: userDetails.lastname,
                createAt: new Date()
            })
            await this.profileRepository.save(profile)

            const newUser = this.userRepository.create({
                ...userDetails,
                password: hash,
                createdAt: new Date(),
                profileimage: path,
                profile: profile,
                passwordOlds: [],

            })

            const passwordfirst = this.passwordRepository.create({
                passwordOld: hash
            })
            await this.passwordRepository.save(passwordfirst)


            newUser.passwordOlds = [passwordfirst]
            await this.userRepository.save(newUser)

            throw new HttpException(`The user has been created ${userDetails.username}`, HttpStatus.ACCEPTED)

        } else {
            throw new HttpException("Username already exists", HttpStatus.BAD_REQUEST)
        }

    }

    async updateUserByUsername(updateUserDetails: UpdateUserType, path: string) {

        const user = await this.userRepository.findOne(
            {
                relations: {
                    passwordOlds: true,
                    profile: true
                },
                where: {
                    username: updateUserDetails.username,
                },
            }

        )
        const profile = await this.profileRepository.findOneBy({ id: user.profile.id })
            console.log(user)
            console.log(profile)
        if (!user) {
            throw new HttpException(
                'User not found. Cannot update user',
                HttpStatus.BAD_REQUEST,
            )
        } else {
            const passwordlist = user.passwordOlds
            const passwordOldlist = []
            for (let i = 0; i < passwordlist.length; ++i) {
                passwordOldlist.push(passwordlist[i].passwordOld)
                const isMatch = await bcrypt.compare(updateUserDetails.password, passwordlist[i].passwordOld);
                if (isMatch) {
                    throw new HttpException(
                        'The password is the same as the original one',
                        HttpStatus.BAD_REQUEST
                    )
                }
            }


            if (passwordlist.length >= 5) {
                const saltOrRounds = 17;
                const passworduser = updateUserDetails.password;
                const hash = await bcrypt.hash(passworduser, saltOrRounds)
                passwordOldlist.push(hash)
                const newpassword = this.passwordRepository.create({
                    passwordOld: hash,
                    user: user
                })
                await this.passwordRepository.save(newpassword)
                const passwordOlds = user.passwordOlds

                const newpasswordadd = new Password()
                newpasswordadd.id = newpassword.id
                newpasswordadd.passwordOld = newpassword.passwordOld
                newpasswordadd.createdAt = newpassword.createdAt

                passwordOlds.push(newpasswordadd)
                this.passwordRepository.delete({ passwordOld: passwordOlds[0].passwordOld })
                const newpasswordlist = passwordOlds.slice(1)


                user.password = hash
                user.passwordOlds = newpasswordlist
                user.profileimage = path
                this.userRepository.save(user)

                if (updateUserDetails.lastname === null) {
                    profile.firstname = updateUserDetails.firstname
                } else {
                    profile.firstname = updateUserDetails.firstname
                    profile.lastname = updateUserDetails.lastname
                }
                this.profileRepository.save(profile)

                return { message: "upadate done " }

            } else {
                const saltOrRounds = 17;
                const passworduser = updateUserDetails.password;
                const hash = await bcrypt.hash(passworduser, saltOrRounds)
                passwordOldlist.push(hash)


                const newpassword = this.passwordRepository.create({
                    passwordOld: hash,
                    user: user,
                })
                await this.passwordRepository.save(newpassword)

                const passwordOlds = user.passwordOlds

                const newpasswordadd = new Password()
                newpasswordadd.id = newpassword.id
                newpasswordadd.passwordOld = newpassword.passwordOld
                newpasswordadd.createdAt = newpassword.createdAt

                passwordOlds.push(newpasswordadd)

                user.password = hash
                user.passwordOlds = passwordOlds
                user.profileimage = path
                this.userRepository.save(user)


                if (updateUserDetails.lastname === null) {
                    profile.firstname = updateUserDetails.firstname
                } else {
                    profile.firstname = updateUserDetails.firstname
                    profile.lastname = updateUserDetails.lastname
                }
                this.profileRepository.save(profile)

            }

            return { message: "upadate done " }
        }


    }


}