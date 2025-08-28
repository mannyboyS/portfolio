from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from sqlalchemy import Integer, String
from smtplib import SMTP
import os

my_pass = os.environ.get('APP_PASSWORD')
my_email = os.environ.get('EMAIL')
db_uri = os.environ.get('DB_URI', "sqlite:///portfolio.db")

app = Flask(__name__)

class Base(DeclarativeBase):
    pass

app.config['SQLALCHEMY_DATABASE_URI'] = db_uri
db = SQLAlchemy(model_class=Base)
db.init_app(app)

class Portfolio(db.Model):
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    thumbnail_img: Mapped[str] = mapped_column(String(500), unique=True, nullable=False)
    project_imgs: Mapped[str] = mapped_column(String(5000), nullable=True)
    title: Mapped[str] = mapped_column(String(250), unique=True, nullable=False)
    summary: Mapped[str] = mapped_column(String(1000), nullable=False)
    roles: Mapped[str] = mapped_column(String(1000), nullable=False)
    tools_used: Mapped[str] = mapped_column(String(250), nullable=False)
    result: Mapped[str] = mapped_column(String(1000), nullable=False)
    learnings: Mapped[str] = mapped_column(String(1000), nullable=False)

@app.route('/')
def home():

    projects = db.session.execute(db.select(Portfolio)).scalars().all()
    project_list = []
    for project in projects:
        my_dict = dict()
        my_dict['id'] = project.id
        my_dict['thumbnail_img'] = project.thumbnail_img
        my_dict['title'] = project.title
        my_dict['roles'] = [role.strip() for role in project.roles.split('¶')
                            if role.strip()] if project.roles else []
        my_dict['summary'] = project.summary
        my_dict['tools_used'] = [tool.strip() for tool in project.tools_used.split('¶')
                            if tool.strip()] if project.tools_used else []
        my_dict['result'] = project.result
        my_dict['learnings'] = project.learnings
        my_dict['project_imgs'] = [image.strip() for image in project.project_imgs.split('¶')
                                   if image.strip()] if project.project_imgs else []
        project_list.append(my_dict)

    return render_template('index.html', projects=project_list)

@app.route('/send-mail', methods=['POST'])
def send_mail():
    try:
        name = request.form.get('name')
        email = request.form.get('email')
        subject = request.form.get('subject')
        message = request.form.get('message')

        if not all([name, email, subject, message]):
            return jsonify({'success': False, 'message': 'All fields are required'}), 400

        print(f"Sending email from: {name} ({email})")

        with SMTP('smtp.gmail.com', port=587) as smtp:
            smtp.starttls()
            smtp.login(user=my_email, password=my_pass)
            smtp.sendmail(from_addr=my_email,
                          to_addrs=my_email,
                          msg=f"Subject: Contact Form: {subject}\n\n"
                              f"Name: {name}\n\n"
                              f"Email: {email}\n\n"
                              f"Message:\n{message}")

        print("Email sent successfully!")
        return jsonify({'success': True, 'message': 'Message sent successfully!'})

    except Exception as e:
        print(f"Error sending email: {str(e)}")
        return jsonify({'success': False, 'message': 'Failed to send message. Please try again.'}), 500

if __name__ == '__main__':
    app.run()