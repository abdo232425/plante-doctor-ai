 "use client";
import { useState, useEffect, useRef } from "react";

type PlantResult = { name: string; scientific: string; health: number; problems: string[]; solution: string; watering: string; };
type GardenPlant = { id: number; name: string; image: string; date: string; health: number; stage: string; lastWater: string; };

const FALLING = ["🌿","🍃","🌱","🌸","🌺","🍀","🌻","🌹"];

export default function Home() {
  const [page, setPage] = useState<"diag" | "jardin">("diag");
  const [lang, setLang] = useState<"fr" | "ar">("fr");
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<PlantResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [garden, setGarden] = useState<GardenPlant[]>([]);
  const [showInfo, setShowInfo] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const s = localStorage.getItem("mon-jardin");
    if (s) setGarden(JSON.parse(s));
  }, []);
  useEffect(() => { localStorage.setItem("mon-jardin", JSON.stringify(garden)); }, [garden]);

  async function callAI(model: string, base64: string, prompt: string, key: string) {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: "image/jpeg", data: base64 } }] }], generationConfig: { temperature: 0, responseMimeType: "application/json" } })
    });
    return await res.json();
  }

  async function analyseAI(image: string) {
    setLoading(true); setErrMsg(""); setResult(null);
    const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
    if (!key) { setErrMsg(lang === "fr" ? "AI : Clé non configurée" : "AI : المفتاح غير موجود"); setLoading(false); return; }
    const base64 = image.split(",")[1];
    const prompt = lang === "fr"
      ? `Tu es un expert des plantes très précis. Ta mission: regarde la photo et dis ce que tu vois VRAIMENT: couleur des feuilles, forme de la feuille, fleurs. Ne devine pas. Si tu n'es pas sûr, dis "Plante non identifiée" dans le nom. Réponds UNIQUEMENT ce JSON: {"name":"vrai nom en français","scientific":"vrai nom scientifique","health":85,"problems":["problème 1"],"solution":"solution en français","watering":"arrosage en français"} Étape 3: si tu n'es pas sûr, dis Plante non identifiée.`
      : `أنت خبير نباتات دقيق جدا. انظر للصورة وقل ما تراه فعلا: لون الأوراق، شكل الورقة، الأزهار. لا تخمن. إذا لم تكن متأكدا قل "نبتة غير معروفة". أجب فقط بهذا JSON: {"name":"الاسم الحقيقي بالعربية","scientific":"الاسم العلمي","health":85,"problems":["المشكلة"],"solution":"الحل بالعربية","watering":"السقي بالعربية"}`;
    // Ordre rapide d'abord : lite le plus rapide, puis 3-flash, puis 3.8-flash le plus fort
    for (const model of ["gemini-3.5-flash-lite", "gemini-3-flash", "gemini-3.8-flash"]) {
      try {
        const j: any = await callAI(model, base64, prompt, key);
        if (j.error) { setErrMsg(`AI: ${j.error.message}`); continue; }
        const text = j.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if (!text) continue;
        const start = text.indexOf("{");
        const end = text.lastIndexOf("}") + 1;
        if (start < 0 || end === 0) continue;
        const parsed = JSON.parse(text.slice(start, end));
        if (typeof parsed.health !== "number") parsed.health = 75;
        if (parsed.health < 0) parsed.health = 0;
        if (parsed.health > 100) parsed.health = 100;
        setResult(parsed);
        // AUTO : des que c est analyse, on la met direct dans Mon jardin, sans cliquer
        const autoPlant: GardenPlant = {
          id: Date.now(),
          name: parsed.name,
          image: image,
          date: new Date().toLocaleDateString("fr-FR"),
          health: parsed.health,
          stage: "Jeune plante",
          lastWater: new Date().toLocaleDateString("fr-FR"),
        };
        setGarden((prev) => {
          const next = [autoPlant, ...prev];
          localStorage.setItem("mon-jardin", JSON.stringify(next));
          return next;
        });
        setLoading(false);
        return;
      } catch (e: any) { setErrMsg(`AI: ${e.message}`); continue; }
    }
    setLoading(false);
  }

  function onFile(e: any) {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => { const v = r.result as string; setImage(v); analyseAI(v); };
    r.readAsDataURL(f);
  }

  function addToGarden() {
    if (!image || !result) return;
    const np: GardenPlant = { id: Date.now(), name: result.name, image, date: new Date().toLocaleDateString("fr-FR"), health: result.health, stage: "Jeune plante", lastWater: new Date().toLocaleDateString("fr-FR") };
    setGarden([np, ...garden]);
    setPage("jardin");
  }

  function waterPlant(id: number) { setGarden(garden.map(p => p.id === id ? { ...p, lastWater: new Date().toLocaleDateString("fr-FR") } : p)); }
  function removePlant(id: number) { setGarden(garden.filter(p => p.id !== id)); }

  return (
    <div style={{ minHeight: "100vh", background: "#f0fdf4", position: "relative", overflow: "hidden", fontFamily: "Arial, sans-serif", paddingBottom: 90 }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {FALLING.map((e, i) => (<span key={i} style={{ position: "absolute", left: `${(i * 12) % 100}%`, top: -20, fontSize: 26, animation: `fall ${6 + i}s linear infinite`, animationDelay: `${i * 0.8}s` }}>{e}</span>))}
      </div>
      <style>{`@keyframes fall { to { transform: translateY(110vh) rotate(360deg); } } @keyframes shine { 0%{box-shadow:0 0 0 0 rgba(34,197,94,.6)} 100%{box-shadow:0 0 0 14px rgba(34,197,94,0)} }`}</style>

      <header style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 32 }}>🌿</span><b style={{ fontSize: 20, color: "#166534" }}>Plante Doctor AI</b></div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setLang(lang === "fr" ? "ar" : "fr")} style={{ border: "1px solid #22c55e", background: "white", borderRadius: 20, padding: "6px 12px", cursor: "pointer" }}>{lang === "fr" ? "العربية" : "Français"}</button>
          <button onClick={() => setShowInfo(!showInfo)} style={{ width: 36, height: 36, borderRadius: "50%", background: "#22c55e", color: "white", border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: "bold", cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", flexShrink: 0, animation: "shine 1.5s infinite" }}>i</button>
        </div>
      </header>

      {showInfo && (<div style={{ position: "relative", zIndex: 2, margin: "0 18px", background: "white", borderRadius: 16, padding: 16, boxShadow: "0 4px 20px rgba(0,0,0,.1)" }}>
        <h3>{lang === "fr" ? "Comment ça marche ?" : "كيفاش كيخدم؟"}</h3>
        <p>{lang === "fr" ? "1. Prends une photo de ta plante. 2. L'AI analyse la photo. 3. Tu reçois le nom, la santé, les problèmes et la solution." : "1. صور نبتتك. 2. الذكاء الاصطناعي كيحلل التصويرة. 3. كتوصلك السمية والصحة والمشاكل والحل."}</p>
        <p><b>{lang === "fr" ? "Équipe :" : "الفريق :"}</b><br />1. Abdeladim Zouhir<br />2. Hafsa Abdelmoumen<br />3. Arwa Akoujim<br />4. Fatima Zahra El Maachi<br />Lycée Abdellah Ben Yassine - Inezgane, Aït Melloul</p>
      </div>)}

      {page === "diag" ? (
        <main style={{ position: "relative", zIndex: 2, maxWidth: 640, margin: "0 auto", padding: "10px 18px" }}>
          <h1 style={{ textAlign: "center", color: "#14532d", fontSize: 28 }}>{lang === "fr" ? "Diagnostique ta plante avec l'AI" : "شخص نبتتك بالذكاء الاصطناعي"}</h1>
          <p style={{ textAlign: "center", color: "#4b5563" }}>{lang === "fr" ? "Prends une photo, l'AI te dit le nom, la santé et le traitement." : "صور نبتتك، والذكاء الاصطناعي غادي يقوليك السمية والصحة والعلاج."}</p>
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={onFile} style={{ display: "none" }} />
          <button onClick={() => fileRef.current?.click()} style={{ width: "100%", padding: 16, background: "#22c55e", color: "white", border: "none", borderRadius: 16, fontSize: 18, fontWeight: "bold", cursor: "pointer" }}>{lang === "fr" ? "📷 Prendre une photo / Choisir une photo" : "📷 صور أو اختار تصويرة"}</button>
          {image && (<img src={image} alt="plante" style={{ width: "100%", borderRadius: 16, marginTop: 14, maxHeight: 380, objectFit: "cover" }} />)}
          {loading && (<p style={{ textAlign: "center", marginTop: 14 }}>⏳ {lang === "fr" ? "L'AI analyse..." : "الذكاء الاصطناعي كيحلل..."}</p>)}
          {errMsg && (<p style={{ background: "#fef2f2", color: "#b91c1c", padding: 12, borderRadius: 12, marginTop: 12 }}>{errMsg} - {lang === "fr" ? "Réessaie dans quelques secondes" : "عاود من بعد شوية"}</p>)}
          {result && (<div style={{ background: "white", borderRadius: 16, padding: 16, marginTop: 14, boxShadow: "0 4px 20px rgba(0,0,0,.08)" }}>
            <h2>🌿 {result.name}</h2><p style={{ color: "#6b7280" }}><i>{result.scientific}</i></p>
            <p><b>{lang === "fr" ? "Santé :" : "الصحة :"} {result.health}%</b></p>
            <div style={{ height: 10, background: "#e5e7eb", borderRadius: 10, overflow: "hidden" }}><div style={{ width: `${result.health}%`, height: "100%", background: result.health > 70 ? "#22c55e" : result.health > 40 ? "#f59e0b" : "#ef4444" }} /></div>
            <h3>{lang === "fr" ? "Problèmes" : "المشاكل"}</h3><ul>{result.problems?.map((p, i) => <li key={i}>{p}</li>)}</ul>
            <h3>{lang === "fr" ? "Solution" : "الحل"}</h3><p>{result.solution}</p>
            <h3>{lang === "fr" ? "Arrosage" : "السقي"}</h3><p>{result.watering}</p>
            <button onClick={addToGarden} style={{ width: "100%", padding: 12, background: "#166534", color: "white", border: "none", borderRadius: 12, cursor: "pointer", fontWeight: "bold" }}>{lang === "fr" ? "➕ Ajouter à Mon jardin" : "➕ زيدها فحديقتي"}</button>
          </div>)}
        </main>
      ) : (
        <main style={{ position: "relative", zIndex: 2, maxWidth: 640, margin: "0 auto", padding: "10px 18px" }}>
          <h1 style={{ textAlign: "center", color: "#14532d" }}>🌱 {lang === "fr" ? "Mon jardin" : "حديقتي"}</h1>
          {garden.length === 0 && <p style={{ textAlign: "center" }}>{lang === "fr" ? "Ton jardin est vide. Ajoute une plante depuis le Diagnostic." : "حديقتك خاوية. زيد نبتة من التشخيص."}</p>}
          {garden.map(p => (<div key={p.id} style={{ background: "white", borderRadius: 16, padding: 12, marginBottom: 12, display: "flex", gap: 12 }}>
            <img src={p.image} style={{ width: 90, height: 90, objectFit: "cover", borderRadius: 12 }} alt="" />
            <div style={{ flex: 1 }}><b>{p.name}</b><br /><small>{p.date} • {lang === "fr" ? "Santé" : "الصحة"} {p.health}% • {p.stage}</small><br /><small>{lang === "fr" ? "Dernier arrosage :" : "آخر سقي :"} {p.lastWater}</small><br />
              <button onClick={() => waterPlant(p.id)} style={{ marginTop: 6, marginRight: 6, background: "#22c55e", color: "white", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}>💧 {lang === "fr" ? "Arroser" : "سقي"}</button>
              <button onClick={() => removePlant(p.id)} style={{ background: "#fee2e2", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer" }}>🗑️</button>
            </div>
          </div>))}
        </main>
      )}

      <nav style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "white", display: "flex", borderTop: "1px solid #e5e7eb", zIndex: 10 }}>
        <button onClick={() => setPage("diag")} style={{ flex: 1, padding: 12, border: "none", background: page === "diag" ? "#dcfce7" : "white", cursor: "pointer", fontWeight: "bold", color: "#166534" }}>🔍<br />{lang === "fr" ? "Diagnostic" : "التشخيص"}</button>
        <button onClick={() => setPage("jardin")} style={{ flex: 1, padding: 12, border: "none", background: page === "jardin" ? "#dcfce7" : "white", cursor: "pointer", fontWeight: "bold", color: "#166534" }}>🌱<br />{lang === "fr" ? "Mon jardin" : "حديقتي"}</button>
      </nav>
    </div>
  );
}