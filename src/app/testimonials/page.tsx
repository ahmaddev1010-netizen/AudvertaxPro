const qs = [
  "The process was clear and the team answered every question.",
  "Our formation was handled smoothly and communication was consistent.",
  "We appreciated having formation, documents and support coordinated.",
  "Fast responses and helpful guidance throughout the process.",
  "The dashboard-style workflow made the status easy to follow.",
  "A straightforward experience from onboarding to documents.",
];
export default function Page() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <div className="eyebrow">Testimonials</div>
          <h1>Stories from founders building internationally.</h1>
        </div>
      </section>
      <section className="section">
        <div className="container quotes">
          {qs.map((q, i) => (
            <div className="card quote" key={q}>
              “{q}”
              <b>{["Abdullah", "Kargoas", "Waqas", "Malik", "Arslan", "Fahad"][i]} — Founder</b>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
