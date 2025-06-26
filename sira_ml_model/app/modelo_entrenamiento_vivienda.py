import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import VotingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
import joblib
import os

# Configuración
tipo_seguro = "vivienda"
csv_path = "data/vivienda.csv"
output_path = f"app/modelos/{tipo_seguro}"

# Cargar dataset
df = pd.read_csv(csv_path, encoding="latin1")

# Codificar la variable objetivo
label_encoder = LabelEncoder()
df['nombre_plan_encoded'] = label_encoder.fit_transform(df['nombre_plan'])
joblib.dump(label_encoder, "label_encoder.pkl")

# Features y target
X = df.drop(columns=['nombre_plan', 'nombre_plan_encoded'])
y = df['nombre_plan_encoded']
X = pd.get_dummies(X)

# División de datos
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Modelos base
xgb = XGBClassifier(use_label_encoder=False, eval_metric='mlogloss')
rf = RandomForestClassifier(n_estimators=100, random_state=42)
lr = LogisticRegression(max_iter=500)

# Voting Ensemble
voting_clf = VotingClassifier(
    estimators=[('xgb', xgb), ('rf', rf), ('lr', lr)],
    voting='soft'  
)

# Entrenamiento
voting_clf.fit(X_train, y_train)

# Guardar modelo
joblib.dump(voting_clf, "modelo_xgb.pkl") 
