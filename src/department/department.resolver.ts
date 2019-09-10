import { Args, Mutation, Query, Parent, Resolver, ResolveProperty } from '@nestjs/graphql';
import { ParseIntPipe } from '@nestjs/common';
import { Department, DepartmentInput } from '../graphql';
import { DepartmentService } from './department.service';
import { UserService } from '../user/user.service';

@Resolver('Department')
export class DepartmentResolver {
  constructor(
    private readonly departmentService: DepartmentService,
    private readonly userService: UserService,
  ) { }

  @Query('department')
  async findOneById(
    @Args('id', ParseIntPipe)
    id: number,
  ): Promise<Department> {
    const department = await this.departmentService.findOneById(id);
    return department;
  }

  @Query()
  getTopDepartments(): Promise<Department[]> {
    return this.departmentService.getTopDepartments();
  }

  @Query()
  getDepartments(): Promise<Department[]> {
    return this.departmentService.getDepartments();
  }

  @Query()
  getDanglingDepartments(): Promise<Department[]> {
    return this.departmentService.getDanglingDepartments();
  }

  @Query()
  getChildren(
    @Args('id', ParseIntPipe)
    id: number,
  ): Promise<Department[]> {
    return this.departmentService.getChildren(id);
  }

  @Mutation()
  createDepartment(
    @Args('department')
    department: DepartmentInput,
  ): Promise<Department> {
    return this.departmentService.create(department);
  }

  @Mutation()
  updateDepartment(
    @Args('id', ParseIntPipe)
    id: number,
    @Args('department')
    department: DepartmentInput,
  ): Promise<Department> {
    return this.departmentService.update(id, department);
  }

  @Mutation()
  deleteDepartment(
    @Args('id', ParseIntPipe)
    id: number,
  ): Promise<boolean> {
    return this.departmentService.delete(id);
  }

  @ResolveProperty()
  async children(@Parent() department) {
    return this.departmentService.getChildren(department.id);
  }

  @ResolveProperty()
  async parent(@Parent() department) {
    if (!department.parentId) {
      return null;
    }
    return this.departmentService.findOneById(department.parentId);
  }

  @ResolveProperty()
  async user(@Parent() department) {
    if (!department.userId) {
      return null;
    }
    return this.userService.findOneById(department.userId);
  }

  @ResolveProperty()
  async directChildrenCount(@Parent() department) {
    return this.departmentService.directChildrenCount(department.id);
  }

  @ResolveProperty()
  async totalChildrenCount(@Parent() department) {
    return this.departmentService.totalChildrenCount(department.id);
  }

}
