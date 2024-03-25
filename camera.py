import cv2
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
from scipy.spatial import distance
import numpy as np

# 事前に比較する画像の特徴ベクトルをロードまたは計算
# ResNet50モデルをロード（事前学習済み）
model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
model.eval()  # 推論モード

# 画像の前処理関数
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# 画像から特徴ベクトルを抽出する関数
def get_vector(image):
    img_t = preprocess(image)
    batch_t = torch.unsqueeze(img_t, 0)
    
    with torch.no_grad():
        features = model(batch_t)
    return features.numpy().flatten()

# 比較対象の画像の特徴ベクトルを事前に計算
reference_img = Image.open("./data/desk_4.jpeg")
reference_vec = get_vector(reference_img)

# カメラからの映像をリアルタイムで処理
cap = cv2.VideoCapture(1)  # 0はカメラのデバイスID

while True:
    ret, frame = cap.read()  # フレームを取得
    if not ret:
        break

    # OpenCVの画像をPIL画像に変換
    frame_pil = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

    # 現在のフレームの特徴ベクトルを抽出
    current_vec = get_vector(frame_pil)

    # 特徴ベクトル間の距離を計算
    dist = distance.euclidean(reference_vec, current_vec)
    dist_text = f"Distance: {dist:.2f}"

    # 距離をフレームにテキストとして表示
    cv2.putText(frame, dist_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    # フレームを表示
    cv2.imshow("Camera", frame)

    # 'q'キーが押されたらループから抜ける
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# 後処理
cap.release()
cv2.destroyAllWindows()
