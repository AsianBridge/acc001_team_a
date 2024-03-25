import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
from flask import Flask, request, jsonify
import requests
from io import BytesIO
import numpy as np
from scipy.spatial import distance

# ResNet50モデルをロード（事前学習済み）
model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
model.eval()  # 推論モード

app = Flask(__name__)

# 画像の前処理
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# 画像から特徴ベクトルを抽出する関数
def get_vector(img):
    img_t = preprocess(img)
    batch_t = torch.unsqueeze(img_t, 0)
    
    with torch.no_grad():
        features = model(batch_t)
    return features.numpy().flatten()

@app.route('/compare-image', methods=['POST'])
def compare_image():
    # リクエストから画像のURLを取得
    data = request.get_json()
    image_url = data['image_url']
    
    # URLから画像をダウンロード
    response = requests.get(image_url)
    img = Image.open(BytesIO(response.content))
    
    # ローカルのdesk_1.jpeg画像をロード
    desk_img = Image.open("./data/desk_1.jpeg")
    
    # それぞれの画像から特徴ベクトルを抽出
    img_vec = get_vector(img)
    desk_vec = get_vector(desk_img)
    
    # ベクトル間の距離を計算
    dist = distance.euclidean(desk_vec, img_vec)
    
    # 類似度スコア（距離）を返す
    return jsonify({"similarity_score": round(dist, 2)})

if __name__ == '__main__':
    app.run(debug=True)
