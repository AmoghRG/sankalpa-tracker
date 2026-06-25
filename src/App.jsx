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

  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());


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
  const monthName = currentMonth.toLocaleString("default", {month: "long",});
  const year = currentMonth.getFullYear();

  const addSession = () => { const newSession = { date: new Date().toLocaleDateString("en-GB"), time: new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", }), }; 
  setSessions([...sessions, newSession]);  setCount(count + 1); };

  const todaySessions = sessions.filter( (session) => session.date === todayDate);

  const firstDay = new Date(year, currentMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date( year, currentMonth.getMonth() + 1,0 ).getDate(); const calendarDays = [];
  for (let i = 0; i < firstDay; i++) { calendarDays.push(null); }
  for (let day = 1; day <= daysInMonth; day++) { calendarDays.push(day); }

  const selectedDateObj = selectedDate ? new Date(year,currentMonth.getMonth(), selectedDate ) : null;
  const selectedDateSessions = selectedDateObj ? sessions.filter( (session) => session.date === selectedDateObj.toLocaleDateString("en-GB") ) : [];

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

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

        <div className="bg-zinc-900 rounded-2xl p-6 mt-6">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setCurrentMonth( new Date(year, currentMonth.getMonth() - 1) ) } className="bg-zinc-800 px-3 py-1 rounded" > ← </button>

        <h2 className="text-xl font-semibold">
            📅 {monthName} {year}
        </h2>

          <button onClick={() => setCurrentMonth( new Date(year, currentMonth.getMonth() + 1)) } className="bg-zinc-800 px-3 py-1 rounded" > → </button>
      </div>
        </div>

      </div>

      <div className="grid grid-cols-7 text-center text-zinc-400 text-sm font-semibold mb-3 max-w-5xl mx-auto">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div> </div>

    <div className="grid grid-cols-7 gap-2 max-w-5xl mx-auto"> {calendarDays.map((day, index) => (
    <div key={index} onClick={() => day && setSelectedDate(day)} className="h-12 flex items-center justify-center rounded-lg bg-zinc-800 hover:bg-zinc-700 cursor-pointer transition" > {day} </div> ))} </div>
    
    {selectedDateObj && ( <div className="bg-zinc-900 rounded-2xl p-6 mt-6">

      <h3 className="text-xl font-semibold mb-2">
        {selectedDateObj.toLocaleDateString("en-GB")}
      </h3>

      <p className="text-zinc-400 mb-4">
        Total Sessions: {selectedDateSessions.length}
      </p>

    <div className="space-y-2"> {selectedDateSessions.map((session, index) => ( <div key={index} className="bg-zinc-800 rounded-lg px-4 py-2" >
          {session.time} </div> ))} </div>

  </div>
)}

    </div>
  )
}

export default App