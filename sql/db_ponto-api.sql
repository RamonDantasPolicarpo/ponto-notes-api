CREATE SCHEMA ponto;

CREATE TABLE ponto.prioridade_tarefa (
    id_prioridade_tarefa integer NOT NULL,
    descricao_prioridade character varying(30) NOT NULL
);

CREATE SEQUENCE ponto.prioridade_tarefa_id_prioridade_tarefa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE ponto.prioridade_tarefa_id_prioridade_tarefa_seq OWNED BY ponto.prioridade_tarefa.id_prioridade_tarefa;

CREATE TABLE ponto.status_tarefa (
    id_status_tarefa integer NOT NULL,
    descricao_status character varying(30) NOT NULL
);

CREATE SEQUENCE ponto.status_tarefa_id_status_tarefa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE ponto.status_tarefa_id_status_tarefa_seq OWNED BY ponto.status_tarefa.id_status_tarefa;

CREATE TABLE ponto.tarefa (
    id_tarefa integer NOT NULL,
    titulo character varying(50) NOT NULL,
    descricao character varying(1000) NOT NULL,
    data_vencimento date,
    id_prioridade_tarefa integer NOT NULL,
    id_status_tarefa integer NOT NULL
);

CREATE SEQUENCE ponto.tarefa_id_tarefa_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE ponto.tarefa_id_tarefa_seq OWNED BY ponto.tarefa.id_tarefa;

ALTER TABLE ONLY ponto.prioridade_tarefa ALTER COLUMN id_prioridade_tarefa SET DEFAULT nextval('ponto.prioridade_tarefa_id_prioridade_tarefa_seq'::regclass);

ALTER TABLE ONLY ponto.status_tarefa ALTER COLUMN id_status_tarefa SET DEFAULT nextval('ponto.status_tarefa_id_status_tarefa_seq'::regclass);

ALTER TABLE ONLY ponto.tarefa ALTER COLUMN id_tarefa SET DEFAULT nextval('ponto.tarefa_id_tarefa_seq'::regclass);

INSERT INTO ponto.prioridade_tarefa VALUES (1, 'Alta');
INSERT INTO ponto.prioridade_tarefa VALUES (2, 'Média');
INSERT INTO ponto.prioridade_tarefa VALUES (3, 'Baixa');

INSERT INTO ponto.status_tarefa VALUES (1, 'Pendente');
INSERT INTO ponto.status_tarefa VALUES (2, 'Concluida');
INSERT INTO ponto.status_tarefa VALUES (3, 'Em andamento');

SELECT pg_catalog.setval('ponto.prioridade_tarefa_id_prioridade_tarefa_seq', 3, true);

SELECT pg_catalog.setval('ponto.status_tarefa_id_status_tarefa_seq', 3, true);

ALTER TABLE ONLY ponto.prioridade_tarefa
    ADD CONSTRAINT prioridade_tarefa_pkey PRIMARY KEY (id_prioridade_tarefa);

ALTER TABLE ONLY ponto.status_tarefa
    ADD CONSTRAINT status_tarefa_pkey PRIMARY KEY (id_status_tarefa);

ALTER TABLE ONLY ponto.tarefa
    ADD CONSTRAINT tarefa_pkey PRIMARY KEY (id_tarefa);

ALTER TABLE ONLY ponto.tarefa
    ADD CONSTRAINT fk_tarefa_prioridade FOREIGN KEY (id_prioridade_tarefa) REFERENCES ponto.prioridade_tarefa(id_prioridade_tarefa) ON DELETE RESTRICT;

ALTER TABLE ONLY ponto.tarefa
    ADD CONSTRAINT fk_tarefa_status FOREIGN KEY (id_status_tarefa) REFERENCES ponto.status_tarefa(id_status_tarefa) ON DELETE RESTRICT;

