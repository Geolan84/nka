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
            res = await connection.execute('delete from department where department_id=$1;', department_id)
            if res[-1] == "0":
                return "No department with this ID."
        except Exception as e:
            return str(e)
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
             
            users = await connection.fetch('select * from users where department_id=$1;', current_department.get('department_id'))
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
                new_user_id = await connection.fetchval('insert into users values(default, $1, $2, $3, $4, $5, $6, $7, $8) returning user_id;', 
                                                       user.get('email'), 'ТУТПАРОЛЬ', user.get('first_name'),
                                                       user.get('second_name'), user.get('patronymic'), user.get('department_id'),
                                                       user.get('qual_id'), user.get('prof_id'))
                await connection.execute('insert into users_role values($1, $2);', new_user_id, Role.HEAD.value if user.get('is_head') else Role.EMPLOYEE.value)
        except Exception as e:
            return e
        finally:
            await connection.close()

    @staticmethod
    async def get_user(user_id: int):
        try:
            connection = await asyncpg.connect(DATABASE_URL)
            user = await connection.fetchrow('select user_id, email, first_name, second_name, patronymic, department_id, qual_id, prof_id from users where user_id=$1;', user_id)
            return dict(user)
        except Exception as e:
            print(e)
            raise e
        finally:
            await connection.close()


    # @staticmethod
    # async def edit_user(user: dict):
    #     print(user)
    #     try:
    #         connection = await asyncpg.connect(DATABASE_URL)
    #         #'UPDATE users SET a=b, a=v WHERE email = 'Drama';'
    #         # async with connection.transaction():
    #         #     new_user_id = await connection.fetchval('insert into users values(default, $1, $2, $3, $4, $5, $6, $7) returning user_id;', 
    #         #                                            user.get('email'), user.get('password'), user.get('first_name'),
    #         #                                            user.get('second_name'), user.get('patronymic'),
    #         #                                            user.get('qual_id'), user.get('prof_id'))
    #         #     await connection.execute('insert into users_role values($1, $2);', new_user_id, Role.HEAD.value if user.get('is_head') else Role.EMPLOYEE.value)
    #         #     await connection.execute('insert into subordination values($1, $2);', new_user_id, user.get('head_id'))
    #     except Exception as e:
    #         return e
    #     finally:
    #         await connection.close()