from flask import Flask, request, jsonify
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import requests
from io import BytesIO
import numpy as np
from scipy.spatial import distance
from flask_cors import CORS

# ResNet50モデルをロード（事前学習済み）
model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
model.eval()  # 推論モード

app = Flask(__name__)
CORS(app)

# 画像の前処理
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# 画像から特徴ベクトルを抽出する関数
def get_vector(image_data):
    img = Image.open(BytesIO(image_data))
    img_t = preprocess(img)
    batch_t = torch.unsqueeze(img_t, 0)
    
    with torch.no_grad():
        features = model(batch_t)
    return features.numpy().flatten()

@app.route('/compare-images', methods=['POST'])
def compare_images():
    # リクエストボディからJSONデータを取得
    data = request.get_json()
    if not data or 'image_url1' not in data or 'image_url2' not in data:
        return jsonify({"error": "Both image URLs are required."}), 400

    image_url1 = data['image_url1']
    image_url2 = data['image_url2']
    
    # URLから画像をダウンロード
    try:
        response1 = requests.get(image_url1)
        response1.raise_for_status()  # エラー時はここで例外が発生
        image_data1 = response1.content
        
        response2 = requests.get(image_url2)
        response2.raise_for_status()
        image_data2 = response2.content
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Failed to download images."}), 500
    
    # それぞれの画像から特徴ベクトルを抽出
    img_vec1 = get_vector(Image.open(BytesIO(image_data1)))
    img_vec2 = get_vector(Image.open(BytesIO(image_data2)))
    
    # ベクトル間の距離を計算
    dist = distance.euclidean(img_vec1, img_vec2)
    
    # 類似度スコア（距離）を返す
    return jsonify({"similarity_score": round(dist, 2)})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port="3000", debug=True)
