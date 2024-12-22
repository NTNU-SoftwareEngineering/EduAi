from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

# 資料庫連線設定
def get_db_connection():
    return mysql.connector.connect(
        host="db",  # 使用在 docker-compose 中定義的 db 服務名稱
        user="moodleuser",  # 使用 moodleuser
        password="yourpassword",  # 使用你的密碼
        database="moodle_db"  # 使用 moodle_db 資料庫
    )

# API 路由
@app.route('/api/lesson_plan', methods=['POST'])
def save_lesson_plan():
    data = request.json
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
            INSERT INTO lesson_plans 
            (name, author, target, time, motivation, place, core_value, core_importance, source, facilities, goal) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            data["name"], data["author"], data["target"], data["time"], data["motivation"],
            data["place"], data["coreValue"], data["coreImportance"], data["source"], 
            data["facilities"], data["goal"]
        )
        cursor.execute(query, values)
        conn.commit()
        return jsonify({"message": "教案已成功儲存！"}), 200
    except Error as e:
        return jsonify({"message": f"資料儲存失敗: {str(e)}"}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
