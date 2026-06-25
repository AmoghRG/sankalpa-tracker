import { useState, useEffect } from "react";
function App() {

  const [count, setCount] = useState(() => { const savedCount = localStorage.getItem("count");
  return savedCount ? Number(savedCount) : 0; });

  const [sessions, setSessions] = useState(() => { const savedSessions = localStorage.getItem("sessions");
  return savedSessions ? JSON.parse(savedSessions) : []; });

  const [startDate, setStartDate] = useState(() => {return localStorage.getItem("startDate") || "";});
  const [sankalpaName, setSankalpaName] = useState(() => { return localStorage.getItem("sankalpaName") || "Hanuman Chalisa"; });
  const [goalCount, setGoalCount] = useState(() => { return localStorage.getItem("goalCount") || 100; });
  const [durationDays, setDurationDays] = useState(() => { return localStorage.getItem("durationDays") || 40; });
  const [editing, setEditing] = useState(false);


  useEffect(() => { localStorage.setItem("count", count); }, [count]);
  useEffect(() => { localStorage.setItem("sessions",JSON.stringify(sessions));}, [sessions]);
  useEffect(() => {localStorage.setItem("startDate", startDate); }, [startDate]);

  useEffect(() => { localStorage.setItem("sankalpaName", sankalpaName); }, [sankalpaName]);
  useEffect(() => {localStorage.setItem("goalCount", goalCount); }, [goalCount]);
  useEffect(() => { localStorage.setItem("durationDays", durationDays);}, [durationDays]);

  const percentage = Math.min( Math.round((count / goalCount) * 100), 100);
  const remaining = Math.max(goalCount - count, 0);
  
  let endDate = ""; if (startDate) { const start = new Date(startDate); const end = new Date(start); end.setDate(end.getDate() + Number(durationDays) - 1); endDate = end.toLocaleDateString("en-GB"); }
  let currentDay = 0; if (startDate) { const start = new Date(startDate); const today = new Date(); const diffTime = today - start; currentDay = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; }
  const todayDate = new Date().toLocaleDateString("en-GB");

  const addSession = () => { const newSession = { date: new Date().toLocaleDateString("en-GB"), time: new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", }), }; 
  setSessions([...sessions, newSession]);  setCount(count + 1); };

  const todaySessions = sessions.filter( (session) => session.date === todayDate);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
      <div className="mb-5">
          <h1 className="text-4xl font-bold">
            🚩 {sankalpaName}
          </h1>

      <p className="text-yellow-200 text-xl font-bold mt-3"> {startDate ? `${new Date(startDate).toLocaleDateString("en-GB")} → ${endDate}` : "Choose Start Date"}</p>
      {startDate && ( <p className="text-white-400 text-lg mt-1"> Day {currentDay} / {durationDays} </p> )}

        <button onClick={() => setEditing(!editing)} className="mt-3 bg-zinc-800 px-4 py-2 rounded hover:bg-zinc-700" >
                {editing ? "Lock Sankalpa" : "Edit Sankalpa"}
        </button>

      {editing && ( 
        <div>

      <input type="text" value={sankalpaName} onChange={(e) => setSankalpaName(e.target.value)}
        className="bg-zinc-900 px-3 py-2 rounded text-white mt-3 w-full max-w-sm" placeholder="Sankalpa Name" />

      <p className="text-gray-500 text-sm mt-1">
        {startDate ? `${new Date(startDate).toLocaleDateString("en-GB")} → ${endDate}` : "Choose Start Date"}
      </p>

      <div className="mt-4"> <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} 
          className="bg-zinc-900 px-3 py-2 rounded text-white"/>
      </div>

      {startDate && (
        <p className="text-gray-400 mt-3">
          Day {currentDay} / {durationDays}
        </p>
      )}

      <div className="mt-4 flex gap-4 flex-wrap">

        <div>
          <p className="text-sm text-gray-400 mb-1">
            Goal Count
          </p>

          <input type="number" value={goalCount} onChange={(e) => setGoalCount(Number(e.target.value))} className="bg-zinc-900 px-3 py-2 rounded text-white w-28" />
        </div>

        <div>
          <p className="text-sm text-gray-400 mb-1">
            Duration Days
          </p>

          <input type="number" value={durationDays} onChange={(e) => setDurationDays(Number(e.target.value))} className="bg-zinc-900 px-3 py-2 rounded text-white w-28" />
        </div>

      </div>

    </div>
  )}

</div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Progress */}
          <div className="bg-zinc-900 rounded-2xl p-6">
            <h2 className="text-gray-400 mb-3">
              Progress
            </h2>

            <div className="text-5xl font-bold">
              {percentage}%
            </div>

            <div className="text-xl mt-2">
              {count} / {goalCount}
            </div>

            <div className="text-gray-400 mt-2">
              Remaining: {remaining}
            </div>

            <div className="w-full bg-zinc-800 rounded-full h-4 mt-4"> <div className="bg-orange-500 h-4 rounded-full" 
            style={{ width: `${percentage}%` }} /> </div>

          </div>

          {/* Add Button */}
          <div className="bg-zinc-900 rounded-2xl p-6 flex flex-col items-center justify-center">
           <button onClick={addSession}
             className="bg-orange-500 hover:bg-orange-600 px-6 py-4 rounded-xl font-semibold text-lg" >
             +1 {sankalpaName}
          </button>

          <button onClick={() => { if (sessions.length === 0) return;
              setSessions(sessions.slice(0, -1));   setCount(Math.max(count - 1, 0)); }}
              className="mt-4 text-gray-400 hover:text-white" >
              Undo Last Entry
          </button>

          </div>

          {/* Today */}
          <div className="bg-zinc-900 rounded-2xl p-6">
            <h2 className="text-gray-400 text-xl mb-1">
              Today
            </h2>

            <p className="text-lg text-orange-600 mb-2">
              {todayDate}
            </p>

            <div className="text-2xl">
              {todaySessions.length} Sessions
            </div>

            <div className="mt-4 text-sm text-gray-400"> 
                {todaySessions.map((session, index) => ( <div key={index}> {session.time}</div>))}
            </div>

          </div>
          

        </div>

      </div>
    </div>
  )
}

export default App