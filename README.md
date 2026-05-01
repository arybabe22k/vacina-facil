  
# vacina-facil
=======

# 💉 VacinaFácil

Sistema completo para **gestão e agendamento de vacinação**, desenvolvido com foco em simplicidade, acessibilidade e eficiência.

O utilizador pode registar-se sem conta, obter um código único e consultar o seu histórico de vacinação de forma rápida.

---

## 🚀 Tecnologias utilizadas

### 🔙 Backend
- Java 17
- Spring Boot
- Spring Data JPA
- H2 / PostgreSQL
- Maven

### 🔜 Frontend
- Next.js
- React
- Tailwind CSS
- JavaScript (ES6+)

---

## 📁 Estrutura do projecto

```

vacina-facil/
vacina-facil-backend/
vacina-facil-frontend/

````

---

## ⚙️ Como correr o projecto

### 🔹 1. Backend (Spring Boot)

Entrar na pasta:

```bash
cd vacina-facil-backend
````

Correr a aplicação:

```bash
mvn spring-boot:run
```

Ou via IntelliJ (▶️)

O backend vai correr em:

```bash
http://localhost:8080
```

---

### 🔹 2. Frontend (Next.js)

Entrar na pasta:

```bash
cd vacina-facil-frontend
```

Instalar dependências:

```bash
npm install
```

Correr o frontend:

```bash
npm run dev
```

Vai abrir em:

```bash
http://localhost:3000
```

---

## 🔗 Integração

O frontend comunica com o backend através de:

```bash
http://localhost:8080/api
```

---

## 📌 Funcionalidades

* Registo de utentes
* Geração automática de código único
* Consulta de histórico de vacinação
* Agendamento de vacinas
* Gestão de estado (pendente, concluído, etc.)
* Interface simples e responsiva

---

## 🧪 Teste da API

Exemplo de endpoint:

```bash
GET http://localhost:8080/api/utentes
```

---

## 🗄️ Base de dados

### Opção rápida (desenvolvimento)

* H2 (base de dados em memória)

### Produção

* PostgreSQL

---

## 👨‍💻 Autor

Aristides Guilherme

---

## 📈 Futuras melhorias

* Autenticação de utilizadores
* Notificações (SMS / Email)
* Dashboard administrativo
* Integração com APIs externas
* Deploy (Vercel + Render)

---

## ⭐ Contribuição

Sinta-se livre para contribuir ou sugerir melhorias.

---

## 📜 Licença

Este projecto é para fins académicos e de aprendizagem.


