export function CalendarApp() {
  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 12 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600 }}>January 2026</h3>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, fontSize: 11 }}>
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div key={day} style={{ textAlign: "center", fontWeight: 600, padding: 4, color: "var(--text-secondary)" }}>
            {day}
          </div>
        ))}
        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
          <div
            key={day}
            style={{
              textAlign: "center",
              padding: 6,
              borderRadius: 4,
              background: day === 29 ? "var(--pastel-mint)" : "transparent",
              fontWeight: day === 29 ? 600 : 400,
            }}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
}
