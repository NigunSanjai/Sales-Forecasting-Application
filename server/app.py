from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
import pandas as pd
from sales_forecasting import forecast
from io import StringIO
import io
from flask import Flask, render_template
from flask_mail import Mail, Message
import time



app = Flask(__name__)
CORS(app)


app.config['MAIL_SERVER']='smtp.gmail.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USERNAME'] = '01kumaragupta@gmail.com'
app.config['MAIL_PASSWORD'] = 'atsrxplhkhxuakrz'
app.config['MAIL_USE_TLS'] = False
app.config['MAIL_USE_SSL'] = True

mail = Mail(app)

# connect to the PostgreSQL database
conn = psycopg2.connect(
    host="localhost",
    database="app",
    user="postgres",
    password="abc"
)

# create a cursor object
cur = conn.cursor()

# define the table name
table_name = "users"

@app.route("/")
def home():
    return "Hello, Flask!"


@app.route("/register", methods=["POST"])
def register():
    # get the request data
    data = request.get_json()

    # extract the user data
    id = data['id']
    name = data['name']
    password = data['password']
    email = data['email']
    gender = data['gender'] 
    is_active = data['isActive']
    
    # check if the user already exists
    cur.execute(f"SELECT * FROM {table_name} WHERE id = %s", (id,))
    existing_user = cur.fetchone()

    if existing_user:
        return jsonify({'success': False, 'message': 'User already exists'})

    # insert the user data into the database
    cur.execute(
        f"INSERT INTO {table_name} (id, name, password, email, gender, is_active) VALUES (%s, %s, %s, %s, %s, %s)",
        (id, name, password, email, gender, is_active)
    )
    
    conn.commit()

    return jsonify({'success': True, 'message': 'Successfully Registered!!'})
  

@app.route('/login', methods=['POST'])
def login():
    # get the request data
    data = request.get_json()
    username = data['username']
    password = data['password']

    # search for the user in the database
    cur.execute(f"SELECT * FROM {table_name} WHERE id = %s AND password = %s", (username, password))
    user = cur.fetchone()

    if user:
        return jsonify({'success': True, 'message': username})
    else:
        return jsonify({'success': False, 'message': 'User not found!!'})
 

def save_forecast(user_id:str, title:str, file_name:str, attribute:str, frequency:str, period:int, actual_txt, forecast_txt, metrics:list):
    
    cur.execute(f"SELECT * FROM forecast_data WHERE user_id = %s AND title=%s AND file_name=%s AND attribute=%s AND frequency=%s AND period=%s", 
                (user_id, title, file_name, attribute, frequency, period))
    existing_forecast = cur.fetchone()

    if not existing_forecast:
        cur.execute(
            "INSERT INTO forecast_data (user_id, title, file_name, attribute, frequency, period, actual_txt, forecast_txt, metrics) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (user_id, title, file_name, attribute, frequency, period, actual_txt, forecast_txt, metrics)
        )
        
        conn.commit()
   
@app.route('/upload', methods=['POST'])
def upload_file():
    user_id = request.form['user_id']
    file = request.files['file']
    file_name = request.form['file_name']
    file_data = file.read()
    
    product = int(request.form['product'])
    frequency = request.form['frequency']
    period = int(request.form['period'])
    title = request.form['title']
    
    # print(f"{product} - {frequency} - {period}")
    
    data = file_data.decode('utf-8')
    file = StringIO(data)

    # read the CSV file using pandas
    df = pd.read_csv(file,parse_dates=True)
    result = forecast(df,product,frequency,period)
    # print(result)
    
    if(result):
        forecast_df = result['forecast_df']
        
        cur.execute(
            "SELECT * FROM user_csv_files WHERE user_id = %s AND file_name = %s",
            (user_id, file_name)
        )
        
        existing_file = cur.fetchone()

        if not existing_file:
            cur.execute(
            "INSERT INTO user_csv_files (user_id, file_name, file_data) VALUES (%s, %s, %s)",(user_id, file_name, psycopg2.Binary(file_data)))
            conn.commit()
            
    
        save_forecast(user_id, title, file_name, result['attribute'],frequency, period,
                  result['act_df'].to_csv() , 
                  forecast_df.to_csv() ,
                  result['metrics'] )    
    
    

    return jsonify({'success': True, 
                        'message': 'File is being Processed!!',
                        'forecast_df': forecast_df.to_csv(), 
                        'df': result['act_df'].to_csv(),
                        'attribute' : result['attribute'],
                        'metrics':result['metrics'],
                        'quantity':str(result['quantity']),
                        'revenue':str(result['revenue'])
                   })
        
        
@app.route('/get_files', methods=['POST'])
def get_files():
    user_id = request.form['user_id']
    print(user_id)

    cur.execute("SELECT file_name FROM user_csv_files WHERE user_id = %s", (user_id,))
    files = cur.fetchall()

    data = []

    # aggregate data into list of objects with 3 values each
    i=1
    for file in files:
        data.append({'id': i, 'file_name': file[0]})
        i+=1
    
    print(data)

    return jsonify({'success': True, 'data': data})

@app.route('/get_predictions', methods=['POST'])
def get_predictions():
    user_id = request.form['user_id']
    # print(user_id)

    cur.execute("SELECT title, file_name, attribute, frequency, period, actual_txt, forecast_txt, metrics FROM forecast_data WHERE user_id = %s", (user_id,))
    files = cur.fetchall()

    data = []

    # aggregate data into list of objects with 3 values each
    i=1
    for file in files:
        data.append({
            'id':i,
            'title': file[0], 
            'file_name': file[1],
            'attribute': file[2], 
            'frequency': file[3],
            'period': file[4], 
            'actual_txt': file[5],
            'forecast_txt': file[6], 
            'metrics': file[7],
            })
        i+=1
    
    # print(data)

    return jsonify({'success': True, 'data': data})

@app.route('/delete_file', methods=['POST'])
def delete_file():
    # get the request data
    user_id = request.form['user_id']
    file_name = request.form['file_name']
    print(f'user_id : {user_id}\nfile_name:{file_name}')
    cur.execute(f"DELETE FROM user_csv_files WHERE user_id = %s AND file_name = %s", (user_id, file_name))
    
    conn.commit()
    
    return jsonify({'success': True, 'message': 'File Deleted Successfully!!'})

@app.route('/delete_prediction', methods=['POST'])
def delete_prediction():
    user_id = request.form['user_id']
    file_name = request.form['file_name']
    title = request.form['title']
    attribute = request.form['attribute']
    frequency = request.form['frequency']
    period = request.form['period']
    
    print(f'user_id : {user_id}\ntitle : {title}\nfile_name : {file_name}\nattribute : {attribute}\nfrequency : {frequency}\nperiod : {period}')
    
    cur.execute(f"DELETE FROM forecast_data WHERE user_id = %s AND file_name = %s AND title = %s AND attribute=%s AND frequency=%s AND period=%s", 
                (user_id, file_name, title, attribute, frequency, period))
    
    conn.commit()
    
    return jsonify({'success': True, 'message': 'File Deleted Successfully!!'})

@app.route('/get_headers', methods=['POST'])
def get_headers():
    user_id = request.form['user_id']
    file_name = request.form['file_name']

    cur.execute("SELECT file_data FROM user_csv_files WHERE user_id = %s AND file_name=%s", (user_id, file_name))
    bin_file = cur.fetchone()

    df = pd.read_csv(io.BytesIO(bin_file[0]))
    columns = '-'.join(df.columns)

    return jsonify({'success': True, 'message': columns})

@app.route('/forecast', methods=['POST'])
def forecast_now():
    user_id = request.form['user_id']
    file_name = request.form['file_name']
    col_index = int(request.form['col_index'])
    frequency = request.form['frequency']
    period = int(request.form['period'])
    
    print(f'user_id : {user_id}\nfile_name : {file_name}\ncol_index:{col_index}\n'+
          f'frequency : {frequency}\nperiod : {period}')
    
    cur.execute("SELECT file_data FROM user_csv_files WHERE user_id = %s AND file_name=%s", (user_id, file_name))
    bin_file = cur.fetchone()

    df = pd.read_csv(io.BytesIO(bin_file[0]))
    # print(df.head())
    
    result = forecast(df,col_index,frequency,period)
    forecast_df = result['forecast_df']
    
    return jsonify({'success': True, 
                        'message': 'File is being Processed!!',
                        'forecast_df': forecast_df.to_csv(), 
                        'df': result['act_df'].to_csv(),
                        'attribute' : result['attribute'],
                        'metrics':result['metrics'],
                        'quantity':str(result['quantity']),
                        'revenue':str(result['revenue'])
                   })

@app.route("/send_mail",methods=['POST'])
def send_mail():
    name = request.form['name']
    type = request.form['type']
    to_mail = request.form['to_mail']
    message = request.form['message']
    
    body = "Hey, Thank you for reaching out us!!"
    if type=='1':
        body = "Hey!! Thank you for your support!! You appreciation means a lot to us!!"
    elif type=='2':
        body = "Hey!! We received your query!! Out Team will contact you sooner or later!!"
    else:
        body = "Hey!! Sorry for your situation. We will sort out the issue soon!!"
    
    type_str = ""
    if type=='1':
        type_str = 'Appreciation'
    elif type=='2':
        type_str = 'Query'
    else:
        type_str = "Complaint"
        
    
    body_1 = f"From : {name}\nEmail : {to_mail}\nType : {type_str}\nMessage : {message}"
    
    try:
        msg_to_user = Message('Team ForecastPro', sender = '01kumaragupta@gmail.com', recipients = [to_mail])
        msg_to_admin = Message('User Message', sender = '01kumaragupta@gmail.com', recipients = ['20cs166@kpriet.ac.in'])
        
        msg_to_user.body = body
        msg_to_admin.body = body_1
        
        mail.send(msg_to_admin)
        mail.send(msg_to_user)
        return jsonify({'success': True, 'message': 'Message Sent Successfully'})
    except Exception as e: 
        print(e)
        return jsonify({'success': False, 'message': 'Sending Failed!!'})

if __name__ == '__main__':
    app.run(debug=True)
    
