# AIOT Diabetes Prediction Project

An AIoT (Artificial Intelligence of Things) system for diabetes prediction and monitoring using machine learning models integrated with IoT sensor data from ThingSpeak.

## Overview

This project combines machine learning for diabetes risk prediction with IoT technology to create a comprehensive health monitoring dashboard. The system uses sensor data collected via ThingSpeak and applies trained ML models to predict diabetes risk in real-time.

## Features

- **Real-time IoT Monitoring**: Continuous tracking of glucose levels, blood pressure, and insulin through IoT sensors
- **Smart Diabetes Prediction**: Advanced machine learning algorithms (Decision Tree, Logistic Regression) for accurate diabetes risk assessment
- **Data Analysis & Visualization**: Comprehensive analysis of health readings with detailed statistics and reports
- **Secure Web Dashboard**: Bilingual (Arabic/English) user interface with JWT authentication
- **ThingSpeak Integration**: Seamless connection to IoT data platform for sensor data collection
- **Prediction History**: Track and review past predictions and health trends

## Project Structure

```
├── data/                          # Dataset files
│   ├── diabetes.csv              # Main diabetes dataset
│   └── diabetes_prediction_dataset.csv
├── docs/                         # Documentation
├── noteBooks/                    # Jupyter notebooks for data exploration and modeling
│   ├── data1_explor.ipynb       # Data exploration
│   ├── data2_explor.ipynb       # Additional data analysis
│   ├── logistic_reg.ipynb       # Logistic regression model
│   ├── model_comparison.ipynb   # Model comparison and evaluation
│   └── save_model.ipynb         # Model training and saving
├── output/                       # Trained models and results
│   └── models/                  # Saved ML models
├── ThingSpeak_dashboard/         # Main application
│   ├── backend/                 # FastAPI backend
│   │   ├── main.py             # API endpoints
│   │   ├── predictor.py        # ML prediction service
│   │   ├── thingspeak.py       # ThingSpeak client
│   │   ├── auth.py             # Authentication
│   │   └── database.py         # Database operations
│   └── frontend/                # Next.js frontend
│       ├── src/app/            # Pages and components
│       └── components/         # React components
└── README.md                    # This file
```

## Technology Stack

### Backend
- **FastAPI**: High-performance API framework
- **Scikit-learn**: Machine learning models
- **MongoDB**: Database for user data and predictions
- **ThingSpeak API**: IoT data integration

### Frontend
- **Next.js**: React framework for the dashboard
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library

### Machine Learning
- **Pandas & NumPy**: Data processing
- **Scikit-learn**: Model training and evaluation
- **Jupyter Notebook**: Data exploration and prototyping

## Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB
- Git

### Backend Setup
```bash
cd ThingSpeak_dashboard/backend
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd ThingSpeak_dashboard/frontend
npm install
```

## Usage

### Running the Backend
```bash
cd ThingSpeak_dashboard/backend
python main.py
```
The API will be available at `http://localhost:8000`

### Running the Frontend
```bash
cd ThingSpeak_dashboard/frontend
npm run dev
```
The dashboard will be available at `http://localhost:3000`

### Model Training
Use the Jupyter notebooks in the `noteBooks/` directory to explore data and train models:
- `data1_explor.ipynb` & `data2_explor.ipynb`: Data exploration
- `logistic_reg.ipynb`: Logistic regression implementation
- `model_comparison.ipynb`: Compare different ML models
- `save_model.ipynb`: Train and save the final model

## Configuration

Update the following configuration files:
- `ThingSpeak_dashboard/backend/config.py`: API settings, database connection, ThingSpeak credentials
- `ThingSpeak_dashboard/frontend/src/lib/api.ts`: API endpoints

## Dataset

The project uses diabetes datasets containing health metrics like:
- Glucose levels
- Blood pressure
- Insulin levels
- BMI
- Age
- Other relevant health indicators

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. Please ensure compliance with data privacy regulations when handling health data.

## Contact

For questions or contributions, please open an issue on GitHub.