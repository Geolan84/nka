insert into roles(role_name)
values
('Сотрудник'),
('Руководитель'),
('Администратор');

insert into application_types
values
(1, 'Основной отпуск'),
(2, 'Дополнительный оплачиваемый отпуск'),
(3, 'Отпуск без сохранения з/п'),
(4, 'Отпуск по уходу за ребёнком'),
(5, 'Учебный отпуск'),
(6, 'Донорский день');

insert into application_status values
(1, 'На согласовании'),
(2, 'Согласовано'),
(3, 'Отказано');