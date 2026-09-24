import FAQSection from "@/components/FAQSection";
export default function Page() {
  return (
    <main>
      <section className="hero">
        <div className="container">
          <div className="eyebrow">FAQ</div>
          <h1>Answers before you start.</h1>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <FAQSection />
        </div>
      </section>
    </main>
  );
}
