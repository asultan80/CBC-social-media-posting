# 📢 CBC Social Media Posting System
A web-based system that allows content producers to **post messages, images, and videos** to **multiple social media platforms** (Twitter, Instagram, Bluesky) from a single interface.

## 🚀 Features
✅ **Post messages to multiple platforms at once**  
✅ **Attach optional images and videos**  
✅ **User selects platforms before posting**  
✅ **NestJS backend with API for social media integration**  
✅ **Angular frontend for user-friendly interface**  

---

## 📁 Project Structure
```
cbc-social-media/
│── backend/ (NestJS)
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── post/
│   │   │   ├── post.model.ts
│   │   │   ├── post.dto.ts
│   │   │   ├── post.controller.ts
│   │   │   ├── post.service.ts
│   │   ├── platform/
│   │   │   ├── platform.interface.ts
│   │   │   ├── twitter.service.ts
│   │   │   ├── instagram.service.ts
│   │   │   ├── bluesky.service.ts
│   ├── .env
│   ├── package.json
│
│── frontend/ (Angular)
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── post-form/
│   │   │   ├── app.component.ts
│   │   ├── assets/
│   ├── angular.json
│   ├── package.json
│
│── README.md
```

---

## ⚙️ **Step 1: Install Prerequisites**
Make sure you have the following installed:
- **[Node.js (LTS)](https://nodejs.org/en)**
- **npm (Comes with Node.js)**
- **[Angular CLI](https://angular.io/cli)**
  ```bash
  npm install -g @angular/cli
  ```
- **[NestJS CLI](https://docs.nestjs.com/)**
  ```bash
  npm install -g @nestjs/cli
  ```

---

## 📡 **Step 2: Backend Setup (NestJS)**
### **1️⃣ Install Dependencies**
```bash
cd backend
npm install
```

### **2️⃣ Configure Environment Variables**
Create a `.env` file inside the `backend` directory and add:
```ini
- TWITTER_API_KEY (from your Twitter Developer account)
- TWITTER_API_SECRET (from your Twitter Developer account)
- TWITTER_ACCESS_TOKEN (from your Twitter Developer account)
- TWITTER_ACCESS_SECRET (from your Twitter Developer account)
- BLUESKY_HANDLE (your Bluesky handle)
- BLUESKY_OAUTH_TOKEN (from your Bluesky developer credentials)
- REDIS_HOST (e.g., 127.0.0.1)
- REDIS_PORT (e.g., 6379)
```

### **3️⃣ Start the Backend**
```bash
npm run start:dev
```
🚀 **Backend API is now running on `http://localhost:3000`**

---

## 🎨 **Step 3: Frontend Setup (Angular)**
### **1️⃣ Install Dependencies**
```bash
cd frontend
npm install
```

### **2️⃣ Start the Frontend**
```bash
ng serve
```
🚀 **Frontend is now running on `http://localhost:4200`**

---

## 📌 **Step 4: How to Use**
1️⃣ Open **`http://localhost:4200`** in your browser  
2️⃣ **Enter a message** in the text area  
3️⃣ **Select one or more social media platforms**  
4️⃣ **Upload an image or video** (optional)  
5️⃣ Click **"Post"** to publish content to the selected platforms  

---

## 🛠 **Step 5: API Reference**
### **POST `/post` - Publish a Social Media Post**
#### **📌 Request (Form Data)**
```json
{
  "message": "This is a test post!",
  "platforms": ["twitter", "instagram"],
  "image": "image-file.jpg",
  "video": "video-file.mp4"
}
```
#### **📌 Response**
```json
{
  "twitter": { "success": true, "data": "Tweet posted successfully" },
  "instagram": { "success": true, "data": "Instagram post created" }
}
```

---

## ✅ **Testing the Application**
### **1️⃣ Check API Requests**
After posting, you can **verify API requests** using:
```bash
curl -X POST http://localhost:3000/post -H "Content-Type: multipart/form-data" -F "message=This is a test post" -F "platforms[]=twitter" -F "image=@/path/to/image.jpg"
```

### **2️⃣ Debugging**
- If the post doesn’t go through, check **backend logs**:
  ```bash
  cd backend
  npm run start:dev
  ```
- If the frontend isn’t loading, **restart Angular**:
  ```bash
  cd frontend
  ng serve
  ```

---

## 🏁 **Final Notes**
This project is a **prototype** that allows content creators to **post messages, images, and videos** to multiple social media platforms from a single dashboard.

🎯 **Future Enhancements**:
- **OAuth authentication** for each platform  
- **Scheduled posts**  
- **Additional platforms (Facebook, LinkedIn, etc.)**  

🚀 **Happy coding!**

## Deployment

To deploy the frontend in production:
- Run the production build:
  ```bash
  npm run build -- --configuration production
  ```
- The Dockerfile builds the Angular app and serves the static files through NGINX on port 80.
- After starting via Docker (`docker-compose up --build`), access the app at http://<your-server-ip>:80.
