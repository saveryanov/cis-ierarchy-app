
/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
export class DepartmentInput {
    id?: number;
    isRoot?: boolean;
    name?: string;
    headRoleName?: string;
    parentId?: number;
    userId?: number;
}

export class UserInput {
    id?: number;
    name: string;
    surname: string;
    avatarUrl?: string;
}

export class Department {
    id?: number;
    isRoot?: boolean;
    name?: string;
    headRoleName?: string;
    user?: User;
    children?: Department[];
    parent?: Department;
    parentId?: number;
    directChildrenCount?: number;
    totalChildrenCount?: number;
}

export abstract class IMutation {
    abstract createDepartment(department?: DepartmentInput): Department | Promise<Department>;

    abstract updateDepartment(id: string, department?: DepartmentInput): Department | Promise<Department>;

    abstract deleteDepartment(id: string): boolean | Promise<boolean>;

    abstract createUser(user?: UserInput): User | Promise<User>;

    abstract updateUser(id: string, user?: UserInput): User | Promise<User>;

    abstract deleteUser(id: string): boolean | Promise<boolean>;
}

export abstract class IQuery {
    abstract getDanglingDepartments(): Department[] | Promise<Department[]>;

    abstract getTopDepartments(): Department[] | Promise<Department[]>;

    abstract getDepartments(): Department[] | Promise<Department[]>;

    abstract getChildren(id: string): Department[] | Promise<Department[]>;

    abstract department(id: string): Department | Promise<Department>;

    abstract getUsers(): User[] | Promise<User[]>;

    abstract user(id: string): User | Promise<User>;
}

export class User {
    id: number;
    name: string;
    surname: string;
    avatarUrl?: string;
}
