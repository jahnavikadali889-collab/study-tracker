import React, { useState } from "react"
import axios from "axios"

function AIStudyPlan() {
  const token = localStorage.getItem("token")

  const [subject, setSubject] = useState("")
  const [dailyHours, setDailyHours] = useState("")
  const [duration, setDuration] = useState("")
  const [goal, setGoal] = useState("")
  const [level, setLevel] = useState("")

  const [plan, setPlan] = useState([])
  const [loading, setLoading] = useState(false)

  const generatePlan = async () => {
    if (!subject || !dailyHours || !duration || !goal || !level) {
      alert("Please fill all fields")
      return
    }

    try {
      setLoading(true)

      const response = await axios.post(
        "https://study-tracker-backend-tocq.onrender.com/generate-study-plan",
        {
          subject,
          dailyHours: Number(dailyHours),
          duration: Number(duration),
          goal,
          level
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setPlan(response.data.plan)
      alert("Study Plan Generated Successfully 🎉")
    } catch (error) {
      console.log("AI STUDY PLAN ERROR:", error.response?.data || error.message)
      alert("Failed to generate study plan ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-16">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-[0_0_40px_rgba(168,85,247,0.4)]">

        <h2 className="text-4xl font-extrabold text-center mb-3 bg-gradient-to-r from-pink-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
          🤖 AI Study Plan Generator
        </h2>

        <p className="text-center text-gray-300 mb-8">
          Create a personalized study plan based on your goals 🚀
        </p>

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="block mb-2 text-pink-300 font-semibold">
              📚 What do you want to learn?
            </label>

            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/40 border border-purple-400 text-white outline-none"
            >
              <option value="">Select Subject</option>
              <option value="React.js">React.js</option>
              <option value="Node.js">Node.js</option>
              <option value="Python">Python</option>
              <option value="JavaScript">JavaScript</option>
              <option value="MongoDB">MongoDB</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-cyan-300 font-semibold">
              ⏰ Daily Study Hours
            </label>

            <input
              type="number"
              min="1"
              max="24"
              placeholder="Example: 3"
              value={dailyHours}
              onChange={(e) => setDailyHours(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/40 border border-purple-400 text-white outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-purple-300 font-semibold">
              📅 Study Duration
            </label>

            <input
              type="number"
              min="1"
              max="30"
              placeholder="Example: 15 days"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/40 border border-purple-400 text-white outline-none"
            />
          </div>

          <div>
            <label className="block mb-2 text-yellow-300 font-semibold">
              🎯 Your Level
            </label>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full p-3 rounded-xl bg-black/40 border border-purple-400 text-white outline-none"
            >
              <option value="">Select Level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

        </div>

        <div className="mt-5">
          <label className="block mb-2 text-green-300 font-semibold">
            🚀 What is your goal?
          </label>

          <textarea
            placeholder="Example: I want to become a React Developer"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="w-full p-3 rounded-xl bg-black/40 border border-purple-400 text-white outline-none resize-none"
            rows="3"
          />
        </div>

        <button
          onClick={generatePlan}
          disabled={loading}
          className="w-full mt-6 p-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:scale-105 transition-all duration-300 shadow-[0_0_25px_rgba(168,85,247,0.6)]"
        >
          {loading ? "Generating Plan..." : "✨ Generate My Study Plan"}
        </button>

      </div>

      {plan.length > 0 && (
        <div className="max-w-5xl mx-auto mt-10">

          <h2 className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-pink-400 via-cyan-400 to-purple-500 bg-clip-text text-transparent">
            📅 Your Personalized Study Plan
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {plan.map((item) => (
              <div
                key={item.day}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              >
                <h3 className="text-2xl font-bold text-pink-300 mb-3">
                  Day {item.day}
                </h3>

                <p className="text-cyan-300 font-semibold mb-2">
                  📚 {item.topic}
                </p>

                <p className="text-gray-300 mb-2">
                  ⏰ {item.hours} hours
                </p>

                <p className="text-gray-400">
                  📝 {item.task}
                </p>
              </div>
            ))}

          </div>

        </div>
      )}

    </div>
  )
}

export default AIStudyPlan