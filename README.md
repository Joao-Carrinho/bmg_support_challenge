#  Support Management System

This project is a **Support Management System** built with **Next.js, React, and Tailwind CSS**, with a backend using **MS SQL Server** and **Docker** for database management.

##  Setup Guide

### **1️⃣ Prerequisites**
Ensure you have the following installed:
- **Docker & Docker Compose**
- **Node.js** (LTS version recommended)
- **Git**

---

## 🔹 **Docker Setup (MS SQL Server)**

### **1️⃣ Start the Database**
Run the following command to start **MS SQL Server** inside a Docker container:

```sh
docker run -e 'ACCEPT_EULA=Y' -e 'SA_PASSWORD=BMG_Challenge10' \
   -p 1433:1433 --name suporteDB -d mcr.microsoft.com/mssql/server:2019-latest
```
This will create a **suporteDB** database inside a **Docker container**.

### **2️⃣ Connect to the Database**
- Use **HeidiSQL** or **SQL Server Management Studio (SSMS)**.
- Connect using:
  - **Host:** `localhost,1433`
  - **User:** `sa`
  - **Password:** `BMG_Challenge10`
  - **Database:** `SupportDB`

### **3️⃣ Create the Table**
Run the following SQL command to create the `Suporte` table:

```sql
CREATE TABLE Suporte (
    id INT IDENTITY(1,1) PRIMARY KEY,
    data DATETIME2(7) NOT NULL,
    problema TEXT NOT NULL,
    solucao TEXT,
    estado CHAR(25) NOT NULL,
    site VARCHAR(30),
    userid CHAR(25) NOT NULL,
    datafecho DATETIME2(7),
    tipoProblema VARCHAR(30),
    tipoSolucao VARCHAR(30),
    useridResponsavel INT
);
```

---

## 🔹 **Running the Project**

### **1️⃣ Install Dependencies**
```sh
npm install
```

### **2️⃣ Start the Application**
```sh
npm run dev  # Runs Next.js in development mode
```

Then, open **http://localhost:3000** in your browser.

---

## 🔹 **API Endpoints**
- **GET** `/api/suporte` → Fetch all support records
- **POST** `/api/suporte` → Add a new support record
- **PUT** `/api/suporte/:id` → Update a support record
- **DELETE** `/api/suporte/:id` → Delete a record

---
**Now you're ready to set up and run the project!**

