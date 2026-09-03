import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axiosClient from "../api/axiosClient";
import { AppointmentResponse, DailyReportResponse } from "../types";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { user } = useAuth();
  const [report, setReport] = useState<DailyReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchReport = () => {
    return axiosClient.get<DailyReportResponse>("/reports/daily")
      .then(r => setReport(r.data))
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReport(); }, []);

  const handleStatus = async (apptNum: string, status: string, id: number) => {
    setUpdatingId(id);
    try {
      await axiosClient.patch<AppointmentResponse>(`/appointments/${apptNum}/status`, { status });
      await fetchReport();
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  };

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const statusBadge = (status: string) => (
    <span className={`badge badge-${status.toLowerCase()}`}>{status}</span>
  );

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h2>Welcome, {user?.fullName?.split(" ")[0]}!</h2>
          <p>{today}</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card teal">
            <div className="stat-icon teal">Calendar</div>
            <div className="stat-value">{loading ? "-" : report?.totalAppointments ?? 0}</div>
            <div className="stat-label">Today Appointments</div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon green">Done</div>
            <div className="stat-value">{loading ? "-" : report?.completedAppointments ?? 0}</div>
            <div className="stat-label">Completed</div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon blue">Clock</div>
            <div className="stat-value">{loading ? "-" : report?.scheduledAppointments ?? 0}</div>
            <div className="stat-label">Scheduled</div>
          </div>
          <div className="stat-card gold">
            <div className="stat-icon gold">Money</div>
            <div className="stat-value">
              {loading ? "-" : `LKR ${(report?.totalRevenue ?? 0).toLocaleString()}`}
            </div>
            <div className="stat-label">Today Revenue</div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Today Appointment Schedule</div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "var(--space-8)", color: "var(--color-text-muted)" }}>
              <div className="spinner" style={{ margin: "0 auto" }} /> Loading...
            </div>
          ) : report?.appointments?.length ? (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Appt #</th>
                    <th>Patient</th>
                    <th>Dentist</th>
                    <th>Treatment</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {report.appointments.map((a: AppointmentResponse) => (
                    <tr key={a.id}>
                      <td style={{ fontFamily: "monospace", fontSize: 12 }}>{a.appointmentNumber}</td>
                      <td>{a.patientName}</td>
                      <td>{a.dentistName}</td>
                      <td>{a.treatmentType.replace(/_/g, " ")}</td>
                      <td>{a.appointmentTime}</td>
                      <td>{statusBadge(a.status)}</td>
                      <td>
                        {a.status === "SCHEDULED" && (
                          <div style={{ display: "flex", gap: 6 }}>
                            <button
                              id={`complete-${a.id}`}
                              className="btn btn-primary"
                              style={{ padding: "3px 10px", fontSize: 12, background: "var(--color-success)", borderColor: "var(--color-success)" }}
                              disabled={updatingId === a.id}
                              onClick={() => handleStatus(a.appointmentNumber, "COMPLETED", a.id)}
                            >
                              {updatingId === a.id ? <span className="spinner" /> : "Done"}
                            </button>
                            <button
                              id={`cancel-${a.id}`}
                              className="btn btn-secondary"
                              style={{ padding: "3px 10px", fontSize: 12, borderColor: "var(--color-danger)", color: "var(--color-danger)" }}
                              disabled={updatingId === a.id}
                              onClick={() => handleStatus(a.appointmentNumber, "CANCELLED", a.id)}
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "var(--space-12)", color: "var(--color-text-muted)" }}>
              <div style={{ fontSize: 48 }}>No appointments</div>
              <p style={{ marginTop: "var(--space-3)" }}>No appointments scheduled for today.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
