import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserInput } from '../graphql';
import { DepartmentService } from '../department/department.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => DepartmentService))
    private readonly departmentService: DepartmentService,
  ) {}

  async findOneById(
    id: number,
  ): Promise<User> {
    return this.userRepository.findOneOrFail(id);
  }

  async find(): Promise<User[]> {
    return this.userRepository.find();
  }

  async create(
    user: UserInput,
  ): Promise<User> {
    const userEntity = new User();
    userEntity.name = user.name;
    userEntity.surname = user.surname;
    userEntity.avatarUrl = user.avatarUrl;
    const createdUser = await this.userRepository.save(userEntity);
    return createdUser;
  }

  update(
    id: number,
    user: UserInput,
  ): Promise<User> {
    return this.userRepository.save({ ...user, id: Number(id) } as User);
  }

  async delete(
    id: number,
  ): Promise<boolean> {
    const userToDelete = await this.userRepository.findOneOrFail(id);
    await this.departmentService.unlinkUser(userToDelete);
    await this.userRepository.delete(id);
    return true;
  }

}
