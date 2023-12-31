from config import DATABASE_URL, ApplicationStatus
import asyncpg
from config import vacation_names
from datetime import datetime, date


class ApplicationsRepository:
    @staticmethod
    async def change_status(app_id: int, status_id: int, user_id: int):
        try:
            connection = await asyncpg.connect(DATABASE_URL)
            await connection.execute(
                "insert into status_log values(default, $1, $2, $3, $4);",
                app_id,
                status_id,
                datetime.now(),
                user_id,
            )
        except Exception as e:
            return str(e)
        finally:
            await connection.close()

    @staticmethod
    async def get_active_apps(head_id: int):
        try:
            connection = await asyncpg.connect(DATABASE_URL)
            department_id = await connection.fetchval(
                "select department_id from users where user_id = $1;", head_id
            )
            apps = await connection.fetch(
                """
                select
                    user_id,
                    application_id,
                    type_id,
                    note,
                    start_date,
                    end_date,
                    status_id,
                    moment,
                    verifier_id,
                    email,
                    first_name,
                    second_name,
                    patronymic,
                    department_id
                from
                    (
                    select
                        application_id,
                        applications.user_id,
                        type_id,
                        note,
                        start_date,
                        end_date,
                        status_id,
                        moment,
                        verifier_id,
                        role_id,
                        case
                            role_id
                                    when 1 then department_id
                            when 2 then head_department_id
                            else department_id
                        end as next_dep_verify
                    from
                        (
                        select
                            max(record_id) as record_id
                        from
                            status_log
                        group by
                            application_id) as actual
                    join status_log
                            using(record_id)
                    join users on
                        status_log.verifier_id = users.user_id
                    join users_role
                            using(user_id)
                    join department
                            using(department_id)
                    join applications
                            using(application_id)
                    ) as next_level
                join users
                    using(user_id)
                where
                    status_id = 1
                    and type_id = 1
                    and next_dep_verify = $1;""",
                department_id,
            )
            return {"apps": [] if apps is None else [dict(x) for x in apps]}
        except Exception as e:
            print(e)
        finally:
            await connection.close()

    @staticmethod
    async def get_head(user_id: int):
        try:
            connection = await asyncpg.connect(DATABASE_URL)
            next_department_id = await connection.fetchval(
                """select
                        case
                            role_id
                                    when 1 then department_id
                            when 2 then head_department_id
                            else department_id
                        end as next_dep_verify
                    from
                        users
                    join users_role
                            using(user_id)
                    join department
                            using(department_id)
                    where user_id = $1;""",
                user_id
                # "select department_id from users where user_id = $1;", user_id
            )
            if next_department_id is None:
                return None
            # хотим user_id, email, first_name, second_name, patronymic, role_id, department_id, department_name руководителя
            head = await connection.fetchrow(
                """
            select user_id, email, first_name, second_name, patronymic, role_id,
            department_id, department_name from users join department using(department_id) join users_role using(user_id)
            where role_id=2 and department.department_id = $1;
                                             """,
                next_department_id,
            )
            return head if head is None else dict(head)
        except Exception as e:
            print(e)
        finally:
            await connection.close()

    @staticmethod
    async def get_applications(user_id):
        try:
            connection = await asyncpg.connect(DATABASE_URL)
            res = await connection.fetch(
                """
            select records.application_id, type_id, note, start_date, end_date, status_id, moment from
                (select application_id, max(record_id) as record_id from
                applications join status_log using(application_id)
            where user_id=$1
            group by application_id) as records join applications using(application_id) join status_log using(record_id);
            """,
                user_id,
            )
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
                new_form_id = await connection.fetchval(
                    "insert into applications values(default, $1, $2, $3, $4, $5) returning application_id;",
                    new_form.get("type"),
                    user_id,
                    new_form.get("note"),
                    new_form.get("start_date"),
                    new_form.get("end_date"),
                )
                await connection.execute(
                    "insert into status_log values(default, $1, $2, $3, $4);",
                    new_form_id,
                    ApplicationStatus.PROCESSING
                    if new_form.get("type") == 1
                    else ApplicationStatus.ACCESSED,
                    datetime.now(),
                    user_id,
                )
        except Exception as e:
            print(e)
            return str(e)
        finally:
            await connection.close()

    @staticmethod
    async def get_vacation(app_id: int):
        try:
            connection = await asyncpg.connect(DATABASE_URL)
            app = await connection.fetchrow(
                "select type_id, start_date, end_date from applications where application_id=$1",
                app_id,
            )
            return None if app is None else dict(app)
        except Exception as e:
            print(e)
        finally:
            await connection.close()

    @staticmethod
    async def get_exist_print(app_id: int, user_id: int, head_id):
        data = await ApplicationsRepository.get_vacation(app_id)
        data["duration"] = (data.get("end_date") - data.get("start_date")).days + 1
        data["title"] = vacation_names.get(data.get("type_id"))
        try:
            connection = await asyncpg.connect(DATABASE_URL)
            receiver = await connection.fetchrow(
                "select first_name as head_name, second_name as head_surname, patronymic as head_patronymic from users where user_id=$1;",
                head_id,
            )
            data.update(dict(receiver))
            sender = await connection.fetchrow(
                "select first_name, second_name, patronymic from users where user_id=$1;",
                user_id,
            )
            data.update(dict(sender))
            return data
        except Exception as e:
            print(e)
        finally:
            await connection.close()

    @staticmethod
    async def get_author(app_id: int):
        try:
            connection = await asyncpg.connect(DATABASE_URL)
            author = await connection.fetchrow(
                "select email, first_name, second_name, patronymic from applications join users using(user_id) where application_id =$1;",
                app_id,
            )
            return author
        except Exception as e:
            print(e)
        finally:
            await connection.close()

    @staticmethod
    async def get_print_data(
        type_id: int, start_date: date, end_date: date, user_id: int, head_id: int
    ):
        try:
            print_data = dict()
            print_data["start_date"] = start_date
            print_data["end_date"] = end_date
            print_data["duration"] = abs((end_date - start_date).days) + 1
            print_data["title"] = vacation_names.get(type_id)

            connection = await asyncpg.connect(DATABASE_URL)

            receiver = await connection.fetchrow(
                "select first_name as head_name, second_name as head_surname, patronymic as head_patronymic from users where user_id=$1;",
                head_id,
            )
            print_data.update(dict(receiver))

            sender = await connection.fetchrow(
                "select first_name, second_name, patronymic from users where user_id=$1;",
                user_id,
            )
            print_data.update(dict(sender))

            return print_data
        except Exception as e:
            print(e)
        finally:
            await connection.close()
