import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axiosClient from "../api/axiosClient";
import { AppointmentResponse } from "../types";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const CalendarPage = () => {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [allAppts, setAllAppts] = useState<AppointmentResponse[]>([]);
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    axiosClient.get<AppointmentResponse[]>("/appointments")
      .then(r => setAllAppts(r.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load appointments.'))
      .finally(() => setLoading(false));
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  const apptMap: Record<string, AppointmentResponse[]> = {};
  allAppts.forEach(a => {
    const key = a.appointmentDate;
    if (!apptMap[key]) apptMap[key] = [];
    apptMap[key].push(a);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1);
    setSelectedDay(null);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1);
    setSelectedDay(null);
  };

  const selectedKey = selectedDay ? `${year}-${pad(month + 1)}-${pad(selectedDay)}` : null;
  const selectedAppts = selectedKey ? (apptMap[selectedKey] || []) : [];

  const statusBadge = (status: string) => (
    <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
  );

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h2>📅 Appointment Calendar</h2>
          <p>View appointments by date across any month.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "var(--space-6)", alignItems: "start" }}>
          <div className="card">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-5)" }}>
              <button id="prev-month-btn" className="btn btn-secondary" style={{ padding: "6px 14px" }} onClick={prevMonth}>‹</button>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{MONTHS[month]} {year}</h3>
              <button id="next-month-btn" className="btn btn-secondary" style={{ padding: "6px 14px" }} onClick={nextMonth}>›</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: "var(--space-2)" }}>
              {DAYS.map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 600, color: "var(--color-text-muted)", padding: "4px 0" }}>{d}</div>
              ))}
            </div>

            {error && <div className="alert alert-error" style={{ margin: 'var(--space-4)' }}>{error}</div>}
            {loading ? (
              <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
                <div className="spinner" style={{ margin: "0 auto" }} />
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                {cells.map((day, i) => {
                  if (day === null) return <div key={`empty-${i}`} />;
                  const key = `${year}-${pad(month + 1)}-${pad(day)}`;
                  const appts = apptMap[key] || [];
                  const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                  const isSelected = day === selectedDay;

                  return (
                    <div
                      key={day}
                      id={`cal-day-${day}`}
                      onClick={() => setSelectedDay(day)}
                      style={{
                        minHeight: 64,
                        borderRadius: "var(--radius-md)",
                        padding: "6px 8px",
                        cursor: "pointer",
                        border: isSelected ? "2px solid var(--color-primary)" : "2px solid transparent",
                        background: isToday
                          ? "rgba(99, 102, 241, 0.15)"
                          : isSelected
                          ? "var(--color-bg-hover)"
                          : "var(--color-bg-card)",
                        transition: "all 0.15s ease",
                        position: "relative"
                      }}
                    >
                      <div style={{
                        fontSize: 13,
                        fontWeight: isToday ? 700 : 500,
                        color: isToday ? "var(--color-primary-light)" : "var(--color-text-primary)",
                        marginBottom: 4
                      }}>{day}</div>

                      {appts.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          {appts.slice(0, 2).map(a => (
                            <div key={a.id} style={{
                              fontSize: 10,
                              borderRadius: 3,
                              padding: "1px 4px",
                              background: a.status === "COMPLETED"
                                ? "rgba(16, 185, 129, 0.25)"
                                : a.status === "CANCELLED"
                                ? "rgba(239, 68, 68, 0.2)"
                                : "rgba(99, 102, 241, 0.25)",
                              color: a.status === "COMPLETED"
                                ? "#10b981"
                                : a.status === "CANCELLED"
                                ? "#ef4444"
                                : "#818cf8",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap"
                            }}>
                              {a.patientName.split(" ")[0]}
                            </div>
                          ))}
                          {appts.length > 2 && (
                            <div style={{ fontSize: 10, color: "var(--color-text-muted)" }}>+{appts.length - 2} more</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-title">
              {selectedDay
                ? `${MONTHS[month]} ${selectedDay}, ${year}`
                : "Select a date"}
            </div>

            {!selectedDay ? (
              <p style={{ color: "var(--color-text-muted)", fontSize: 14 }}>Click any day on the calendar to see appointments.</p>
            ) : selectedAppts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "var(--space-6)", color: "var(--color-text-muted)" }}>
                <div style={{ fontSize: 36 }}>📭</div>
                <p style={{ marginTop: "var(--space-2)", fontSize: 14 }}>No appointments on this day.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                {selectedAppts
                  .sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime))
                  .map(a => (
                  <div key={a.id} style={{
                    background: "var(--color-bg-hover)",
                    borderRadius: "var(--radius-md)",
                    padding: "var(--space-3)",
                    borderLeft: `3px solid ${a.status === "COMPLETED" ? "#10b981" : a.status === "CANCELLED" ? "#ef4444" : "#818cf8"}`
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{a.patientName}</div>
                        <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>
                          {a.appointmentTime} · {a.treatmentType.replace(/_/g, " ")}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{a.dentistName}</div>
                      </div>
                      {statusBadge(a.status)}
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: 10, color: "var(--color-text-muted)", marginTop: 4 }}>
                      {a.appointmentNumber}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CalendarPage;
