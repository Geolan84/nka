--Роль: сотрудник, руководитель, администратор
create table roles(
	role_id serial primary key,
	role_name varchar(50) not null
);

create table department(
	department_id serial,
	department_name VARCHAR(100) not null,
	head_department_id int,
	PRIMARY KEY(department_id),
	foreign key(head_department_id) references department(department_id)
);

--Пользователи
create table users(
	user_id serial PRIMARY KEY,
	email VARCHAR(100) unique not null,
	password VARCHAR(16) not null,
	first_name VARCHAR(50) not null,
	second_name VARCHAR(50) not null,
	patronymic VARCHAR(50),
	department_id int,
	foreign key(department_id) references department(department_id) ON DELETE set null
);

--Связка: Пользователь&Роль
create table users_role(
	user_id int,
	role_id int,
	foreign key(user_id) references users(user_id) ON DELETE CASCADE,
	foreign key(role_id) references roles(role_id) ON DELETE set NULL
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
create table license(
	code uuid DEFAULT uuid_generate_v4 (),
	is_activated boolean not null
);

create table application_types(
	type_id int ,
	app_name VARCHAR(34) not null,
	primary key(type_id)
);

create table applications(
	application_id serial,
	type_id int,
	user_id int,
	note varchar(400),
	start_date date not null,
	end_date date not null,
	primary key(application_id),
	foreign key(type_id) references application_types(type_id) on delete set null,
	foreign key(user_id) references users(user_id)
);

create table application_status(
	status_id int,
	status_name varchar(15),
	primary key(status_id)
);

create table status_log(
	record_id serial,
	application_id int not null,
	status_id int not null,
	moment timestamp not null,
	foreign key(status_id) references application_status(status_id),
	foreign key(application_id) references applications(application_id),
	primary key(record_id)
)
