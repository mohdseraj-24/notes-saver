export default function AuthShell({ children }) {
  return (
    <main className="auth-page">
      <section className="auth-showcase">
        <div className="showcase-brand"><span>N</span> NoteFlow</div>
        <div className="showcase-copy">
          <p className="eyebrow">YOUR SECOND BRAIN</p>
          <h1>Capture ideas.<br /><em>Keep moving.</em></h1>
          <p>A calm, private space for notes, plans, reminders and the ideas you don't want to lose.</p>
        </div>
        <div className="floating-card card-a">✦ Ideas worth keeping</div>
        <div className="floating-card card-b">✓ Finish portfolio website</div>
        <div className="showcase-footer">Simple by nature · Private by design</div>
      </section>
      <section className="auth-panel">
        <div className="auth-box">{children}</div>
      </section>
    </main>
  );
}
