from config import DATABASE_URL, ApplicationStatus
import asyncpg
from datetime import datetime


class ApplicationsRepository:

    @staticmethod
    async def get_statistic(user: dict):
        try:
            connection = await asyncpg.connect(DATABASE_URL)

        except Exception as e:
            print(e)
        finally:
            await connection.close()

    @staticmethod
    async def get_applications(user_id):
        try:
            connection = await asyncpg.connect(DATABASE_URL)
            res = await connection.fetch("""
            select records.application_id, type_id, note, start_date, end_date, status_id, moment from
                (select application_id, max(record_id) as record_id from
                applications join status_log using(application_id)
            where user_id=$1
            group by application_id) as records join applications using(application_id) join status_log using(record_id);
            """, user_id)
            return {"applications": [dict(x) for x in res]}
        except Exception as e:
            print(e)
        finally:
            await connection.close()

    @staticmethod
    async def add_application(user_id, body):
        new_form = dict(body)
        try:
            connection = await asyncpg.connect(DATABASE_URL)
            async with connection.transaction():
                new_form_id = await connection.fetchval('insert into applications values(default, $1, $2, $3, $4, $5) returning application_id;', new_form.get('type'), user_id, new_form.get('note'), new_form.get('start_date'), new_form.get('end_date'))
                await connection.execute('insert into status_log values(default, $1, $2, $3);', new_form_id,
                                         ApplicationStatus.PROCESSING if new_form.get('type')==1 else ApplicationStatus.ACCESSED, datetime.now())
        except Exception as e:
            print(e)
            return str(e)
        finally:
            await connection.close()