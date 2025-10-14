Download the Model from here : [Google Drive](https://drive.google.com/uc?export=download&id=1WD-V10oRMJxiPzJTa_hahGBeTsrXKjt-)

Add model in backend/app/model/[your model here]

Pawdentify
==========

AI-powered dog breed identification and information platform

Overview
--------

Pawdentify is a web application that uses artificial intelligence to identify dog breeds from images and provides comprehensive breed information. Built with React and FastAPI, it offers instant breed identification with 89% accuracy across 120+ breeds.

Features
--------

Core Functionality
------------------

-   AI Breed Identification - Upload a photo and get instant breed identification in under 3 seconds

-   Breed Database - Browse and search through 120+ dog breeds

-   Detailed Breed Information - Access comprehensive data on physical traits, temperament, care requirements, health, and nutrition

-   User Dashboard - Track prediction history and manage pet profiles

-   Veterinary Locator - Find nearby veterinary services

User Experience
---------------

-   Multi-language Support - English, Hindi, Urdu, and French

-   Dark/Light Mode - Toggle between themes

-   User Authentication - Secure login via Clerk

Technology Stack
----------------

Frontend
--------

-   React 18 with Vite

-   Tailwind CSS

-   Framer Motion

-   React Router v6

-   i18next for internationalization

-   Clerk for authentication

Backend
-------

-   Python 3.10+ with FastAPI

-   MongoDB database

-   TensorFlow for ML

-   Cloudinary for image storage

Installation
------------

Prerequisites
-------------

-   Node.js 16+

-   Python 3.10+

-   MongoDB

-   Clerk account

-   Cloudinary account

-   MapMyIndia account

Setup
-----

Branch Name : DevashishMishra

Clone repository
```
git clone https://github.com/Springboard-Internship-2025/AI-Model-for-Dog-Breed-Detection-and-Information-Generation_September_2025.git
cd pawdentify
```

Frontend setup
```
cd frontend
npm install
npm run dev
```

Backend setup
```
cd backend
conda env create -f requirements.yml
conda activate <env-name>   # use the name defined inside requirements.yml
conda list
uvicorn backend.main:app --reload

```
Add MONGODB_URI, CLERK_SECRET_KEY, ClOUDINARY, MAPMYINDIA credentials
```
uvicorn main:app --reload
```

Environment Variables
---------------------

Frontend .env:
```
#Clerk Publishable Key here
VITE_CLERK_PUBLISHABLE_KEY=
VITE_API_URL=http://localhost:8000

#MapMyIndai sdk key here
VITE_MAPPLS_MAP_SDK_KEY= 
```

Backend .env:
```
MODEL_PATH=./app/model/efficientnetv2b2_320.keras
CONFIDENCE_THRESHOLD=0.6
ALLOWED_EXTENSIONS=png,jpg,jpeg

MONGODB_URI=mongodb://localhost:27017
DATABASE_NAME=dogbreed_db

#Cloudinary Keys here
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

#MapMyIndia keys here
MAPPLS_REST_API_KEY=
MAPPLS_CLIENT_ID=
MAPPLS_CLIENT_SECRET=
```

Roadmap
-------

-   Multi-breed detection

-   Mobile native apps

-   Community forums

-   Health tracking

-   Breed comparison

-   Personalized recommendations

Statistics
----------

-   Breeds: 120+

-   Accuracy: 89%

-   Response Time: < 3 seconds

-   Languages: 4

* * * * *

Built for dog lovers worldwide.
