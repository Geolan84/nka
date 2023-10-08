insert into qualification(qual_name)
values
('Стажёр'),
('Младший'),
('Старший');

insert into profession(prof_name)
values
('Аналитик'),
('Менеджер'),
('Программист'),
('Юрист');

insert into roles(role_name)
values
('Сотрудник'),
('Руководитель'),
('Администратор');


insert into users
values(default, 'lanin-g@mail.ru', 'qwerty', 'Георгий', 'Ланин', 'Михайлович', 1, 1);

insert into users_role
values(1, 1);

insert into license
values(default, false);