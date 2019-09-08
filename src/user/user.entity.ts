import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Department } from '../department/department.entity';

@Entity()
export class User {
   @PrimaryGeneratedColumn()
   id: number;

   @Column({length: 100})
   name: string;

   @Column({length: 100})
   surname: string;

   @Column({length: 100, nullable: true})
   avatarUrl: string;

   @OneToMany(type => Department, department => department.user, { nullable: true })
   departments: Department[];
}
