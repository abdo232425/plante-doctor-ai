"use client";
import { useRef, useState } from "react";

export default function Home() {
  const [lang, setLang] = useState<"ar"|"fr">("ar");
  const [img, setImg] = useState("");
  const [key, setKey] = useState("");
  const [aiType, setAiType] = useState("auto");
  const [res, setRes] = useState<any>(null);
  const [load, setLoad] = useState(false);
  const [showCam, setShowCam] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const videoRef = useRef<any>(null);
  const streamRef = useRef<any>(null);
  const fileRef = useRef<any>(null);

  const T = lang === "ar" ? {
    title: "طبيب النباتات", sub: "صور نبتتك و خلي AI يشخصها ليك ✨",
    cam: "📸 افتح الكاميرا", gal: "🖼️ من المعرض", take: "📷 التقط الصورة",
    analyse: "✨ حلل نبتتي الآن", analysing: "⏳ AI كيحلل...",
    health: "الصحة", disease: "المرض", watering: "السقي", light: "الضوء", soil: "التربة", treat: "العلاج", sci: "الاسم العلمي",
    myPlants: "🪴 نباتاتي", tip: "💡 نصيحة اليوم: ما تسقيش بزاف",
    teamTitle: "👨‍🎓 فريق البحث", school: "ثانوية عبدالله بن ياسين - إنزكان، أيت ملول", made: "صُنع بحب في المغرب 🇲🇦",
    members: "أعضاء الفريق - 4 أشخاص", chef: "رئيس الفريق", close: "✕ سد"
  } : {
    title: "Plante Doctor AI", sub: "Prends ta plante en photo ✨",
    cam: "📸 Ouvrir Caméra", gal: "🖼️ Galerie", take: "📷 Prendre photo",
    analyse: "✨ Analyser avec IA", analysing: "⏳ L'IA analyse...",
    health: "Santé", disease: "Maladie", watering: "Arrosage", light: "Lumière", soil: "Sol", treat: "Traitement", sci: "Nom scientifique",
    myPlants: "🪴 Mes plantes", tip: "💡 Conseil: Ne pas trop arroser.",
    teamTitle: "👨‍🎓 Équipe de Recherche", school: "Lycée Abdellah Ben Yassine - Inezgane, Aït Melloul", made: "Fait avec amour au Maroc 🇲🇦",
    members: "Membres - 4 personnes", chef: "Chef d'équipe", close: "✕ Fermer"
  };

  const openCam = async () => {
    try { setShowCam(true); const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); streamRef.current = s; setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = s; }, 300); }
    catch { alert("سمح للكاميرا"); setShowCam(false); }
  };
  const takePhoto = () => {
    const c = document.createElement("canvas"); c.width = videoRef.current.videoWidth; c.height = videoRef.current.videoHeight;
    c.getContext("2d")?.drawImage(videoRef.current, 0, 0); setImg(c.toDataURL("image/jpeg", 0.85));
    streamRef.current?.getTracks().forEach((t: any) => t.stop()); setShowCam(false);
  };
  const onFile = (e: any) => { const f = e.target.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => setImg(r.result as string); r.readAsDataURL(f); };

  const localSmart = (image: string) => {
    const c = document.createElement("canvas"); const im = new Image(); im.src = image;
    return new Promise<any>((resolve) => { im.onload = () => {
      c.width = 50; c.height = 50; const ctx = c.getContext("2d")!; ctx.drawImage(im, 0, 0, 50, 50);
      const d = ctx.getImageData(0, 0, 50, 50).data; let y=0, b=0, dark=0;
      for (let i=0;i<d.length;i+=4){ const r=d[i], gg=d[i+1], bb=d[i+2]; if (r>150 && gg>120 && bb<100) y++; if (r>100 && gg<90 && bb<70) b++; if (r<60 && gg<60 && bb<60) dark++; }
      if (y > 300) resolve({ name_ar: "نبتة بأوراق صفراء", name_fr: "Plante à feuilles jaunes", scientific: "Chlorosis", health: 58, disease: "اصفرار الأوراق", watering: "مرة كل 3 أيام", light: "ضوء غير مباشر قوي", soil: "تربة غنية بالحديد", treatment: "سقي منتظم + سماد حديد" });
      else if (b > 300) resolve({ name_ar: "نبتة جافة", name_fr: "Plante sèche", scientific: "Déshydratation", health: 45, disease: "جفاف", watering: "كل يومين", light: "ظل جزئي", soil: "تربة رطبة", treatment: "سقي فوري + مكان رطب" });
      else if (dark > 400) resolve({ name_ar: "نبتة في ظلام", name_fr: "Plante sans lumière", scientific: "Manque de lumière", health: 62, disease: "نقص الإضاءة", watering: "مرة في الأسبوع", light: "ضوء ساطع", soil: "تربة جيدة", treatment: "قربها من النافذة" });
      else resolve({ name_ar: "نبتة صحية - مونستيرا", name_fr: "Plante saine - Monstera", scientific: "Monstera deliciosa", health: 88, disease: "سليمة - لا يوجد مرض", watering: "مرتين في الأسبوع", light: "ضوء غير مباشر", soil: "تربة جيدة التصريف", treatment: "حافظ على نفس العناية" });
    }; });
  };

  const analyse = async () => {
    if (!img) return alert("صور بعدا");
    setLoad(true); setRes(null); setConfetti(false);
    try {
      if (key && aiType !== "local") {
        const base64 = img.split(",")[1];
        if (aiType === "chatgpt") {
          const r = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` }, body: JSON.stringify({ model: "gpt-4o-mini", messages: [{ role: "user", content: [{ type: "text", text: "Analyse, retourne JSON: {name_ar,name_fr,scientific,health,disease,watering,light,soil,treatment} health en nombre" }, { type: "image_url", image_url: { url: img } }] }] }) });
          const d = await r.json(); let p = JSON.parse(d.choices[0].message.content.replace(/```json|```/g, "")); if(typeof p.health==="string") p.health=88; setRes(p);
        } else {
          const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: "حلل هاد النبتة، رجع JSON فقط: {name_ar,name_fr,scientific,health,disease,watering,light,soil,treatment} health رقم" }, { inlineData: { mimeType: "image/jpeg", data: base64 } }] }] }) });
          const d = await r.json(); let p = JSON.parse(d.candidates[0].content.parts[0].text.replace(/```json|```/g, "")); if(typeof p.health==="string") p.health=88; setRes(p);
        }
      } else { setRes(await localSmart(img)); }
      setConfetti(true); setTimeout(()=>setConfetti(false), 2500);
    } catch { setRes(await localSmart(img)); setConfetti(true); }
    setLoad(false);
  };

  return (
    <main style={{ maxWidth: 620, margin: "auto", padding: 16, paddingBottom: 80, fontFamily: "sans-serif", background: "linear-gradient(180deg,#FFF8E7,#E8F5E9,#FFF8E7)", minHeight: "100vh", color: "#111", colorScheme: "light", position: "relative", overflow: "hidden" }}>
      <style>{`
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes shine{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes fall{0%{transform:translateY(-20px); opacity:1}100%{transform:translateY(350px); opacity:0}}
        @keyframes glow{0%,100%{box-shadow:0 0 15px #E86A33}50%{box-shadow:0 0 30px #E86A33}}
        .logo{animation:float 2.5s infinite; display:inline-block}
        .shine{background:linear-gradient(90deg,#0F3D2E,#1a7a4a,#E86A33,#0F3D2E); background-size:200% 200%; animation:shine 4s infinite; color:#fff}
        .glow{animation:glow 2s infinite}
        .confetti{position:absolute; top:0; font-size:22px; animation:fall 2.5s forwards}
        *{color-scheme:light !important}
      `}</style>

      {confetti && <div style={{ position: "absolute", top: 0, left: 0, right: 0, textAlign: "center", zIndex: 99, pointerEvents: "none" }}><span className="confetti" style={{ left: "10%" }}>🌸</span><span className="confetti" style={{ left: "50%" }}>⭐</span><span className="confetti" style={{ left: "85%" }}>✨</span></div>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: "bold" }}>🌿 Plante Doctor</span>
        <button onClick={() => setLang(lang==="ar"?"fr":"ar")} style={{ padding: "8px 14px", borderRadius: 20, border: "1px solid #0F3D2E", background: "#fff", fontWeight: "bold" }}>{lang==="ar" ? "🇫🇷 Français" : "🇲🇦 العربية"}</button>
      </div>

      <div className="shine" style={{ padding: 24, borderRadius: 26, textAlign: "center", marginTop: 12 }}>
        <div className="logo" style={{ fontSize: 56 }}>🌿</div>
        <h1 style={{ margin: 5, fontSize: 28 }}>{T.title}</h1>
        <p style={{ margin: 0, fontSize: 14 }}>{T.sub}</p>
        <div style={{ marginTop: 12, display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{ background: "rgba(255,255,255,0.25)", padding: "5px 12px", borderRadius: 20, fontSize: 12 }}>🤖 AI + Gemini + ChatGPT</span>
          <span style={{ background: "rgba(255,255,255,0.25)", padding: "5px 12px", borderRadius: 20, fontSize: 12 }}>📸 Camera Live</span>
        </div>
      </div>

      <div style={{ background: "#fff", padding: 16, borderRadius: 20, marginTop: 14, boxShadow: "0 6px 25px rgba(0,0,0,0.08)" }}>
        <label style={{ fontWeight: "bold", fontSize: 13 }}>🤖 اختر الـ AI - Choisis ton IA</label>
        <select value={aiType} onChange={e => setAiType(e.target.value)} style={{ width: "100%", padding: 11, borderRadius: 10, marginTop: 8, background: "#fff" }}>
          <option value="auto">✨ تلقائي - Auto (يخدم بلا مفتاح)</option><option value="gemini">💎 Gemini - Google</option><option value="chatgpt">🧠 ChatGPT - OpenAI</option><option value="local">🌱 ذكي محلي - Local</option>
        </select>
        <input value={key} onChange={e => setKey(e.target.value)} placeholder="مفتاح Gemini ولا ChatGPT هنا - اختياري" style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #ddd", marginTop: 8, boxSizing: "border-box" }} />
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <button onClick={openCam} className="glow" style={{ flex: 1, padding: 16, background: "#E86A33", color: "#fff", border: 0, borderRadius: 14, fontWeight: "bold", fontSize: 15 }}>{T.cam}</button>
          <button onClick={() => fileRef.current.click()} style={{ flex: 1, padding: 16, background: "#0F3D2E", color: "#fff", border: 0, borderRadius: 14, fontWeight: "bold", fontSize: 15 }}>{T.gal}</button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" hidden onChange={onFile} />
        {showCam && <div style={{ marginTop: 14 }}><video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", borderRadius: 16, background: "#000" }} /><button onClick={takePhoto} style={{ width: "100%", padding: 13, background: "#14532d", color: "#fff", border: 0, borderRadius: 11, marginTop: 8, fontWeight: "bold" }}>{T.take}</button></div>}
        {img && !showCam && <div style={{ marginTop: 14 }}><img src={img} style={{ width: "100%", borderRadius: 18, maxHeight: 380, objectFit: "cover" }} /><button onClick={analyse} style={{ width: "100%", padding: 16, background: "linear-gradient(90deg,#E86A33,#FF8A3D)", color: "#fff", border: 0, borderRadius: 14, marginTop: 10, fontWeight: "bold", fontSize: 16 }}>{load ? T.analysing : T.analyse}</button></div>}
      </div>

      {res && <div style={{ background: "#fff", padding: 18, borderRadius: 20, marginTop: 14, border: "2px solid #dcfce7" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 90, height: 90, borderRadius: "50%", background: `conic-gradient(#22c55e ${res.health * 3.6}deg, #eee 0deg)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ width: 68, height: 68, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: 20 }}>{res.health}%</div>
          </div>
          <div><p style={{ color: "green", fontSize: 12, fontWeight: "bold", margin: 0 }}>✅ تحليل AI</p><h2 style={{ margin: "4px 0" }}>🌱 {lang==="ar" ? res.name_ar : res.name_fr}</h2><p style={{ margin: 0, fontSize: 13 }}>{res.scientific}</p></div>
        </div>
        <p style={{ marginTop: 12 }}><b>{T.health}:</b> {res.health}% - {res.disease}</p>
        <p>💧 <b>{T.watering}:</b> {res.watering}</p><p>☀️ <b>{T.light}:</b> {res.light}</p><p>🌍 <b>{T.soil}:</b> {res.soil}</p><p>💊 <b>{T.treat}:</b> {res.treatment}</p>
      </div>}

      <div style={{ background: "#fff", padding: 16, borderRadius: 16, marginTop: 14 }}>
        <h3 style={{ margin: 0 }}>{T.myPlants}</h3><p>✅ Monstera - En bonne santé</p><p>⚠️ Ficus - Besoin d'attention</p><p>✅ Cactus - En bonne santé</p>
        <p style={{ background: "#FEF3C7", padding: 10, borderRadius: 10 }}>{T.tip}</p>
      </div>

      <p style={{ textAlign: "center", fontSize: 12, color: "#888", marginTop: 16 }}>{T.made}</p>

      {/* زر i الصغير فالقنت لتحت */}
      <button onClick={() => setShowTeam(true)} title="الفريق - Équipe" style={{ position: "fixed", bottom: 18, right: 18, zIndex: 90, width: 46, height: 46, borderRadius: "50%", background: "#0F3D2E", color: "#fff", border: "2px solid #E86A33", fontSize: 20, fontWeight: "bold", boxShadow: "0 5px 15px rgba(0,0,0,0.25)", cursor: "pointer" }}>i</button>

      {/* نافذة الفريق */}
      {showTeam && <div onClick={() => setShowTeam(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
        <div onClick={e => e.stopPropagation()} style={{ background: "#fff", width: "100%", maxWidth: 400, borderRadius: 22, padding: 22, textAlign: "center" }}>
          <div style={{ fontSize: 44 }}>🎓</div>
          <h2 style={{ margin: "8px 0 4px 0" }}>{T.teamTitle}</h2>
          <p style={{ color: "#888", fontSize: 13, margin: 0 }}>{T.members}</p>
          <div style={{ background: "#FFF8E7", borderRadius: 14, padding: 14, marginTop: 14, textAlign: "right" }}>
            <p style={{ margin: "8px 0", fontWeight: "bold", fontSize: 18 }}>👑 1. Abdeladim <span style={{ background: "#E86A33", color: "#fff", fontSize: 11, padding: "3px 8px", borderRadius: 10 }}>{T.chef}</span></p>
            <p style={{ margin: "8px 0", fontSize: 17 }}>👤 2. Hafsa</p>
            <p style={{ margin: "8px 0", fontSize: 17, color: "#aaa" }}>👤 3. ..........</p>
            <p style={{ margin: "8px 0", fontSize: 17, color: "#aaa" }}>👤 4. ..........</p>
          </div>
          <p style={{ background: "#E86A33", color: "#fff", padding: "8px 16px", borderRadius: 20, fontWeight: "bold", marginTop: 12 }}>🏫 {T.school}</p>
          <button onClick={() => setShowTeam(false)} style={{ marginTop: 12, padding: "10px 20px", borderRadius: 12, border: 0, background: "#0F3D2E", color: "#fff", fontWeight: "bold" }}>{T.close}</button>
        </div>
      </div>}
    </main>
  );
}