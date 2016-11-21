/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     20-11-2016 22:12:41                          */
/*==============================================================*/


drop table if exists STATUS;

drop table if exists TVSHOW;

/*==============================================================*/
/* Table: STATUS                                                */
/*==============================================================*/
create table STATUS
(
   ID_STATUS            int not null auto_increment,
   ID_TVSHOW            int not null,
   DOWNLOADED           bool,
   VIEWED               bool,
   SEASON               int,
   EPISODE              int,
   primary key (ID_STATUS)
);

/*==============================================================*/
/* Table: TVSHOW                                                */
/*==============================================================*/
create table TVSHOW
(
   ID_TVSHOW            int not null auto_increment,
   NAME                 varchar(100) not null,
   primary key (ID_TVSHOW)
);

alter table STATUS add constraint FK_TIENE foreign key (ID_TVSHOW)
      references TVSHOW (ID_TVSHOW) on delete restrict on update restrict;

