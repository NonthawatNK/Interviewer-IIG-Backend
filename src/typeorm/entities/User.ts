

import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { Profile } from "./Profile";
import { Password } from "./password";




@Unique(["username"])
@Entity({ name : 'users'})
export class User {
    @PrimaryGeneratedColumn({type : 'bigint'})
    id : number ; 

    @Column({
        length : 12,
    })
    username: string;

    @Column()
    password: string;

    @Column()
    createdAt?: Date ; 

    @Column()
    profileimage?: string ; 

    
    @OneToOne(() => Profile, (profile) => profile.user)
    @JoinColumn()
    profile: Profile


    @OneToMany(() => Password ,(passwordOld)=> passwordOld.user)
    passwordOlds : Password[]
}
