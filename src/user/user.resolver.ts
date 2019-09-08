import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { ParseIntPipe } from '@nestjs/common';
import { User, UserInput } from '../graphql';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Query('user')
  findOneById(
    @Args('id', ParseIntPipe)
    id: number,
  ): Promise<User> {
    return this.userService.findOneById(id);
  }

  @Query()
  getUsers(): Promise<User[]> {
    return this.userService.find();
  }

  @Mutation()
  createUser(
    @Args('user')
    user: UserInput,
  ): Promise<User> {
    return this.userService.create(user);
  }

  @Mutation()
  updateUser(
    @Args('id', ParseIntPipe)
    id: number,
    @Args('user')
    user: UserInput,
  ): Promise<User> {
    return this.userService.update(id, user);
  }

  @Mutation()
  async deleteUser(
    @Args('id', ParseIntPipe)
    id: number,
  ): Promise<boolean> {
    return this.userService.delete(id);
  }

}
