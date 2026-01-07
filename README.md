# Ponto Notes

O **Ponto** é um projeto pessoal desenvolvido com o objetivo de aprofundar conhecimentos técnicos, principalmente em Java e no desenvolvimento de APIs REST. Este é um projeto **full stack**, abrangendo desde o banco de dados e back-end até uma interface front-end, servindo como uma base prática para estudos de integração e arquitetura.

## Tecnologias Utilizadas

### Back-end
* **Java 21**: Versão da linguagem utilizada no projeto. <img src="https://img.icons8.com/?size=100&id=Pd2x9GWu9ovX&format=png&color=000000" alt="logo JAVA" width="30" align="top">
* **Spring Boot 4.0.1**: Framework base para a construção da API. <img src="https://icon.icepanel.io/Technology/svg/Spring.svg" alt="logo Spring" width="30" align="top">
* **Spring Data JPA**: Para persistência de dados e mapeamento objeto-relacional. <img src="https://icon.icepanel.io/Technology/svg/Hibernate.svg" alt="logo DATABASE" width="30" align="top">
* **Spring Web MVC**: Para a criação dos endpoints REST. <img src="https://icon.icepanel.io/Technology/svg/Spring.svg" alt="logo Spring" width="30" align="top">
* **Springdoc OpenAPI (Swagger)**: Para documentação interativa da API, configurada no caminho `/swagger`. <img src="https://icon.icepanel.io/Technology/svg/Swagger.svg" alt="logo Swagger" width="30" align="top">
* **Lombok**: Utilizado para redução de código boilerplate. <img src="https://avatars.githubusercontent.com/u/45949248?s=280&v=4" alt="logo Swagger" width="30" align="top">
* **PostgreSQL**: Banco de dados relacional. <img src="https://icon.icepanel.io/Technology/svg/PostgresSQL.svg" alt="logo Lombok" width="30" align="top">
* **Maven**: Gerenciador de dependências e build. <img src="https://icon.icepanel.io/Technology/svg/Apache-Maven.svg" alt="logo Maven" width="30" align="top">

### Front-end
* **HTML5, CSS3 e JavaScript**: Localizados no diretório estático do servidor. <img src="https://icon.icepanel.io/Technology/svg/HTML5.svg" alt="logo HTML5" width="30" align="top"> <img src="https://icon.icepanel.io/Technology/svg/CSS3.svg" alt="logo CSS3" width="30" align="top"> <img src="https://icon.icepanel.io/Technology/svg/JavaScript.svg" alt="logo JavaScript" width="30" align="top">
* **Foton Framework**: Utilizado para estilização e scripts da interface. <img src="https://foton-framework.vercel.app/assets/vector/Logo.svg" alt="logo Foton" width="30" align="top">

### Infraestrutura
* **Docker & Docker Compose**: Para containerização da aplicação e do banco de dados. <img src="https://img.icons8.com/?size=100&id=cdYUlRaag9G9&format=png&color=000000" alt="logo Docker" width="30" align="top">

## Como Testar na sua Máquina

Para executar o projeto localmente utilizando o Docker, siga os passos abaixo:

### Pré-requisitos
* **Git** instalado.
* **Docker** e **Docker Compose** instalados.

### Passo a Passo

1.  **Clone o repositório:**
    ```bash
    git clone <url-do-seu-repositorio>
    cd ponto-notes-api
    ```

2.  **Suba os containers com Docker Compose:**
    Este comando irá baixar as imagens (como a do `postgres:15`), configurar o banco de dados e compilar a aplicação.
    ```bash
    docker-compose up -d
    ```

3.  **Acesse a aplicação:**
    * **Front-end:** A interface estará disponível em `http://localhost:8080`.
    * **Documentação da API (Swagger):** Para testar os endpoints, acesse `http://localhost:8080/swagger`.

### Informações de Configuração
O projeto utiliza as seguintes configurações padrão via Docker:
* **Banco de Dados**: `db_ponto`
* **Usuário**: `postgres`
* **Senha**: `password`
* **Schema**: `ponto`

O banco de dados é inicializado automaticamente através do script localizado em `./sql/db_ponto-api.sql`.