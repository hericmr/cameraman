from flask import Flask, render_template, Response
from multiprocessing import Process
import cv2

app = Flask(__name__)

cameras = {
    "0": {"lugar": "Canal 6", "url": "https://egov.santos.sp.gov.br/santosmapeada/css/img/cameras/cam1593/snap_c1.jpg?1677157043869"},
    "1": {"lugar": "Canoagem", "url": "https://egov.santos.sp.gov.br/santosmapeada/css/img/cameras/cam1464/snap_c1.jpg?1677191520757"},
    "2": {"lugar": "Praca do Sapo", "url": "https://egov.santos.sp.gov.br/santosmapeada/css/img/cameras/cam1517/snap_c1.jpg?1677240440260"},
    "3": {"lugar": "Travessia da balsa", "url": "https://egov.santos.sp.gov.br/santosmapeada/css/img/cameras/cam1455/snap_c1.jpg?1677248602110"},
    "4": {"lugar": "Epitacio Pessoa com Oswaldo Chocrane", "url": "https://egov.santos.sp.gov.br/santosmapeada/css/img/cameras/cam1584/snap_c1.jpg?1677311079649"},
    "5": {"lugar": "Epitacio Pessoa", "url": "https://egov.santos.sp.gov.br/santosmapeada/css/img/cameras/cam1578/snap_c1.jpg?1677311184499"},
    "6": {"lugar": "CPE", "url": "https://egov.santos.sp.gov.br/santosmapeada/css/img/cameras/cam1561/snap_c1.jpg?1677311246793"},
    "7": {"lugar": "Canal 4", "url": "https://egov.santos.sp.gov.br/santosmapeada/css/img/cameras/cam1591/snap_c1.jpg?1677311286046"},
    "8": {"lugar": "Rodoviaria", "url": "https://egov.santos.sp.gov.br/santosmapeada/css/img/cameras/cam1588/snap_c1.jpg?1677694193298"}
}

def generate_frames(url):
    cap = cv2.VideoCapture(url)
    while True:
        success, frame = cap.read()
        if not success:
            break
        _, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    cap.release()

@app.route('/')
def index():
    return render_template('index.html', cameras=cameras)

@app.route('/video_feed/<int:camera_id>')
def video_feed(camera_id):
    if str(camera_id) in cameras:
        url = cameras[str(camera_id)]["url"]
        return Response(generate_frames(url), mimetype='multipart/x-mixed-replace; boundary=frame')
    else:
        return "Câmera não encontrada."

@app.route('/view/<int:camera_id>')
def view(camera_id):
    if str(camera_id) in cameras:
        lugar = cameras[str(camera_id)]["lugar"]
        return render_template('view.html', lugar=lugar, camera_id=camera_id)
    else:
        return "Câmera não encontrada."

if __name__ == '__main__':
    app.run(debug=True)
