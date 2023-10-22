import asyncpg
from config import DATABASE_URL, Role

class StructRepository:

    @staticmethod
    async def add_department(name: str, head_id: int | None):
        try:
            connection = await asyncpg.connect(DATABASE_URL)
            await connection.execute('insert into department values(default, $1, $2);', name, head_id)
        except Exception as e:
            return e
        finally:
            await connection.close()

    @staticmethod
    async def edit_department(department_id: int, new_name: str):
        try:
            connection = await asyncpg.connect(DATABASE_URL)
            res = await connection.execute('update department set department_name=$1 where department_id=$2;', new_name, department_id)
            if res[-1] == "0":
                return "No department with this ID."
        except Exception as e:
            return str(e)
        finally:
            await connection.close()

    @staticmethod
    async def delete_department(department_id: int):
        try:
            connection = await asyncpg.connect(DATABASE_URL)
            sub_dep_count = await connection.fetchval("""
                                                        select count(*) from department
                                                        where head_department_id = $1;""", 
                                                        department_id)
            if sub_dep_count != 0:
                return "This department has children department(s)!"
            sub_users_count = await connection.fetchval("""
                                                        select count(*) from users
                                                        where department_id = $1;
                                                        """, department_id)
            if sub_users_count != 0:
                return "This department has employees!"
            res = await connection.execute('delete from department where department_id=$1;', department_id)
            if res[-1] == "0":
                return "No department with this ID."
        except Exception as e:
            return str(e)
        finally:
            await connection.close()

    @staticmethod
    async def get_all_departments():
        try:
            connection = await asyncpg.connect(DATABASE_URL)
            departs = await connection.fetch("select * from department;")
            if departs is None:
                return {"departments": []}
            departments_map = dict()
            for dep in departs:
                if dep.get("head_department_id") in departments_map:
                    departments_map[dep.get("head_department_id")].append(dict(dep))
                else:
                    departments_map[dep.get("head_department_id")] = [dict(dep)]
            if None not in departments_map:
                raise Exception("Departments doesn't contain root!")
            # ToDo: Требуется профилирование!
            def __recursive_build(key: int):
                if key in departments_map:
                    layer = [y.copy() for y in departments_map[key]]
                    for y in layer:
                        y["departments"] = __recursive_build(y["department_id"])
                    return layer
            # Alternative version.  
            # def __recursive_build(key: int):
            #     if key in departments_map:
            #         layer = departments_map[key]
            #         for x in layer:
            #             x["departments"] = __recursive_build(x["department_id"])
            #         return layer
            answer = __recursive_build(None)
            return answer[0]
        except Exception as e:
            raise e
        finally:
            await connection.close()

    @staticmethod
    async def get_department(department_id: int | None = None):
        try:
            answer = {}
            connection = await asyncpg.connect(DATABASE_URL)
            if department_id is None:
                current_department = await connection.fetchrow('select * from department where head_department_id is null;')
            else:
                current_department = await connection.fetchrow('select * from department where department_id = $1;', department_id)
            if current_department is None:
                raise Exception("No department here!")
             
            users = await connection.fetch("""
                    select user_id, email, first_name, second_name, patronymic, department_id, department_name, role_id
                    from users join users_role using(user_id) join department using(department_id)
                    where department_id=$1;""", current_department.get('department_id'))
            
            departments = await connection.fetch('select * from department where head_department_id=$1;', current_department.get('department_id'))

            answer["department_name"] = current_department.get('department_name')
            answer["department_id"] = current_department.get('department_id')
            answer["departments"] = [dict(x) for x in departments]
            answer["users"] = [dict(x) for x in users]
            return answer
        except Exception as e:
            print(e)
            raise e
        finally:
            await connection.close()

    @staticmethod
    async def add_new_user(user: dict):
        try:
            connection = await asyncpg.connect(DATABASE_URL)
            async with connection.transaction():
                new_user_id = await connection.fetchval('insert into users values(default, $1, $2, $3, $4, $5, $6) returning user_id;', 
                                                       user.get('email'), 'ТУТПАРОЛЬ', user.get('first_name'),
                                                       user.get('second_name'), user.get('patronymic'), user.get('department_id'))
                await connection.execute('insert into users_role values($1, $2);', new_user_id, Role.HEAD.value if user.get('is_head') else Role.EMPLOYEE.value)
        except Exception as e:
            return e
        finally:
            await connection.close()

    @staticmethod
    async def get_user(user_id: int):
        try:
            connection = await asyncpg.connect(DATABASE_URL)
            user = await connection.fetchrow("""
            select user_id, email, first_name, second_name, patronymic, department_id, department_name, role_id
            from users join users_role using(user_id) join department using(department_id)
            where user_id=$1;
            """, user_id)
            return dict(user)
        except Exception as e:
            print(e)
            raise e
        finally:
            await connection.close()


    # @staticmethod
    # async def edit_user(user: dict):
    #     #print(user)
    #     print(" and ".join([f"{key} = {value}" for key, value in user.items() if value is not None]))
    #     try:
    #         connection = await asyncpg.connect(DATABASE_URL)

    #         #'UPDATE users SET a=b, a=v WHERE email = 'Drama';'
    #         # async with connection.transaction():
    #         #     new_user_id = await connection.fetchval('insert into users values(default, $1, $2, $3, $4, $5, $6, $7) returning user_id;', 
    #         #                                            user.get('email'), user.get('password'), user.get('first_name'),
    #         #                                            user.get('second_name'), user.get('patronymic'),
    #         #                                            user.get('qual_id'), user.get('prof_id'))
    #         #     await connection.execute('insert into users_role values($1, $2);', new_user_id, Role.HEAD.value if user.get('is_head') else Role.EMPLOYEE.value)
            
    #     except Exception as e:
    #         return e
    #     finally:
    #         await connection.close()