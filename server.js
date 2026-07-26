require("dotenv").config()

const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]); 

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const User = require("./models/User");
const Study = require("./models/Study");
const File = require("./models/File");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

app.use(cors({
  origin: "*"
}));

app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* =========================
   VERIFY TOKEN MIDDLEWARE
========================= */
const verifyToken = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).send("No token");
  }
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "secret");
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(401).send("Invalid token");
  }
};

/* =========================
   MULTER STORAGE
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

/* =========================
   UPLOAD FILE API
========================= */
app.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
  try {
    console.log(req.file);
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const newFile = new File({
      userId: req.userId,
      filename: req.file.filename
    });
    await newFile.save();
    res.status(200).json({ message: "File uploaded successfully" });
  } catch (err) {
    console.log("UPLOAD ERROR =>", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

/* =========================
   GET FILES API
========================= */
app.get("/files", verifyToken, async (req, res) => {
  try {
    const files = await File.find({ userId: req.userId });
    res.json(files);
  } catch (err) {
    console.log(err);
    res.status(500).send("Failed");
  }
});

/* =========================
   DELETE FILE API
========================= */
app.delete("/delete-file/:filename", verifyToken, async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "uploads", filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    await File.deleteOne({ filename: filename, userId: req.userId });
    res.json({ message: "File deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).send("Delete failed");
  }
});

/* =========================
   SIGNUP API
========================= */
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    await user.save();
    res.send("User created");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* =========================
   LOGIN API
========================= */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Wrong password");
    }
    const token = jwt.sign({ id: user._id }, "secret");
    res.json({ token });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* =========================
   ADD STUDY API
========================= */
app.post("/add-study", verifyToken, async (req, res) => {
  try {
    const data = new Study({
      userId: req.userId,
      subject: req.body.subject,
      hours: req.body.hours,
      date: req.body.date
    });
    await data.save();
    res.send("Saved");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* =========================
   GET STUDY API
========================= */
app.get("/get-study", verifyToken, async (req, res) => {
  try {
    const data = await Study.find({ userId: req.userId });
    res.json(data);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* =========================
   DELETE STUDY API
========================= */
app.delete("/delete-study/:id", verifyToken, async (req, res) => {
  try {
    await Study.findByIdAndDelete(req.params.id);
    res.send("Deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* =========================
   UPDATE STUDY API
========================= */
app.put("/update-study/:id", verifyToken, async (req, res) => {
  try {
    await Study.findByIdAndUpdate(
      req.params.id,
      {
        subject: req.body.subject,
        hours: req.body.hours,
        date: req.body.date
      }
    );
    res.send("Updated");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* =========================
   SUGGESTION API
========================= */
app.get("/suggestion", verifyToken, async (req, res) => {
  try {
    const data = await Study.find({ userId: req.userId });
    if (data.length === 0) {
      return res.json({ suggestion: "Start studying to see insights 📊" });
    }

    let subjectMap = {};
    data.forEach(item => {
      if (!subjectMap[item.subject]) {
        subjectMap[item.subject] = 0;
      }
      subjectMap[item.subject] += Number(item.hours);
    });

    let leastSubject = null;
    let minHours = Infinity;
    for (let sub in subjectMap) {
      if (subjectMap[sub] < minHours) {
        minHours = subjectMap[sub];
        leastSubject = sub;
      }
    }

    let suggestion = "";
    if (minHours < 2) {
      suggestion = `⚠️ You are neglecting ${leastSubject}. Spend more time on it.`;
    } else if (minHours < 5) {
      suggestion = `📘 Try to improve your consistency in ${leastSubject}.`;
    } else {
      suggestion = `🔥 Great job! You are maintaining all subjects well.`;
    }
    res.json({ suggestion });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/* =========================
   AI STUDY PLAN GENERATOR API (FIXED)
========================= */
app.post("/generate-study-plan", verifyToken, (req, res) => {
  try {
    const {
      subject,
      dailyHours,
      hours,         
      duration,
      studyDuration, 
      goal,
      level
    } = req.body;

    const finalHours = dailyHours || hours;
    const finalDuration = duration || studyDuration;

    if (!subject || !finalHours || !finalDuration || !goal || !level) {
      return res.status(400).json({
        message: "Please fill all fields"
      });
    }

    const topics = {
      "React.js": [
        "HTML and CSS Basics", "JavaScript Fundamentals", "ES6 Concepts", 
        "React Components", "JSX", "Props and State", "Event Handling", 
        "React Hooks", "useEffect", "React Router", "API Integration", 
        "Forms and Validation", "CRUD Operations", "Build a React Project", "Final React Project"
      ],
      "Node.js": [
        "JavaScript Fundamentals", "Node.js Introduction", "Modules", 
        "File System", "NPM", "Express.js", "REST APIs", "Middleware", 
        "MongoDB Connection", "CRUD APIs", "Authentication", "JWT", 
        "File Upload", "Error Handling", "Build a Node.js Project"
      ],
      "Python": [
        "Python Basics", "Variables and Data Types", "Conditions", "Loops", 
        "Functions", "Lists and Tuples", "Dictionaries", "OOP Concepts", 
        "File Handling", "Exception Handling", "Modules", "Database Connectivity", 
        "APIs", "Practice Projects", "Final Python Project"
      ]
    };

    const cleanSubject = subject.trim().toLowerCase();
    let selectedTopics = [];

    if (cleanSubject.includes("react")) {
      selectedTopics = topics["React.js"];
    } else if (cleanSubject.includes("node")) {
      selectedTopics = topics["Node.js"];
    } else if (cleanSubject.includes("python")) {
      selectedTopics = topics["Python"];
    } else {
      selectedTopics = [
        `${subject} Fundamentals`,
        `${subject} Core Concepts`,
        `${subject} Intermediate Concepts`,
        `${subject} Advanced Concepts`,
        `${subject} Practice`,
        `${subject} Mini Project`,
        `${subject} Final Project`
      ];
    }

    const plan = [];
    for (let i = 0; i < Number(finalDuration); i++) {
      const topic = selectedTopics[i % selectedTopics.length];
      plan.push({
        day: i + 1,
        topic: topic,
        hours: Number(finalHours),
        task: `Learn ${topic} and practice with examples`
      });
    }

    res.status(200).json({
      message: "Study plan generated successfully",
      plan,
      goal,
      level
    });

  } catch (error) {
    console.log("STUDY PLAN ERROR:", error);
    res.status(500).json({
      message: "Failed to generate study plan"
    });
  }
});

/* =========================
   MONGODB CONNECT
========================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

/* =========================
   START SERVER
========================= */
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});