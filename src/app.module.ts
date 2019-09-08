import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { DepartmentModule } from './department/department.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { Connection } from 'typeorm';
import * as path from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug: false,
      playground: true,
      typePaths: ['./**/*.graphql', './**/*/*.graphql'],
      definitions: {
        path: path.join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
    }),
    TypeOrmModule.forRoot(),
    DepartmentModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  // constructor(private readonly connection: Connection) {}
}
