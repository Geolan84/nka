--Квалификация: младший, старший
create table qualification(
	qual_id serial,
	qual_name VARCHAR(50) not null,
	PRIMARY KEY(qual_id)
);

--Профессия: разработчик, аналитик, менеджер
create table profession(
	prof_id serial,
	prof_name VARCHAR(50) not null,
	PRIMARY KEY(prof_id)
);

--Роль: сотрудник, руководитель, администратор
create table roles(
	role_id serial primary key,
	role_name varchar(50) not null
);

--Пользователи
create table users(
	user_id serial PRIMARY KEY,
	email VARCHAR(100) unique not null,
	password VARCHAR(16) not null,
	first_name VARCHAR(50) not null,
	second_name VARCHAR(50) not null,
	patronymic VARCHAR(50),
	qual_id int,
	prof_id int,
	foreign key(qual_id) references qualification(qual_id) ON DELETE set null,
	foreign key(prof_id) references profession(prof_id) ON DELETE set null
);

--Связка: Пользователь&Роль
create table users_role(
	user_id int,
	role_id int,
	foreign key(user_id) references users(user_id) ON DELETE CASCADE,
	foreign key(role_id) references roles(role_id) ON DELETE set NULL
);

--Кто кому подчиняется.
create table subordination(
	user_id int,
	head_id int,
	foreign key(user_id) references users(user_id) ON DELETE CASCADE,
	foreign key(head_id) references users(user_id) ON DELETE set NULL
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
create table license(
	code uuid DEFAULT uuid_generate_v4 (),
	is_activated boolean not null
);

create table department(
	department_id serial,
	department_name VARCHAR(100) not null,
	head_department_id int,
	PRIMARY KEY(department_id),
	foreign key(head_department_id) references department(department_id)
);