"use client";
import { useState } from "react";

export default function Home() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [resultat, setResultat] = useState("");

  return (
    <main style={{ background: "#f0fdf4", minHeight: "100vh", padding: 20, fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: 600, margin: "auto", background: "white", borderRadius: 20, padding: 25 }}>
        <h1 style={{ textAlign: "center", color: "#14532d" }}>🌱 Plante Doctor AI</h1>
        <p style={{ textAlign: "center" }}>Des plantes en bonne santé, un avenir plus vert</p>

        <div style={{ border: "2px dashed #16a34a", borderRadius: 15, padding: 20, textAlign: "center", marginTop: 20 }}>
          <p>📷 Ajoutez une photo de votre plante</p>
          <input type="file" accept="image/*" onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setPhoto(URL.createObjectURL(f));
          }} />
          {photo && <img src={photo} style={{ width: "100%", borderRadius: 12, marginTop: 15 }} />}
        </div>

        <button onClick={() => setResultat("Carence en eau - 87% : Arrosez 2 fois par semaine, lumière indirecte.")}
          style={{ width: "100%", background: "#16a34a", color: "white", border: "none", padding: 15, borderRadius: 12, marginTop: 15, fontSize: 16 }}>
          Analyser ma plante
        </button>

        {resultat && <div style={{ background: "#dcfce7", padding: 15, borderRadius: 12, marginTop: 15 }}>🩺 {resultat}</div>}

        <h2 style={{ color: "#14532d" }}>💡 Conseils</h2>
        <p>💧 Arrosage : 2 fois par semaine</p>
        <p>☀️ Lumière : Lumière indirecte</p>
        <p>🌍 Sol : Bien drainé</p>

        <h2 style={{ color: "#14532d" }}>🪴 Mes plantes</h2>
        <p>✅ Monstera - En bonne santé</p>
        <p>⚠️ Ficus - Besoin d'attention</p>
      </div>
    </main>
  );
}