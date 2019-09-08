import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Department {
   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   isRoot: boolean;

   @Column({length: 100})
   name: string;

   @Column({length: 100})
   headRoleName: string;

   @OneToMany(type => Department, department => department.parent, { nullable: true })
   children: Department[];

   @Column({ nullable: true })
   parentId: number;

   @ManyToOne(type => Department, department => department.children, { nullable: true })
   @JoinColumn({ name: 'parentId' })
   parent!: Department;

   @Column({ nullable: true })
   userId: number;

   @ManyToOne(type => User, user => user.departments, { nullable: true })
   @JoinColumn({ name: 'userId' })
   user!: User;
}
