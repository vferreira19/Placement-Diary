from flask import Flask, render_template, request, redirect, url_for, jsonify
import psycopg2
from connection import create_connection, insert, select, delete, drop

app = Flask(__name__)

@app.route('/')
def home():
    print('Flask app running')
    return render_template('index.html')

@app.route('/process_data', methods=['POST'])
def process_data():
    print('Processing data')
    try:
        data = request.get_json()

        date = data.get('date')
        work_description = data.get('work_description')
        experience_description = data.get('experience_description')
        competency = data.get('competency')

        
        insert(date, work_description, experience_description, competency)
        
        return jsonify({'status': 'success'})
        

    except Exception as e:
        
        return f'Error processing data: {str(e)}', 500

@app.route('/retrieve_data', methods=['POST'])
def retrieve_data():
    data = select(request.form['date'])

    if data is not None:  # Check if data is not None (i.e., row exists)
        return jsonify(data[0])
    else:
        return jsonify('')  # Return an empty string if the row doesn't exist

@app.route('/delete_data', methods=['POST'])
def delete_data():
    data = request.get_json()
    date = data.get('date')
    
    delete(date)

    print('data deleted')
    return jsonify({'status': 'success'})
    
@app.route('/clear_calendar')
def clear_calendar():
    drop()
    print('Table deleted')
    
    return jsonify({'message': 'Table deleted'})

def create_table():
    connection = create_connection()
    cursor = connection.cursor()

    try:
        query = """
        CREATE TABLE IF NOT EXISTS diary_entry (
            date DATE PRIMARY KEY,
            text1 TEXT,
            text2 TEXT,
            text3 TEXT
        )
        """
        cursor.execute(query)
        connection.commit()
    finally:
        cursor.close()
        connection.close()


if __name__ == '__main__':
    app.run(debug=True)
