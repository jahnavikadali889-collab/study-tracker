import React, { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"


import { Bar, Pie } from "react-chartjs-2"
import AIStudyPlan from "./AIStudyPlan"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

function Dashboard() {
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {  
    const token = localStorage.getItem("token")  
    if (!token) {  
      alert("Please login first")  
      navigate("/")  
    }  
  }, [navigate])  

  const [subject, setSubject] = useState("")  
  const [hours, setHours] = useState("")  
  const [date, setDate] = useState("")  
  const [file, setFile] = useState(null)
  const [files, setFiles] = useState([])
  const [data, setData] = useState([])    
  const [suggestion, setSuggestion] = useState("")    
  const [editId, setEditId] = useState("")  
  const [isEditing, setIsEditing] = useState(false)  
    
  // 🔹 Suggestion function  
  const getSuggestion = useCallback(async () => {  
    try {  
      const res = await axios.get(  
        "https://study-tracker-backend-tocq.onrender.com/suggestion",  
        {  
          headers: {  
            Authorization: `Bearer ${token}`  
          }  
        }  
      )  
      setSuggestion(res.data.suggestion)  
    } catch (err) {  
      console.log(err)  
    }  
  },[token])

  // 🔹 Add Study
  const addStudy = async () => {
    if (!subject || !hours || !date) {
      alert("Fill all fields")
      return
    }

    try {  
      await axios.post("https://study-tracker-backend-tocq.onrender.com/add-study",  
        {  
          subject,  
          hours,  
          date  
        },  
        {  
          headers: {  
            Authorization: `Bearer ${token}`   
          }  
        }  
      )  

      alert("Saved")  

      // clear inputs  
      setSubject("")  
      setHours("")  
      setDate("")  

      getData()  
      getSuggestion()  
    } catch (err) {  
      console.log(err)  
      alert("Error adding study")  
    }
  }

  // upload file
  const uploadFile = async () => {
    if (!file) {
      alert("Select file first")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      await axios.post(
        "https://study-tracker-backend-tocq.onrender.com/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
          }
        }
      )

      alert("File uploaded ✅")
      getFiles()
    } catch (err) {
      console.log(err)
      alert("Upload failed ❌")
    }
  }

  // 🔹 Get Data
  const getData = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://study-tracker-backend-tocq.onrender.com/get-study",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setData(res.data)
    } catch (err) {
      console.log(err)
    }
  },[token])

  // get files
  const getFiles = useCallback(async () => {
    try {
      const res = await axios.get(
        "https://study-tracker-backend-tocq.onrender.com/files",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      setFiles(res.data)
    } catch (err) {
      console.log(err)
    }
  },[token])

  // delete file
  const deleteFile = async (filename) => {
    try {
      await axios.delete(
        `https://study-tracker-backend-tocq.onrender.com/delete-file/${filename}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      alert("Deleted ✅")
      getFiles()
    } catch (err) {
      console.log(err)
      alert("Delete failed ❌")
    }
  }

  // Delete study
  const deleteStudy = async (id) => {
    try {
      await axios.delete(  
        `https://study-tracker-backend-tocq.onrender.com/delete-study/${id}`,  
        {  
          headers: {  
            Authorization: `Bearer ${token}`  
          }  
        }  
      )  

      alert("Deleted Successfully")  
      getData()  
      getSuggestion()
    } catch (err) {
      console.log(err)
      alert("Delete failed")
    }
  }

  // Update study
  const updateStudy = async () => {
    try {
      await axios.put(  
        `https://study-tracker-backend-tocq.onrender.com/update-study/${editId}`,  
        {  
          subject,  
          hours,  
          date  
        },  
        {  
          headers: {  
            Authorization: `Bearer ${token}`  
          }  
        }  
      )  

      alert("Updated Successfully")  

      setSubject("")  
      setHours("")  
      setDate("")  
      setIsEditing(false)  

      getData()  
      getSuggestion()
    } catch (err) {
      console.log(err)
      alert("Update failed")
    }
  }

 useEffect(() => {
  getData()
  getSuggestion()
  getFiles()
}, [getData, getSuggestion, getFiles])

  // 🔹 Subjects
  const subjects = data.map(item => item.subject)

  // 🔹 Hours
  const hoursData = data.map(item => Number(item.hours))

  // 🔹 Bar Chart
  const barData = {
    labels: subjects,
    datasets: [
      {
        label: "Study Hours",
        data: hoursData,
        backgroundColor: "blue"
      }
    ]
  }

  // 🔹 Pie Chart
  const pieData = {
    labels: subjects,
    datasets: [
      {
        data: hoursData,
        backgroundColor: ["red", "blue", "green", "orange", "pink", "yellow", "brown"]
      }
    ]
  }

  const quotes = [
  "📚 Success is the sum of small efforts repeated every day.",
  "🚀 Study now, shine later.",
  "🔥 Discipline beats motivation.",
  "💡 Every hour you study is an investment in your future.",
  "🎯 Stay consistent. Results will follow.",
  "⭐ Small progress is still progress.",
  "📖 Learning never exhausts the mind.",
  "🏆 Dreams come true with daily effort.",
  "⚡ Focus on your goal, not the obstacles.",
  "🌟 Believe in yourself and keep learning."
];

const randomQuote =
  quotes[Math.floor(Math.random() * quotes.length)];

return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-purple-950 to-black text-white p-8">
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-500 blur-3xl opacity-20 rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 blur-3xl opacity-20 rounded-full"></div>
      
      <div className="text-center mb-12">
        <h1 className="dashboard-title text-6xl font-extrabold text-center tracking-wide drop-shadow-lg">
  ✨ Study Tracker Dashboard ✨
</h1>

<p className="mt-4 text-xl text-gray-200 italic text-center animate-pulse">
  {randomQuote}
</p>

        <div className="flex justify-between items-center mb-10 flex-wrap gap-6 text-center">
          <div className="flex-1 ml-28">
            <p className="text-gray-300 mt-3 text-lg tracking-wide">
              Build consistency. Track progress. Become unstoppable ⚡
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token")
              navigate("/")
            }}
            className="bg-red-500 hover:bg-red-600 px-6 py-3 rounded-2xl font-bold shadow-lg transition-all hover:scale-105"
          >
            Logout
          </button>
        </div>
      </div>
     
      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl max-w-md mx-auto shadow-[0_0_30px_rgba(168,85,247,0.3)] border border-white/20 hover:scale-[1.02] transition-all duration-500">  
        <h2 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-pink-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
  ✨ Add Study ✨
</h2> 
        <input  
          placeholder="Subject"  
          value={subject}  
          onChange={(e) => setSubject(e.target.value)}  
          className="w-full p-3 rounded-xl bg-black/30 border border-purple-400 mb-4 outline-none"  
        /><br/>  

        <input  
          placeholder="Hours"  
          value={hours}  
          onChange={(e) => setHours(e.target.value)}  
          className="w-full p-3 rounded-xl bg-black/30 border border-purple-400 mb-4 outline-none"  
        /><br/>  

        <input  
          type="date"  
          value={date}  
          onChange={(e) => setDate(e.target.value)}  
          className="w-full p-3 rounded-xl bg-black/30 border border-purple-400 mb-4 outline-none"  
        /><br/>  
        {isEditing ? (  
          <button  
            onClick={updateStudy}  
            className="w-full bg-yellow-500 hover:bg-yellow-600 transition-all p-3 rounded-xl font-bold"  
          >  
            Update  
          </button>  
        ) : (  
          <button  
            onClick={addStudy}  
            className="w-full bg-purple-600 hover:bg-purple-700 transition-all p-3 rounded-xl font-bold"  
          >  
            Add  
          </button>  
        )}  
      </div>  

      <div className="grid md:grid-cols-2 gap-8 mt-10">
        {/* LEFT SIDE - RECORDS */}
        <div className="w-full bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl hover:scale-[1.02] transition-all duration-500 overflow-y-auto">
          <h2 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-pink-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
  ✨ Study Records ✨
</h2>

          {data.length === 0 ? (
            <p>No data</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {data.map((item, index) => (
                <div
                  key={index}
                  className="bg-black/20 p-5 rounded-2xl mb-5 border border-white/10"
                >
                  <p className="text-xl font-semibold">
                    {item.subject}
                  </p>
                  <p className="text-gray-300">
                    ⏰ {item.hours} hrs
                  </p>
                  <p className="text-gray-400 mb-5">
                    📅 {item.date}
                  </p>
                  <div className="flex gap-4">
                    <button
                      onClick={() => deleteStudy(item._id)}
                      className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl font-bold transition-all"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        setSubject(item.subject)
                        setHours(item.hours)
                        setDate(item.date)
                        setEditId(item._id)
                        setIsEditing(true)
                      }}
                      className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-xl font-bold transition-all"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div> 
          )}
        </div>

        {/* RIGHT SIDE - UPLOAD */}
        <div className="w-full bg-white/10 backdrop-blur-2xl p-6 rounded-[30px] border border-white/20 shadow-[0_0_40px_rgba(168,85,247,0.5)] hover:scale-[1.02] transition-all duration-500">
          <h2 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-pink-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(255,255,255,0.8)]">
            ✨ Upload Notes ✨
          </h2>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full mb-4 p-3 rounded-2xl bg-black/30 border border-purple-400"
          />

          <button
            onClick={uploadFile}
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:scale-105 transition-all duration-500 p-3 rounded-2xl font-bold shadow-[0_0_25px_rgba(236,72,153,0.7)]"
          >
            🚀 Upload File
          </button>

          <div className="mt-8">
            <h3 className="text-2xl font-bold mb-4 text-cyan-300">
              📁 My Files
            </h3>

            {files.map((file, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-black/30 backdrop-blur-xl border border-white/10 p-4 rounded-2xl mb-4 hover:scale-[1.02] transition-all duration-300"
              >
                <a
                  href={`https://study-tracker-backend-tocq.onrender.com/uploads/${file.filename}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white hover:text-cyan-400 transition-all"
                >
                  📄 {file.filename}
                </a>
                <button
                  onClick={() => deleteFile(file.filename)}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl font-bold shadow-lg"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>  

      {/* 📈 FIXED SIZE CHARTS SECTION */}
      <div className="flex justify-center items-center mt-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-fit mx-auto">
          {/* BAR CHART */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-center mb-4">
              📊 Bar Chart
            </h2>
            <div className="w-[400px] h-[300px]">
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: {
                        color: "white"
                      }
                    }
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: "white"
                      }
                    },
                    y: {
                      ticks: {
                        color: "white"
                      }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* PIE CHART */}
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-center mb-4">
              🥧 Pie Chart
            </h2>
            <div className="w-[400px] h-[300px] flex justify-center">
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                      labels: {
                        color: "white"
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 🤖 AI STUDY PLAN GENERATOR */}
      <AIStudyPlan />

      {/* 📋 SUBJECTS, TOTAL HOURS & MOTIVATION CARDS (Placed right below charts) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 mb-10">
        {/* CARD 1: SUBJECTS */}
        <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-xl border border-pink-400/30 rounded-3xl p-6 shadow-[0_0_40px_rgba(236,72,153,0.5)] hover:scale-105 transition-all duration-500">
          <h2 className="text-2xl font-bold text-pink-300 mb-2">
            📚 Subjects
          </h2>
          <p className="text-5xl font-extrabold text-white animate-pulse">
            {data.length}
          </p>
        </div>

        {/* CARD 2: TOTAL HOURS */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-xl border border-cyan-400/30 rounded-3xl p-6 shadow-[0_0_40px_rgba(34,211,238,0.5)] hover:scale-105 transition-all duration-500">
          <h2 className="text-2xl font-bold text-cyan-300 mb-2">
            ⏰ Total Hours
          </h2>
          <p className="text-5xl font-extrabold text-white animate-bounce">
          {hoursData.reduce((a, b) => a + b, 0)}
        </p>
      </div>

      {/* CARD 3: MOTIVATION */}
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-xl border border-yellow-400/30 rounded-3xl p-6 shadow-[0_0_40px_rgba(250,204,21,0.5)] hover:scale-105 transition-all duration-500">
        <h2 className="text-2xl font-bold text-yellow-300 mb-2">
          🔥 Motivation
        </h2>
        <p className="text-lg font-bold text-white leading-8">
          Success comes from consistency ✨
        </p>
      </div>
    </div>


  {/* 💡 SMART SUGGESTION */}
    <div className="mt-10 mb-10 flex justify-center">
      <div className="w-[500px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[30px] p-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:scale-105 transition-all duration-500">

        <h2 className="text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
          💡 Smart Suggestion
        </h2>

        <div className="bg-black/30 rounded-2xl p-6 border border-purple-500 shadow-inner">

          <p
            className={`text-xl font-bold text-center leading-9 ${
              suggestion.includes("⚠️")
                ? "text-red-400"
                : suggestion.includes("📘")
                ? "text-blue-400"
                : suggestion.includes("🔥")
                ? "text-green-400"
                : "text-white"
            }`}
          >
            {suggestion}
          </p>

        </div>

      </div>
    </div>

  </div>
)
}

export default Dashboard