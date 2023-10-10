from config import DATABASE_URL, Role
import asyncpg


class AuthRepository:

    @staticmethod
    async def admin_register(user: dict):
        try:
            connection = await asyncpg.connect(DATABASE_URL)
            async with connection.transaction():
                new_user_id = await connection.fetchval('insert into users values(default, $1, $2, $3, $4, $5, $6, $7) returning user_id;', 
                                                       user.get('email'), user.get('password'), user.get('first_name'),
                                                       user.get('second_name'), user.get('patronymic'),
                                                       user.get('qual_id'), user.get('prof_id'))
                await connection.execute('insert into users_role values($1, $2);', new_user_id, Role.ADMIN.value)
                await connection.execute('update license set is_activated=true where code=$1', user.get('license'))
                return {'user_id': new_user_id, 'role': Role.ADMIN.value}
        except Exception as e:
            print(e)
        finally:
            await connection.close()



    @staticmethod
    async def check_bad_license(code):
        try:
            connection = await asyncpg.connect(DATABASE_URL)
            row = await connection.fetchrow('SELECT is_activated FROM license WHERE code = $1;', code)
            return row is None or row.get("is_activated")
        except Exception as e:
            print(e)
            return True
        finally:
            await connection.close()


    @staticmethod
    async def get_user_db(email: str, password: str):
        try:
            connection = await asyncpg.connect(DATABASE_URL)
            row = await connection.fetchrow(
            """
            SELECT * FROM
            users LEFT OUTER JOIN users_role USING(user_id)
            WHERE email = $1 AND password = $2;
            """, email, password)
            if row is not None:
                return {
                    'user_id': row.get('user_id'),
                    'role': row.get('role_id'),
                }
        except Exception as e:
            print(e)
        finally:
            await connection.close()

