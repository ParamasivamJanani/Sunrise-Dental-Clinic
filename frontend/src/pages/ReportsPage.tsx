import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axiosClient from "../api/axiosClient";
import { MonthlyReportResponse } from "../types";

const ReportsPage = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [report, setReport] = useState<MonthlyReportResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    axiosClient.get<MonthlyReportResponse>(`/reports/monthly?year=${year}`)
      .then(r => setReport(r.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load report data.'))
      .finally(() => setLoading(false));
  }, [year]);

  const maxRevenue = report ? Math.max(...report.months.map(m => m.totalRevenue), 1) : 1;
  const totalRevenue = report?.months.reduce((s, m) => s + m.totalRevenue, 0) ?? 0;
  const totalAppointments = report?.months.reduce((s, m) => s + m.totalAppointments, 0) ?? 0;
  const totalCompleted = report?.months.reduce((s, m) => s + m.completedAppointments, 0) ?? 0;

  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h2>📈 Revenue Reports</h2>
          <p>Monthly income and appointment summary for the selected year.</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
          <button id="prev-year-btn" className="btn btn-secondary" onClick={() => setYear(y => y - 1)}>‹ {year - 1}</button>
          <span style={{ fontWeight: 700, fontSize: 20, minWidth: 60, textAlign: "center" }}>{year}</span>
          <button id="next-year-btn" className="btn btn-secondary" disabled={year >= currentYear} onClick={() => setYear(y => y + 1)}>{year + 1} ›</button>
        </div>

        <div className="stats-grid" style={{ marginBottom: "var(--space-6)" }}>
          <div className="stat-card gold">
            <div className="stat-icon gold">💰</div>
            <div className="stat-value">LKR {totalRevenue.toLocaleString()}</div>
            <div className="stat-label">Total Revenue {year}</div>
          </div>
          <div className="stat-card teal">
            <div className="stat-icon teal">📅</div>
            <div className="stat-value">{totalAppointments}</div>
            <div className="stat-label">Total Appointments</div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon green">✅</div>
            <div className="stat-value">{totalCompleted}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        <div className="card" style={{ marginBottom: "var(--space-6)" }}>
          <div className="card-title">Monthly Revenue Chart</div>
          {error && <div className="alert alert-error" style={{ margin: 'var(--space-4)' }}>{error}</div>}
          {loading ? (
            <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
              <div className="spinner" style={{ margin: "0 auto" }} />
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 180, padding: "var(--space-4) 0" }}>
              {report?.months.map(m => {
                const pct = maxRevenue > 0 ? (m.totalRevenue / maxRevenue) * 100 : 0;
                return (
                  <div key={m.monthNumber} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ fontSize: 10, color: "var(--color-text-muted)", textAlign: "center" }}>
                      {m.totalRevenue > 0 ? `${(m.totalRevenue / 1000).toFixed(1)}k` : ""}
                    </div>
                    <div
                      id={`bar-${m.month}`}
                      title={`${m.month}: LKR ${m.totalRevenue.toLocaleString()}`}
                      style={{
                        width: "100%",
                        height: `${Math.max(pct, 2)}%`,
                        background: m.totalRevenue > 0
                          ? "linear-gradient(to top, var(--color-primary), var(--color-primary-light))"
                          : "var(--color-bg-hover)",
                        borderRadius: "var(--radius-md) var(--radius-md) 0 0",
                        transition: "height 0.4s ease",
                        minHeight: 4,
                        cursor: "default"
                      }}
                    />
                    <div style={{ fontSize: 11, color: "var(--color-text-muted)", fontWeight: 600 }}>{m.month}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div className="card-title" style={{ padding: "var(--space-4) var(--space-5)" }}>Monthly Breakdown</div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "var(--space-8)" }}>
              <div className="spinner" style={{ margin: "0 auto" }} />
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Total Appointments</th>
                    <th>Completed</th>
                    <th>Revenue (LKR)</th>
                  </tr>
                </thead>
                <tbody>
                  {report?.months.map(m => (
                    <tr key={m.monthNumber}>
                      <td><strong>{m.month} {year}</strong></td>
                      <td>{m.totalAppointments}</td>
                      <td>
                        {m.completedAppointments}
                        {m.totalAppointments > 0 && (
                          <span style={{ fontSize: 11, color: "var(--color-text-muted)", marginLeft: 4 }}>
                            ({Math.round((m.completedAppointments / m.totalAppointments) * 100)}%)
                          </span>
                        )}
                      </td>
                      <td style={{ fontWeight: m.totalRevenue > 0 ? 600 : 400, color: m.totalRevenue > 0 ? "var(--color-accent)" : "var(--color-text-muted)" }}>
                        {m.totalRevenue > 0 ? m.totalRevenue.toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))}
                  <tr style={{ borderTop: "2px solid var(--color-border)", fontWeight: 700 }}>
                    <td>Total</td>
                    <td>{totalAppointments}</td>
                    <td>{totalCompleted}</td>
                    <td style={{ color: "var(--color-accent)" }}>LKR {totalRevenue.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ReportsPage;
