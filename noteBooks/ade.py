# %%
# 🧠 Diabetes Type 2 Prediction using Logistic Regression
# =======================================================
# This notebook trains a Logistic Regression model to predict whether a person
# is diabetic or non-diabetic using features like:
# age, BMI, blood glucose level, HbA1c level, blood pressure, etc.
#
# Dataset info:
# Shape: (100000, 9)
# Missing values: 0
# Duplicates: 3854 (will be removed)

# %%
# 1️⃣ Import Libraries
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    classification_report,
    roc_auc_score,
    RocCurveDisplay
)

# %%
# 2️⃣ Load and Explore the Dataset
df = pd.read_csv("diabetes.csv")  # 🔸 Replace with your actual file path

print("✅ Dataset loaded successfully!")
print("Shape:", df.shape)
print(df.head())

# %%
# Basic data info
print("\n--- Data Info ---")
print(df.info())
print("\n--- Missing Values ---")
print(df.isnull().sum())
print("\n--- Duplicate Rows ---")
print("Duplicates:", df.duplicated().sum())

# Drop duplicates
df = df.drop_duplicates()
print("Shape after removing duplicates:", df.shape)

# %%
# 3️⃣ Exploratory Data Analysis (EDA)
plt.style.use("seaborn-v0_8-darkgrid")

# --- Target balance ---
plt.figure(figsize=(5, 4))
sns.countplot(x="diabetes", data=df, palette="pastel")
plt.title("Target Class Distribution (0 = Non-Diabetic, 1 = Diabetic)")
plt.xlabel("Diabetes")
plt.ylabel("Count")
plt.show()

print(df["diabetes"].value_counts(normalize=True) * 100)

# --- Numeric distributions ---
numeric_features = ["age", "bmi", "HbA1c_level", "blood_glucose_level"]
df[numeric_features].hist(bins=30, figsize=(10, 6), color="#1f77b4")
plt.suptitle("Distribution of Numeric Features")
plt.show()

# --- Correlation heatmap ---
plt.figure(figsize=(10, 6))
corr = df.corr(numeric_only=True)
sns.heatmap(corr, annot=True, cmap="coolwarm", fmt=".2f")
plt.title("Correlation Heatmap")
plt.show()

# %%
# 4️⃣ Encode Categorical Variables
categorical_cols = ["gender", "smoking_history"]

for col in categorical_cols:
    print(f"{col}: {df[col].unique()}")

gender_encoder = LabelEncoder()
df["gender"] = gender_encoder.fit_transform(df["gender"])

df = pd.get_dummies(df, columns=["smoking_history"], drop_first=True)

print("\n✅ Categorical variables encoded successfully!")
print(df.head())

# %%
# 5️⃣ Split Data (70% Train, 20% Test, 10% Validation)
X = df.drop("diabetes", axis=1)
y = df["diabetes"]

# 70% train, 30% temporary
X_train, X_temp, y_train, y_temp = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y
)

# Split 30% into 20% test, 10% validation
X_test, X_val, y_test, y_val = train_test_split(
    X_temp, y_temp, test_size=(1 / 3), random_state=42, stratify=y_temp
)

print(f"Train: {X_train.shape}, Test: {X_test.shape}, Validation: {X_val.shape}")

# %%
# 6️⃣ Scale Features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
X_val_scaled = scaler.transform(X_val)

# %%
# 7️⃣ Train Logistic Regression Model
log_model = LogisticRegression(max_iter=1000, random_state=42)
log_model.fit(X_train_scaled, y_train)

# %%
# 8️⃣ Evaluate the Model
y_train_pred = log_model.predict(X_train_scaled)
y_test_pred = log_model.predict(X_test_scaled)
y_val_pred = log_model.predict(X_val_scaled)

train_acc = accuracy_score(y_train, y_train_pred)
test_acc = accuracy_score(y_test, y_test_pred)
val_acc = accuracy_score(y_val, y_val_pred)

print("\n--- Accuracy Scores ---")
print(f"Training Accuracy:   {train_acc:.4f}")
print(f"Testing Accuracy:    {test_acc:.4f}")
print(f"Validation Accuracy: {val_acc:.4f}")

print("\n--- Classification Report (Validation) ---")
print(classification_report(y_val, y_val_pred))

# %%
# 9️⃣ ROC-AUC and Confusion Matrix
y_val_proba = log_model.predict_proba(X_val_scaled)[:, 1]
roc_auc = roc_auc_score(y_val, y_val_proba)
print(f"ROC-AUC (Validation): {roc_auc:.4f}")

RocCurveDisplay.from_estimator(log_model, X_val_scaled, y_val)
plt.title("ROC Curve - Validation Set")
plt.show()

# Confusion Matrix
cm = confusion_matrix(y_val, y_val_pred)
plt.figure(figsize=(5, 4))
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix (Validation)")
plt.show()

# %%
# 🔟 Feature Importance
importance = pd.DataFrame({
    "Feature": X.columns,
    "Coefficient": log_model.coef_[0]
}).sort_values(by="Coefficient", ascending=False)

plt.figure(figsize=(8, 6))
sns.barplot(data=importance, x="Coefficient", y="Feature", palette="coolwarm")
plt.title("Feature Importance (Logistic Regression Coefficients)")
plt.show()

# %%
# ✅ Summary
print("\n✅ Logistic Regression model training complete!")
print(f"Training Accuracy:   {train_acc:.4f}")
print(f"Testing Accuracy:    {test_acc:.4f}")
print(f"Validation Accuracy: {val_acc:.4f}")
print(f"Validation ROC-AUC:  {roc_auc:.4f}")
