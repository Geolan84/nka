from config import DATABASE_URL, Role
import asyncpg


class ApplicationsRepository:

    @staticmethod
    async def get_statistic(user: dict):
        try:
            connection = await asyncpg.connect(DATABASE_URL)
            
             #   return {'user_id': new_user_id, 'role': Role.ADMIN.value}
        except Exception as e:
            print(e)
        finally:
            await connection.close()

    @staticmethod
    async def add_application(body: dict):
        try:
            connection = await asyncpg.connect(DATABASE_URL)
            async with connection.transaction():
                new_form_id = await connection.fetchval('insert into applications values(default, $1, $2, $3, $4, $5, $6, $7, $8) returning user_id;', )
             #   return {'user_id': new_user_id, 'role': Role.ADMIN.value}
        except Exception as e:
            print(e)
        finally:
            await connection.close()