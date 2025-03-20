# FullStack Expense Splitter  

## 📌 Overview  
This is a **FullStack Expense Management Application** built using:  
- **Frontend**: React, Bootstrap  
- **Backend**: ASP.NET Core Web API  
- **Database**: MS SQL Server  

The application allows users to:  
✅ Create and manage expense groups  
✅ Track expenses and settlements  
✅ Manage invitations and group members  

---

## 🛠️ **Installation & Setup**  

### **1️⃣ Clone the Repository**  
```sh
git clone https://github.com/manya271001/ExpenseSplitter
cd FullStackApp

2️⃣ Install Dependencies
cd server
dotnet restore         # Install required dependencies
dotnet build           # Build the project

3️⃣ Set Backend Port to 5102

Your backend must run on port 5102 for the frontend to work.

📌 Update launchSettings.json in server/Properties/launchSettings.json
Change this:

"applicationUrl": "http://localhost:5102"


📌 (Optional) Update Program.cs
If needed, force the backend to always run on 5102:

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://localhost:5102");


📌 Database Setup (Primary Method: Migrations)
1️⃣ Apply Migrations (Main Method)
This is the default and recommended way to set up the database using Entity Framework migrations.


cd server
dotnet ef database update

📌 Alternative Method (Manual SQL Execution - Optional)
If someone prefers to manually execute the database script instead of using migrations, they can:

1️⃣ Locate the SQL Script
The SQL script is available in:
server/Database/setup.sql
2️⃣ Run the SQL Script in SSMS
Open SQL Server Management Studio (SSMS).
Connect to your SQL Server instance.

USE master;
CREATE DATABASE ExpenseSplitterDB;
Open setup.sql and execute it.

3️⃣ Update appsettings.json (If Needed)
If using manual setup, ensure the connection string in server/appsettings.json is set correctly:

"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=ExpenseSplitterDB;Trusted_Connection=True;MultipleActiveResultSets=true;"}



🎨 Frontend Setup (React + Bootstrap)

install  Dependencies
cd client
npm install  # Install required packages


Start the Frontend
npm start

📌 Requirements
All necessary dependencies and system requirements are listed in the requirements.txt file.