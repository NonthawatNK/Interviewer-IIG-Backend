

import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';



@Entity({ name: 'profiles' })

export class Profile {


    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number;

    @Column({length : 60})
    firstname: string;

    @Column({length: 60})
    lastname: string;

    @Column()
    createAt : Date ;


    @OneToOne(() => User, (user) => user.profile,{
        cascade : true , onDelete : 'CASCADE'
    })
    user: User



}