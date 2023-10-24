import asyncio
import asyncpg
from datetime import date


from admin.admin_repository import AdminRepository
from auth.auth_repository import AuthRepository
from auth.schemas import UserRegister
from structure.struct_repository import StructRepository
from structure.schemas import NewUser
from applications.applications_repository import ApplicationsRepository
from applications.schemas import ApplicationBody

from config import DATABASE_URL


async def prepare_db():
    # Creates tables and insert roles, types and statuses.
    try:
        connection = await asyncpg.connect(DATABASE_URL)
        with open("init_db/init.sql", "r") as file:
            sql_init = file.read()
        await connection.execute(sql_init)
    except Exception as e:
        print(e)
    finally:
        await connection.close()
    # Add admin.
    new_license = await AdminRepository.get_new_code()
    admin = UserRegister(
        license=str(new_license),
        email="admin@mail.ru",
        password="ТУТПАРОЛЬ",
        first_name="Админ",
        second_name="Админов",
        patronymic="Админович",
    )
    await AuthRepository.admin_register(dict(admin))
    #
    # # Create departments and users.
    #
    await StructRepository.add_department("Правовой департамент", None)
    # Правовой департамент / руководитель [id=2]
    new_user = NewUser(
        email="lanin-g@mail.ru",
        first_name="Владимир",
        second_name="Иванов",
        patronymic="Юрьевич",
        department_id=1,
        is_head=True,
    )
    await StructRepository.add_new_user(dict(new_user))
    # Правовой департамент / сотрудник [id=3]
    new_user = NewUser(
        email="aga@mail.ru",
        first_name="Виталий",
        second_name="Петухов",
        patronymic="Олегович",
        department_id=1,
        is_head=False,
    )
    await StructRepository.add_new_user(dict(new_user))
    #
    await StructRepository.add_department("Отдел законопроектной деятельности", 1)
    # Правовой департамент / отдел законопроектной деятельности / руководитель [id=4]
    new_user = NewUser(
        email="lanin938@gmail.com",
        first_name="Дмитрий",
        second_name="Волков",
        patronymic="Михайлович",
        department_id=2,
        is_head=True,
    )
    await StructRepository.add_new_user(dict(new_user))
    # Правовой департамент / отдел законопроектной деятельности / сотрудник [id=5]
    new_user = NewUser(
        email="agata@mail.ru",
        first_name="Агата",
        second_name="Васильева",
        patronymic="Константиновна",
        department_id=2,
        is_head=False,
    )
    await StructRepository.add_new_user(dict(new_user))
    #
    await StructRepository.add_department("Сектор разработки законопроектов", 2)
    # Правовой департамент / отдел законопроектной деятельности / Сектор разработки законопроектов / Руководитель [id=6]
    new_user = NewUser(
        email="gmlanin@edu.hse.ru",
        first_name="Оксана",
        second_name="Верн",
        patronymic="Витальевна",
        department_id=3,
        is_head=True,
    )
    await StructRepository.add_new_user(dict(new_user))
    # Правовой департамент / отдел законопроектной деятельности / Сектор разработки законопроектов / Сотрудник [id=7]
    new_user = NewUser(
        email="polinata@mail.ru",
        first_name="Полина",
        second_name="Конюхова",
        patronymic="Вячеславовна",
        department_id=3,
        is_head=False,
    )
    await StructRepository.add_new_user(dict(new_user))
    #
    await StructRepository.add_department("Сектор нормативных правовых актов", 2)
    # Правовой департамент / отдел законопроектной деятельности / Сектор НПА / Руководитель [id=8]
    new_user = NewUser(
        email="privet@mail.ru",
        first_name="Агафья",
        second_name="Трусова",
        patronymic="Ивановна",
        department_id=4,
        is_head=True,
    )
    await StructRepository.add_new_user(dict(new_user))
    # Правовой департамент / отдел законопроектной деятельности / Сектор НПА / Сотрудник [id=9]
    new_user = NewUser(
        email="poka@mail.ru",
        first_name="Екатерина",
        second_name="Сибирцева",
        patronymic="Игоревна",
        department_id=4,
        is_head=False,
    )
    await StructRepository.add_new_user(dict(new_user))
    #
    # # Create applications for vacation.
    #
    # Отпуск Екатерины Сибирцевой
    new_app = ApplicationBody(
        type=1,
        note="В эти даты проходит ежегодная конференция юристов в Ростове, мне крайне необходимо её посетить.",
        start_date=date(2024, 5, 17),
        end_date=date(2024, 5, 22),
    )
    await ApplicationsRepository.add_application(9, new_app)
    new_app = ApplicationBody(
        type=1, note=None, start_date=date(2024, 7, 5), end_date=date(2024, 7, 20)
    )
    await ApplicationsRepository.add_application(9, new_app)
    # Отпуск Агафьи Трусовой
    new_app = ApplicationBody(
        type=1, note=None, start_date=date(2024, 6, 2), end_date=date(2024, 6, 29)
    )
    await ApplicationsRepository.add_application(8, new_app)
    # Отпуск Полины Конюховой
    new_app = ApplicationBody(
        type=1, note=None, start_date=date(2024, 7, 1), end_date=date(2024, 7, 28)
    )
    await ApplicationsRepository.add_application(7, new_app)


if __name__ == "__main__":
    asyncio.run(prepare_db())
