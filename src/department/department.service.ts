import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entity';
import { User } from '../user/user.entity';
import { DepartmentInput } from '../graphql';
import { UserService } from '../user/user.service';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) { }

  async findOneById(
    id: number,
  ): Promise<Department> {
    return this.departmentRepository.findOne(id);
  }

  async getTopDepartments(): Promise<Department[]> {
    return this.departmentRepository.find({ isRoot: true });
  }

  async getChildren(
    id: number,
  ): Promise<Department[]> {
    return this.departmentRepository.find({ parent: { id } as Department });
  }

  async directChildrenCount(
    id: number,
  ): Promise<number> {
    return this.departmentRepository.count({ parent: { id } as Department });
  }

  async totalChildrenCount(
    id: number,
  ): Promise<number> {
    let totalChildren = 0;
    const childrenToCheck: number[] = [id];
    let nextDepartmentId: number;
    while (childrenToCheck.length > 0) {
      nextDepartmentId = childrenToCheck.pop();
      const children = await this.departmentRepository.find({ parent: { id: nextDepartmentId } as Department });
      childrenToCheck.push(...children.map(department => department.id));
      totalChildren += children.length;
    }

    return totalChildren;
  }

  async create(
    department: DepartmentInput,
  ): Promise<Department> {
    const departmentEntity = new Department();
    departmentEntity.name = department.name;
    departmentEntity.headRoleName = department.headRoleName;
    if (department.parentId && !department.isRoot) {
      const parentDepartment = await this.departmentRepository.findOneOrFail(department.parentId);
      departmentEntity.parent = parentDepartment;
      departmentEntity.isRoot = false;
    } else {
      departmentEntity.isRoot = true;
    }
    if (department.userId) {
      const user = await this.userService.findOneById(department.userId);
      if (user) {
        departmentEntity.user = user;
      }
    }
    const createdDepartment = await this.departmentRepository.save(departmentEntity);
    return createdDepartment;
  }

  async update(
    id: number,
    department: DepartmentInput,
  ): Promise<Department> {
    const departmentEntity = new Department();
    departmentEntity.id = id;

    departmentEntity.name = department.name;
    departmentEntity.headRoleName = department.headRoleName;
    if (department.parentId && !department.isRoot) {
      const parentDepartment = await this.departmentRepository.findOneOrFail(department.parentId);
      departmentEntity.parent = parentDepartment;
    } else {
      departmentEntity.isRoot = true;
    }
    if (department.userId) {
      const user = await this.userService.findOneById(department.userId);
      if (user) {
        departmentEntity.user = user;
      }
    }
    return await this.departmentRepository.save(departmentEntity);
  }

  async delete(
    id: number,
  ): Promise<boolean> {
    const departmentToDelete = await this.departmentRepository.findOneOrFail(id);
    await this.departmentRepository.update({ parent: departmentToDelete }, { parent: null });
    await this.departmentRepository.delete(id);
    return true;
  }

  async unlinkUser(
    user: User,
  ): Promise<boolean> {
    await this.departmentRepository.update({ user }, { user: null });
    return true;
  }
}
