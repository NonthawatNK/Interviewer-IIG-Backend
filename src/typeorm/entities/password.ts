
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn }  from 'typeorm';
import { User } from './User';





@Entity({name : 'password'})
export class Password {
    @PrimaryGeneratedColumn({type : 'bigint'})
    id : number ; 

    @Column()
    passwordOld: string ;

    
    @CreateDateColumn()
    createdAt: Date;


    @ManyToOne(()=> User , (user) =>user.passwordOlds,{
        cascade : true , onDelete : 'CASCADE'
    })
    user :User


}