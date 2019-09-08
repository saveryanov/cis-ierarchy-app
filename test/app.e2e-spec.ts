import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { create } from 'istanbul-reports';

describe('AppModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  async function createUser({
    name = 'Terry',
    surname = 'Crews',
    avatarUrl = 'https://picsum.photos/200/300',
  } = {}) {
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        variables: {},
        query: `
          mutation {
            createUser(user: {
              name: "${name}",
              surname: "${surname}",
              avatarUrl: "${avatarUrl}"
            }) {id, name, surname, avatarUrl}
          }
        `,
      })
      .expect(200);

    expect(body).not.toHaveProperty('errors');
    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('createUser');
    return body.data.createUser;
  }

  async function getUser(id: number) {
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        variables: {},
        query: `
          query {
            user(id: ${id}) {id, name, surname, avatarUrl}
          }
        `,
      })
      .expect(200);

    expect(body).not.toHaveProperty('errors');
    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('user');
    return body.data.user;
  }

  async function updateUser(id: number, {
    name = 'Terry',
    surname = 'Crews',
    avatarUrl = 'https://picsum.photos/200/300',
  } = {}) {
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        variables: {},
        query: `
        mutation {
          updateUser(id: ${id}, user: {
            name: "${name}",
            surname: "${surname}",
            avatarUrl: "${avatarUrl}"
          }) {id, name, surname, avatarUrl}
        }
        `,
      })
      .expect(200);

    expect(body).not.toHaveProperty('errors');
    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('updateUser');
    return body.data.updateUser;
  }

  async function removeUser(id: number) {
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        variables: {},
        query: `
        mutation {
          deleteUser(id: ${id})
        }`,
      })
      .expect(200);

    expect(body).not.toHaveProperty('errors');
    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('deleteUser');
    return body.data.deleteUser;
  }

  async function createDepartment({
    isRoot = true,
    name = 'IT',
    headRoleName = 'CTO',
    userId = null,
    parentId = null,
  } = {}) {
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        variables: {},
        query: `
          mutation {
            createDepartment(department: {
              isRoot: ${isRoot},
              name: "${name}",
              headRoleName: "${headRoleName}",
              ${ userId !== null ? `userId: ${userId},` : ''}
              ${ parentId !== null ? `parentId: ${parentId},` : ''}
            }) {id, isRoot, name, headRoleName, user { id }, parent { id }}
          }
        `,
      })
      .expect(200);

    expect(body).not.toHaveProperty('errors');
    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('createDepartment');
    return body.data.createDepartment;
  }

  async function getDepartment(id: number) {
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        variables: {},
        query: `
          query {
            department(id: ${id}) {
              id,
              isRoot,
              name,
              headRoleName,
              user { id, name, surname, avatarUrl },
              directChildrenCount,
              totalChildrenCount,
              children {
                id,
                isRoot,
                name,
                headRoleName,
                user { id, name, surname, avatarUrl },
                directChildrenCount,
                totalChildrenCount,
                children {
                  id,
                  isRoot,
                  name,
                  headRoleName,
                  user { id, name, surname, avatarUrl },
                  directChildrenCount,
                  totalChildrenCount,
                  children {
                    id,
                    isRoot,
                    name,
                    headRoleName,
                    user { id, name, surname, avatarUrl },
                    directChildrenCount,
                    totalChildrenCount,
                  }
                }
              }
            }
          }
        `,
      })
      .expect(200);

    expect(body).not.toHaveProperty('errors');
    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('department');
    return body.data.department;
  }

  async function updateDepartment(id: number, {
    isRoot = true,
    name = 'IT',
    headRoleName = 'CTO',
    userId = null,
    parentId = null,
  } = {}) {
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        variables: {},
        query: `
        mutation {
          updateDepartment(id: ${id}, department: {
            isRoot: ${isRoot},
            name: "${name}",
            headRoleName: "${headRoleName}",
            ${ userId !== null ? `userId: ${userId},` : ''}
            ${ parentId !== null ? `parentId: ${parentId},` : ''}
          }) {id, isRoot, name, headRoleName, user { id }, parent { id }}
        }
        `,
      })
      .expect(200);

    expect(body).not.toHaveProperty('errors');
    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('updateDepartment');
    return body.data.updateDepartment;
  }

  async function removeDepartment(id: number) {
    const { body } = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        variables: {},
        query: `
        mutation {
          deleteDepartment(id: ${id})
        }`,
      })
      .expect(200);

    expect(body).toHaveProperty('data');
    expect(body.data).toHaveProperty('deleteDepartment');
    return body.data.deleteDepartment;
  }

  describe('UserModule', () => {
    it('Creates user', async () => {
      const newUser = { name: 'Terry', surname: 'Crews', avatarUrl: 'https://picsum.photos/200/300'};
      const createdUser = await createUser(newUser);
      expect(createdUser).toStrictEqual({ ...newUser, id: createdUser.id });
    });
    it('Gets user', async () => {
      const newUser = { name: 'Terry', surname: 'Crews', avatarUrl: 'https://picsum.photos/200/300'};
      const createdUser = await createUser(newUser);
      const gotUser = await getUser(createdUser.id);
      expect(gotUser).toStrictEqual({ ...newUser, id: createdUser.id });
    });
    it('Updates user', async () => {
      const newUser = { name: 'Terry', surname: 'Crews', avatarUrl: 'https://picsum.photos/200/300'};
      const newUserChanges = { name: 'Bruce', surname: 'Lee', avatarUrl: 'https://picsum.photos/200/300'};
      const createdUser = await createUser(newUser);
      const updatedUser = await updateUser(createdUser.id, newUserChanges);
      expect(updatedUser).toStrictEqual({ ...newUserChanges, id: createdUser.id });
    });
    it('Removes user', async () => {
      const newUser = { name: 'Terry', surname: 'Crews', avatarUrl: 'https://picsum.photos/200/300'};
      const createdUser = await createUser(newUser);
      const removeUserResult: boolean = await removeUser(createdUser.id);
      expect(removeUserResult).toBe(true);
    });
  });

  describe('DepartmentsModule', () => {
    it('Creates single department', async () => {
      const newUser = { name: 'Terry', surname: 'Crews', avatarUrl: 'https://picsum.photos/200/300'};
      const createdUser = await createUser(newUser);
      const newDepartment = { isRoot: true, name: 'IT', headRoleName: 'CTO', userId: createdUser.id };
      const createdDepartment = await createDepartment(newDepartment);

      expect(createdDepartment).toStrictEqual({
        id: createdDepartment.id,
        isRoot: newDepartment.isRoot,
        name: newDepartment.name,
        headRoleName: newDepartment.headRoleName,
        user: { id: createdUser.id },
        parent: null,
      });
    });
    it('Gets single department', async () => {
      const newUser = { name: 'Terry', surname: 'Crews', avatarUrl: 'https://picsum.photos/200/300'};
      const createdUser = await createUser(newUser);
      const newDepartment = { isRoot: true, name: 'IT', headRoleName: 'CTO', userId: createdUser.id };
      const createdDepartment = await createDepartment(newDepartment);
      const gotDepartment = await getDepartment(createdDepartment.id);

      expect(gotDepartment).toStrictEqual({
        id: createdDepartment.id,
        isRoot: newDepartment.isRoot,
        name: newDepartment.name,
        headRoleName: newDepartment.headRoleName,
        user: createdUser,
        directChildrenCount: 0,
        totalChildrenCount: 0,
        children: [],
      });
    });
    it('Updates single department', async () => {
      const newUser1 = { name: 'Terry', surname: 'Crews', avatarUrl: 'https://picsum.photos/200/300'};
      const newUser2 = { name: 'Bruce', surname: 'Lee', avatarUrl: 'https://picsum.photos/200/300'};
      const createdUser1 = await createUser(newUser1);
      const createdUser2 = await createUser(newUser2);
      const newDepartment = { isRoot: true, name: 'IT', headRoleName: 'CTO', userId: createdUser1.id };
      const newDepartmentChanges = { isRoot: true, name: 'Marketing', headRoleName: 'Head', userId: createdUser2.id };
      const createdDepartment = await createDepartment(newDepartment);
      const updatedDepartment = await updateDepartment(createdDepartment.id, newDepartmentChanges);
      expect(updatedDepartment).toStrictEqual({
        id: createdDepartment.id,
        isRoot: newDepartmentChanges.isRoot,
        name: newDepartmentChanges.name,
        headRoleName: newDepartmentChanges.headRoleName,
        user: { id: createdUser2.id },
        parent: null,
      });
    });
    it('Removes single department', async () => {
      const newDepartment = { isRoot: true, name: 'IT', headRoleName: 'CTO' };
      const createdDepartment = await createDepartment(newDepartment);
      const removeDepartmentResult: boolean = await removeDepartment(createdDepartment.id);
      expect(removeDepartmentResult).toBe(true);
    });
  });

  it('Creates company ierarchy', async () => {
    const users = [
      { id: null, name: 'Terry', surname: 'Crews', avatarUrl: 'https://picsum.photos/200/300' },
      { id: null, name: 'Bruce', surname: 'Lee', avatarUrl: 'https://picsum.photos/200/300' },
      { id: null, name: 'Arnold', surname: 'Swareznegger', avatarUrl: 'https://picsum.photos/200/300' },
    ];
    for (const user of users) {
      user.id = (await createUser(user)).id;
    }

    const departments = [{
      id: null,
      expected: null,
      isRoot: true,
      name: 'Horns and Hoofs',
      headRoleName: 'CEO',
      userIndex: 1,
      parentIndex: null,
      dcc: 3,
      tcc: 7,
    }, {
      id: null,
      expected: null,
      isRoot: false,
      name: 'IT',
      headRoleName: 'CTO',
      userIndex: 1,
      parentIndex: 0,
      dcc: 4,
      tcc: 4,
    }, {
      id: null,
      expected: null,
      isRoot: false,
      name: 'Marketing',
      headRoleName: 'Chief',
      userIndex: 0,
      parentIndex: 0,
      dcc: 0,
      tcc: 0,
    }, {
      id: null,
      expected: null,
      isRoot: false,
      name: 'Administration',
      headRoleName: 'Head',
      userIndex: 2,
      parentIndex: 0,
      dcc: 0,
      tcc: 0,
    }, {
      id: null,
      expected: null,
      isRoot: false,
      name: 'Backend',
      headRoleName: 'Lead',
      userIndex: 2,
      parentIndex: 1,
      dcc: 0,
      tcc: 0,
    }, {
      id: null,
      expected: null,
      isRoot: false,
      name: 'Frontend',
      headRoleName: 'Lead',
      userIndex: 0,
      parentIndex: 1,
      dcc: 0,
      tcc: 0,
    }, {
      id: null,
      expected: null,
      isRoot: false,
      name: 'Design',
      headRoleName: 'Lead',
      userIndex: null,
      parentIndex: 1,
      dcc: 0,
      tcc: 0,
    }, {
      id: null,
      expected: null,
      isRoot: false,
      name: 'Testing',
      headRoleName: 'Lead',
      userIndex: null,
      parentIndex: 1,
      dcc: 0,
      tcc: 0,
    }];

    for (const department of departments) {
      const createdDepartment = await createDepartment({
        isRoot: department.isRoot,
        name: department.name,
        headRoleName: department.headRoleName,
        userId: department.userIndex !== null ? users[department.userIndex].id : null,
        parentId: department.parentIndex !== null ? departments[department.parentIndex].id : null,
      });
      department.id = createdDepartment.id;
      department.expected = {
        id: department.id,
        isRoot: department.isRoot,
        name: department.name,
        headRoleName: department.headRoleName,
        user: department.userIndex === null ? null : {
          id: users[department.userIndex].id,
          name: users[department.userIndex].name,
          surname: users[department.userIndex].surname,
          avatarUrl: users[department.userIndex].avatarUrl,
        },
        directChildrenCount: department.dcc,
        totalChildrenCount: department.tcc,
        children: [],
      };
    }

    let childIndex = 0;
    for (const department of departments) {
      department.expected.children.push(...departments
        .filter(item => item.parentIndex !== null && item.parentIndex === childIndex)
        .map(item => item.expected));
      childIndex++;
    }

    for (const department of departments) {
      const gotDepartment = await getDepartment(department.id);
      expect(gotDepartment).toStrictEqual(department.expected);
    }
  });

});
