import asyncpg
from config import DATABASE_URL


class AdminRepository:

    @staticmethod
    async def get_new_code():
        try:
            connection = await asyncpg.connect(DATABASE_URL)
            new_code = await connection.fetchval('insert into license values(default, false) returning code;')
            return new_code
        except Exception as e:
            print(e)
        finally:
            await connection.close()