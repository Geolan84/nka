import asyncpg
from datetime import date

from config import DATABASE_URL


class DashboardRepository:
    @staticmethod
    async def get_one_level_vacation(user_id: int):
        try:
            connection = await asyncpg.connect(DATABASE_URL)
            department_id = await connection.fetchval(
                "select department_id from users where user_id = $1;", user_id
            )
            vacations = await connection.fetch(
                """
                                            select 
                                                user_id,
                                                applications.application_id,
                                                type_id,
                                                start_date,
                                                end_date,
                                                first_name,
                                                second_name,
                                                patronymic,
                                                status_id
                                            from
                                                (
                                                select
                                                application_id,
                                                    max(record_id) as record_id
                                                from
                                                    status_log
                                                group by
                                                    application_id) as actual
                                                join applications using(application_id) join users using(user_id) join status_log using(record_id)
                                            where department_id = $1 and status_id != 3 order by second_name;
                                            """,
                department_id,
            )
            if vacations is None:
                return {"users": []}
            heap = dict()

            def __parse_vacation(app):
                app = dict(app)
                # Compute and append divs and duration.
                start_date = app["start_date"]
                end_date = app["end_date"]
                duration = (end_date - start_date).days + 1
                year_begin = date(start_date.year, 1, 1)
                start_div = (start_date - year_begin).days
                app["duration"] = duration
                app["start_div"] = start_div
                app["end_div"] = start_div + duration
                # Prepere unit for heap.
                key_id = app.get("user_id")
                pure_app = {
                    "application_id": app.get("application_id"),
                    "type_id": app.get("type_id"),
                    "start_date": app.get("start_date"),
                    "end_date": app.get("end_date"),
                    "status_id": app.get("status_id"),
                    "duration": app.get("duration"),
                    "start_div": app.get("start_div"),
                    "end_div": app.get("end_div"),
                }
                if key_id in heap:
                    if "vacations" in heap[key_id]:
                        heap[key_id]["vacations"].append(pure_app)
                    else:
                        heap[key_id]["vacations"] = [pure_app]
                else:
                    heap[key_id] = dict()
                    heap[key_id]["user_id"] = app.get("user_id")
                    heap[key_id]["first_name"] = app.get("first_name")
                    heap[key_id]["second_name"] = app.get("second_name")
                    heap[key_id]["patronymic"] = app.get("patronymic")
                    heap[key_id]["vacations"] = [pure_app]

            for vac in vacations:
                __parse_vacation(vac)

            return {"users": list(heap.values())}

        except Exception as e:
            print(e)
        finally:
            await connection.close()
