
# 🛡️ Safe Guard – Women’s Safety Web App

**Safe Guard** is a web application designed to help women stay safe by enabling real-time SOS alerts and visualizing high-risk zones across Delhi using a crime dataset. The app allows users to add emergency contacts, send instant alerts with live location, and view a map of danger zones based on crime statistics.
![image](https://github.com/user-attachments/assets/c555d24e-acf1-4daa-8765-99934475600f)

---

## 🔍 Features

### 🚨 SOS Alert System
- Users can add multiple **emergency contacts**.
- When in danger, they can send an **SOS alert** with their **real-time location** to all contacts via email.
- Uses **Geolocation API** to fetch accurate coordinates.
- Integrates with **EmailJS** to deliver alerts instantly.

### 🗺️ Delhi Crime Map
- Displays a **Leaflet.js map** with color-coded danger zones across Delhi.
- Based on a **static analysis** of the [Delhi Crime Dataset](https://www.kaggle.com/datasets/viratsharma18245/delhi-crime-dataset).
- Risk is determined by the **`totalcrime`** number at each location:
  - 🔴 **Red**: High Risk (total crime > 500)
  - 🟠 **Orange**: Moderate Risk (total crime > 200)
  - 🟢 **Green**: Low Risk (total crime ≤ 200)
![image](https://github.com/user-attachments/assets/ab2cb133-60dc-4fa8-b11f-5f1752930289)
![image](https://github.com/user-attachments/assets/bd2c0425-7bb5-4849-b4ee-6f8ff9c9ba9d)
![image](https://github.com/user-attachments/assets/59acd27f-19ae-4cf5-a1fa-8ff0b423cb9c)

---

## 📊 Dataset Insight

- Source: [Kaggle - Delhi Crime Dataset](https://www.kaggle.com/datasets/viratsharma18245/delhi-crime-dataset)
- Used to determine crime intensity by location.
- Processed in JavaScript to dynamically assign marker colors based on `totalcrime`.

```js
let color = 'green';
if (total > 500) {
  color = 'red';
} else if (total > 200) {
  color = 'orange';
}
```

---

## 🧠 Future Improvements

- Add SMS support for SOS.
- Enable real-time crime heatmaps.
- Show alerts for nearby high-risk zones based on user’s current location.
- Store user and contact data securely in a database.
- Add voice-activated emergency trigger.

---

## 🧑‍💻 Author

**Arman Singh**  
Project built for raising awareness and improving women's safety through technology.

---

## 🤖 AI Assistance

Some parts of this project (e.g., content drafting and debugging assistance) were supported using AI-based tools like ChatGPT, under my guidance and supervision.
