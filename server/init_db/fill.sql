--Самый главный департамент
insert into department
values(default, 'Правовой департамент', null);
--руководитель
insert into users
values(default, 'lanin-g@mail.ru', 'ТУТПАРОЛЬ', 'Владимир', 'Потанин', 'Юрьевич', 1);
insert into users_role
values(1, 2);
--сотрудник
insert into users
values(default, 'aga@mail.ru', 'ТУТПАРОЛЬ', 'Виталий', 'Петухов', 'Олегович', 1);
insert into users_role
values(2, 1);



--Отдел законопроектной деятельности в департаменте
insert into department
values(default, 'Отдел законопроектной деятельности', 1);
--руководитель
insert into users
values(default, 'qwerty@mail.ru', 'ТУТПАРОЛЬ', 'Дмитрий', 'Волков', 'Михайлович', 2);
insert into users_role
values(3, 2);
--сотрудник
insert into users
values(default, 'agata@mail.ru', 'ТУТПАРОЛЬ', 'Агата', 'Васильева', 'Константиновна', 2);
insert into users_role
values(4, 1);


--Сектор в отделе законопроектной деятельности
insert into department
values(default, 'Сектор проектной разработки', 2);
--сотрудник
insert into users
values(default, 'polinata@mail.ru', 'ТУТПАРОЛЬ', 'Полина', 'Конюхова', 'Вячеславовна', 2);
insert into users_role
values(5, 1);
--руководитель сектора
insert into users
values(default, 'oxy@mail.ru', 'ТУТПАРОЛЬ', 'Оксана', 'Верн', 'Витальевна', 3);
insert into users_role
values(6, 2);




--Отдел в департаменте
insert into department
values(default, 'Отдел нормативных правовых актов', 1);
--рук
insert into users
values(default, 'privet@mail.ru', 'ТУТПАРОЛЬ', 'Агафья', 'Трусова', 'Ивановна', 4);
insert into users_role
values(7, 2);
--сотрудник
insert into users
values(default, 'poka@mail.ru', 'ТУТПАРОЛЬ', 'Екатерина', 'Сибирцева', 'Игоревна', 4);
insert into users_role
values(8, 1);


--insert into department
--values(default, 'Отдел правового сопровождения судебно-претензионной работы', 1);
--
--insert into department
--values(default, 'Отдел контроля за исполнением поручений', 1);
--
--insert into department
--values(default, 'Отдел протокольного обеспечения', 1);