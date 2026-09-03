import Navbar from '../components/Navbar';

const steps = [
  {
    n: 1, title: 'Login to the System',
    desc: 'Open the application in your web browser. Enter your assigned username and password and click "Sign In". Contact your system administrator if you don\'t have credentials.',
  },
  {
    n: 2, title: 'Register a New Appointment',
    desc: 'Click "Register Appointment" in the sidebar. Fill in the patient\'s full name, address, and Sri Lankan phone number. Select the treating dentist and treatment type from the dropdowns. Choose the appointment date (cannot be in the past) and time, then click "Register Appointment".',
  },
  {
    n: 3, title: 'View Appointment Details',
    desc: 'Click "Search / View" in the sidebar. Type the appointment number (e.g. SDC-20260903-0001) in the search box and click "Search". All patient and appointment information will be displayed.',
  },
  {
    n: 4, title: 'Generate & Print a Bill',
    desc: 'Navigate to "Billing & Receipt". Enter the appointment number and click "Generate Bill". The system will automatically calculate the treatment cost plus consultation fee. Review the receipt and click "Print Receipt" to print or save as PDF.',
  },
  {
    n: 5, title: 'View Today\'s Dashboard',
    desc: 'The Dashboard shows today\'s appointment summary including total appointments, completed, scheduled, and today\'s revenue. The table below shows each appointment with real-time status.',
  },
  {
    n: 6, title: 'Logout Safely',
    desc: 'Always click the "Logout" button at the bottom of the sidebar when you are done. This ensures patient data remains secure and your session is properly closed.',
  },
];

const HelpPage = () => {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-content">
        <div className="page-header">
          <h2>❓ Help & User Guide</h2>
          <p>Step-by-step instructions for using the Sunrise Dental Clinic Management System.</p>
        </div>

        <div className="alert alert-info" style={{ marginBottom: 'var(--space-6)' }}>
          ℹ️ This guide is intended for clinic receptionists and administrative staff. For technical support, contact the system administrator.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {steps.map(step => (
            <div key={step.n} className="help-step">
              <div className="step-number">{step.n}</div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: 'var(--space-8)' }}>
          <div className="card-title">💊 Treatment Types & Prices</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Treatment</th><th>Price (LKR)</th><th>Notes</th></tr>
              </thead>
              <tbody>
                {[
                  ['Consultation',        '1,500',  'General examination'],
                  ['Teeth Cleaning',      '3,500',  'Scaling & polishing'],
                  ['Tooth Filling',       '5,000',  'Composite or amalgam'],
                  ['Tooth Extraction',    '7,000',  'Simple or surgical'],
                  ['Root Canal',          '25,000', 'Endodontic treatment'],
                  ['Teeth Whitening',     '15,000', 'In-office whitening'],
                  ['Braces Consultation', '2,000',  'Orthodontic assessment'],
                ].map(([t, p, n]) => (
                  <tr key={t}><td>{t}</td><td>LKR {p}</td><td style={{ color: 'var(--color-text-muted)' }}>{n}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 'var(--space-3)', fontSize: 12, color: 'var(--color-text-muted)' }}>
            * Consultation fee is charged separately per dentist and added to the treatment cost.
          </p>
        </div>

        <div className="card" style={{ marginTop: 'var(--space-6)' }}>
          <div className="card-title">👨‍⚕️ Our Dentists</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {[
              { name: 'Dr. Priya Perera',    spec: 'General Dentist',  fee: 'LKR 1,500' },
              { name: 'Dr. Kasun Silva',     spec: 'Orthodontist',     fee: 'LKR 2,000' },
              { name: 'Dr. Amali Fernando',  spec: 'Endodontist',      fee: 'LKR 2,500' },
            ].map(d => (
              <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3)', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{d.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{d.spec}</div>
                </div>
                <span className="badge badge-scheduled" style={{ fontSize: 12 }}>
                  Consultation: {d.fee}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HelpPage;
