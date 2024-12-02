from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/save_to_txt', methods=['POST'])
def save_to_txt():
    try:
        data = request.json  # 接收 JSON 數據
        with open('/data/lesson_plan.txt', 'a', encoding='utf-8') as file:
            file.write(str(data) + '\n')  # 寫入文字檔
        return jsonify({'message': 'Data saved successfully!'}), 200
    except Exception as e:
        return jsonify({'message': f'Error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
