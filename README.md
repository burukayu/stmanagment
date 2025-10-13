# 📝 Task Manager App

A simple Task Manager built with React (TypeScript) frontend, Django REST Framework backend, and PostgreSQL database.  
This app allows users to create, update, delete, and view tasks easily — a perfect example of a full-stack CRUD application.

---

##  Tech Stack

Frontend:
- React + TypeScript
- Axios (for API requests)
styling)

Backend:
- Django
- Django REST Framework 
- PostgreSQL (database)
- JWT Authentication for login/register



---

## ⚙️ Setup Instructions

# 1. Clone the repo
git clone https://github.com/burukayu/stmanagment.git

# 2. Go to the Django backend folder
open command prompt where you clone and run the following
cd stmanagment\stmback\stmbackend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
# make sure run as http://127.0.0.1:8000/

# 3. front end 
cd stmanagment\stmfront
npm install
npm start
