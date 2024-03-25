import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
from scipy.spatial import distance

# ResNet50モデルをロード（事前学習済み）
model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
# EfficientNetB0
# model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)
# MobileNetV3
# model = models.mobilenet_v3_large(weights=models.MobileNet_V3_Large_Weights.DEFAULT)
model.eval()  # 推論モード

# 画像の前処理
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# 画像をロードし、前処理を実行
def get_vector(image_path):
    img = Image.open(image_path)
    img_t = preprocess(img)
    batch_t = torch.unsqueeze(img_t, 0)
    
    # 特徴ベクトルを抽出
    with torch.no_grad():
        features = model(batch_t)
    return features.numpy().flatten()

# 画像から特徴ベクトルを抽出
desk_vec = get_vector("./data/desk_1.jpeg")
desk_2_vec = get_vector("./data/desk_2.jpeg")
desk_3_vec = get_vector("./data/desk_3.jpeg")

# ベクトル間の距離を計算
dist0 = distance.euclidean(desk_vec, desk_vec)
dist1 = distance.euclidean(desk_vec, desk_2_vec)
dist2 = distance.euclidean(desk_vec, desk_3_vec)

print("Same Distance =", round(dist0, 2))
print("Another Distance =", round(dist1, 2))
print("Another Distance =", round(dist2, 2))
