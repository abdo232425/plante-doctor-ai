"use client";
import { useRef, useState } from "react";

export default function Home() {
  const [lang, setLang] = useState<"ar"|"fr">("fr");
  const [page, setPage] = useState<"home"|"garden">("home");
  const [img, setImg] = useState("");
  const [res, setRes] = useState<any>(null);
  const [load, setLoad] = useState(false);
  const [showCam, setShowCam] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const videoRef = useRef<any>(null);
  const streamRef = useRef<any>(null);

  const T = lang === "ar" ? {
    title: "طبيب النباتات", sub: "صور نبتتك و خلي Gemini الحقيقي يشخصها ليك",
    cam: "افتح الكاميرا", gal: "من المعرض", take: "التقط الصورة",
    analyse: "حلل نبتتي بـ Gemini", analysing: "Gemini الحقيقي كيحلل نبتتك...",
    aiBadge: "Gemini حقيقي", camBadge: "كاميرا مباشرة",
    health: "الصحة", disease: "المرض", watering: "السقي", light: "الضوء", soil: "التربة", treat: "العلاج", sci: "الاسم العلمي",
    capTitle: "شنو كيعرف يدير التطبيق؟", tipTitle: "نصيحة اليوم", tip: "ما تسقيش النبتة بزاف، خلي التربة تنشف شوية عاد سقيها، و حطها فبلاصة فيها الضو.",
    gardenTitle: "حديقتي", gardenSub: "تتبع النمو و السقي ديال نباتاتك",
    gardenBadge1: "6 نباتات", gardenBadge2: "متابعة حية",
    teamTitle: "فريق البحث", school: "ثانوية عبدالله بن ياسين - إنزكان، أيت ملول", made: "صُنع بحب في المغرب",
    members: "أعضاء الفريق - 4 أشخاص", close: "سد",
    navHome: "تشخيص", navGarden: "حديقتي",
    caps: ["📸 تحليل أي نبتة من التصويرة بـ Gemini الحقيقي","🌱 يعطيك اسم النبتة الحقيقي و الاسم العلمي","🩺 تشخيص كامل للمرض و الصحة","💧 تتبع السقي و مراحل النمو","🌍 نصائح الضوء و التربة و العلاج","🇲🇦🇫🇷 عربية كاملة أو فرنسية كاملة"],
    plants: [
      { name: "Coléus (Coleus)", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400", status: "À surveiller", statusAr: "راقبها", water: "Arrosage dans 4 j", waterAr: "السقي بعد 4 أيام", growth: 65, growthLabel: "مرحلة النمو", growthLabelFr: "Croissance" },
      { name: "Olivier", img: "https://images.unsplash.com/photo-1445264718234-a623be589d37?w=400", status: "À surveiller", statusAr: "راقبها", water: "Arrosage dans 4 j", waterAr: "السقي بعد 4 أيام", growth: 80, growthLabel: "مرحلة النمو", growthLabelFr: "Croissance" },
      { name: "Vigne (Vitis vinifera)", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400", status: "Alerte", statusAr: "خطر", water: "Arrosage dans 4 j", waterAr: "السقي بعد 4 أيام", growth: 45, growthLabel: "مرحلة النمو", growthLabelFr: "Croissance" },
      { name: "Poirier", img: "https://images.unsplash.com/photo-1470003757653-a6d8d5d7d5a8?w=400", status: "À surveiller", statusAr: "راقبها", water: "Arrosage dans 4 j", waterAr: "السقي بعد 4 أيام", growth: 70, growthLabel: "مرحلة النمو", growthLabelFr: "Croissance" },
      { name: "Pomme de terre (Solanum tuberosum)", img: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400", status: "Alerte", statusAr: "خطر", water: "Arrosage dans 3 j", waterAr: "السقي بعد 3 أيام", growth: 35, growthLabel: "مرحلة النمو", growthLabelFr: "Croissance" },
      { name: "Olivier", img: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=400", status: "À surveiller", statusAr: "راقبها", water: "Arrosage dans 2 j", waterAr: "السقي بعد يومين", growth: 90, growthLabel: "مرحلة النمو", growthLabelFr: "Croissance" },
    ]
  } : {
    title: "Plante Doctor", sub: "Prends ta plante en photo, le vrai Gemini la diagnostique",
    cam: "Ouvrir Caméra", gal: "Galerie", take: "Prendre photo",
    analyse: "Analyser avec Gemini", analysing: "Le vrai Gemini analyse ta plante...",
    aiBadge: "Vrai Gemini", camBadge: "Caméra en direct",
    health: "Santé", disease: "Maladie", watering: "Arrosage", light: "Lumière", soil: "Sol", treat: "Traitement", sci: "Nom scientifique",
    capTitle: "Que peut faire l'application ?", tipTitle: "Conseil du jour", tip: "Ne pas trop arroser ta plante, laisse sécher la terre un peu avant de l'arroser, et mets-la à la lumière.",
    gardenTitle: "Mon jardin", gardenSub: "Suivi de la croissance et de l'arrosage de tes plantes",
    gardenBadge1: "6 plantes", gardenBadge2: "Suivi en direct",
    teamTitle: "Équipe de Recherche", school: "Lycée Abdellah Ben Yassine - Inezgane, Aït Melloul", made: "Fait avec amour au Maroc",
    members: "Membres - 4 personnes", close: "Fermer",
    navHome: "Diagnostic", navGarden: "Mon jardin",
    caps: ["📸 Analyser n'importe quelle plante avec le vrai Gemini","🌱 Donner le vrai nom et le nom scientifique","🩺 Diagnostic complet de la maladie et de la santé","💧 Suivi de l'arrosage et des étapes de croissance","🌍 Conseils lumière, sol et traitement","🇲🇦🇫🇷 Tout en arabe ou tout en français"],
    plants: [
      { name: "Coléus (Coleus)", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400", status: "À surveiller", statusAr: "راقبها", water: "Arrosage dans 4 j", waterAr: "السقي بعد 4 أيام", growth: 65, growthLabel: "مرحلة النمو", growthLabelFr: "Croissance" },
      { name: "Olivier", img: "https://images.unsplash.com/photo-1445264718234-a623be589d37?w=400", status: "À surveiller", statusAr: "راقبها", water: "Arrosage dans 4 j", waterAr: "السقي بعد 4 أيام", growth: 80, growthLabel: "مرحلة النمو", growthLabelFr: "Croissance" },
      { name: "Vigne (Vitis vinifera)", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400", status: "Alerte", statusAr: "خطر", water: "Arrosage dans 4 j", waterAr: "السقي بعد 4 أيام", growth: 45, growthLabel: "مرحلة النمو", growthLabelFr: "Croissance" },
      { name: "Poirier", img: "https://images.unsplash.com/photo-1470003757653-a6d8d5d7d5a8?w=400", status: "À surveiller", statusAr: "راقبها", water: "Arrosage dans 4 j", waterAr: "السقي بعد 4 أيام", growth: 70, growthLabel: "مرحلة النمو", growthLabelFr: "Croissance" },
      { name: "Pomme de terre (Solanum tuberosum)", img: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400", status: "Alerte", statusAr: "خطر", water: "Arrosage dans 3 j", waterAr: "السقي بعد 3 أيام", growth: 35, growthLabel: "مرحلة النمو", growthLabelFr: "Croissance" },
      { name: "Olivier", img: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=400", status: "À surveiller", statusAr: "راقبها", water: "Arrosage dans 2 j", waterAr: "السقي بعد يومين", growth: 90, growthLabel: "مرحلة النمو", growthLabelFr: "Croissance" },
    ]
  };

  const openCam = async () => {
    try { setShowCam(true); const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); streamRef.current = s; setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = s; }, 300); }
    catch { alert(lang === "ar" ? "سمح للكاميرا" : "Autorise la caméra"); setShowCam(false); }
  };
  const takePhoto = () => {
    const c = document.createElement("canvas"); c.width = videoRef.current.videoWidth; c.height = videoRef.current.videoHeight;
    c.getContext("2d")?.drawImage(videoRef.current, 0, 0); setImg(c.toDataURL("image/jpeg", 0.85));
    streamRef.current?.getTracks().forEach((t: any) => t.stop()); setShowCam(false);
  };
  const onFile = (e: any) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => { setImg(r.result as string); setShowCam(false); }; r.readAsDataURL(f); e.target.value = "";
  };

  const analyseGemini = async (image: string) => {
    const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!key) return null;
    try {
      const base64 = image.split(",")[1];
      const prompt = lang === "ar"
        ? "أنت طبيب نباتات خبير. حلل هذه الصورة للنبتة و أعد JSON فقط: {\"name\":\"اسم النبتة بالعربية\",\"scientific\":\"الاسم العلمي\",\"health\": رقم من 0 إلى 100,\"disease\":\"المرض بالعربية\",\"watering\":\"السقي بالعربية\",\"light\":\"الضوء بالعربية\",\"soil\":\"التربة بالعربية\",\"treatment\":\"العلاج بالعربية مفصل\"} لا تعيد نفس الإجابة."
        : "Tu es un docteur des plantes expert. Analyse cette photo et retourne UNIQUEMENT du JSON: {\"name\":\"nom en français\",\"scientific\":\"nom scientifique\",\"health\": nombre 0 à 100,\"disease\":\"maladie en français\",\"watering\":\"arrosage en français\",\"light\":\"lumière en français\",\"soil\":\"sol en français\",\"treatment\":\"traitement en français détaillé\"} Ne répète jamais la même réponse.";
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: "image/jpeg", data: base64 } }] }] })
      });
      const j = await r.json();
      const txt = j.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const clean = txt.replace(/```json|```/g, "").trim();
      return JSON.parse(clean);
    } catch { return null; }
  };

  
   
  

  const analyse = async () => {
  if (!img) return;
  setLoad(true); setRes(null); setConfetti(false);
  const gemini = await analyseGemini(img);
  if (!gemini) {
    setLoad(false);
    return;
  }
  setRes(gemini);
  setConfetti(true); setTimeout(()=>setConfetti(false), 2000); setLoad(false);
};
  

  return (
    <main style={{ maxWidth: 680, width: "100%", margin: "auto", padding: 16, paddingBottom: 110, fontFamily: "sans-serif", minHeight: "100vh", color: "#111", position: "relative", background: "#E8F5E9", overflow: "hidden" }}>
      <style>{`
        @keyframes float{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-8px) rotate(2deg)}}
        @keyframes shine{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes fall{0%{transform:translateY(-60px) rotate(0deg); opacity:0}10%{opacity:1}100%{transform:translateY(110vh) rotate(360deg); opacity:0}}
        @keyframes glowAI{0%,100%{text-shadow:0 0 8px #FFD700}50%{text-shadow:0 0 18px #FFD700, 0 0 30px #FFA500}}
        @keyframes pulseLogo{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
        @keyframes iMove{0%,100%{transform:translateY(0) rotate(0deg); box-shadow:0 0 10px #FFD700}50%{transform:translateY(-6px) rotate(5deg); box-shadow:0 0 20px #FFD700, 0 0 30px #FFA500}}
        .logo{animation:float 2.5s infinite; display:inline-block}
        .shine{background:linear-gradient(90deg,#0F3D2E,#1a7a4a,#E86A33,#FF8A3D,#0F3D2E); background-size:300% 300%; animation:shine 5s infinite; color:#fff}
        .shineGarden{background:linear-gradient(90deg,#0F3D2E,#22c55e,#F59E0B,#E86A33,#0F3D2E); background-size:300% 300%; animation:shine 5s infinite; color:#fff}
        .glowAI{animation:glowAI 1.8s infinite; font-weight:900; color:#FFD700; font-size:18px}
        .confetti{position:absolute; top:0; font-size:20px; animation:fall 2s forwards}
        .topLogo{animation:pulseLogo 2s infinite; display:inline-flex; align-items:center; gap:6px}
        .falling{position:absolute; top:0; font-size:26px; animation:fall linear infinite; opacity:0.7; pointer-events:none; z-index:0}
        .iBtn{animation:iMove 2s infinite !important}
      `}</style>

      {/* نفس الخلفية فالصفحتين بجوج - أوراق كيطيحو */}
      <span className="falling" style={{ left: "5%", animationDuration: "7s" }}>🌿</span>
      <span className="falling" style={{ left: "18%", animationDuration: "9s", animationDelay: "1s" }}>🍃</span>
      <span className="falling" style={{ left: "32%", animationDuration: "8s", animationDelay: "2s" }}>🌱</span>
      <span className="falling" style={{ left: "48%", animationDuration: "10s", animationDelay: "0.5s" }}>🪴</span>
      <span className="falling" style={{ left: "62%", animationDuration: "7s", animationDelay: "1.5s" }}>🌿</span>
      <span className="falling" style={{ left: "78%", animationDuration: "9s", animationDelay: "0.2s" }}>🍃</span>
      <span className="falling" style={{ left: "90%", animationDuration: "8s", animationDelay: "2.5s" }}>🌱</span>

      {confetti && <div style={{ position: "absolute", top: 0, left: 0, right: 0, textAlign: "center", zIndex: 99, pointerEvents: "none" }}><span className="confetti" style={{ left: "15%" }}>🌸</span><span className="confetti" style={{ left: "50%" }}>⭐</span><span className="confetti" style={{ left: "80%" }}>✨</span></div>}

      <div style={{ position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="topLogo" style={{ fontWeight: "900", fontSize: 16, color: "#0F3D2E" }}>
          <span style={{ background: "linear-gradient(135deg,#22c55e,#0F3D2E)", color: "#fff", width: 30, height: 30, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌿</span>
          Plante Doctor <span className="glowAI">AI</span>
        </span>
        <button onClick={() => setLang(lang==="ar"?"fr":"ar")} style={{ padding: "6px 10px", border: "none", background: "transparent", fontWeight: "bold", fontSize: 13, color: "#0F3D2E", cursor: "pointer" }}>{lang==="ar" ? "🇫🇷 Français" : "🇲🇦 العربية"}</button>
      </div>

      {/* ============ الصفحة اللولة - Diagnostic ============ */}
      {page === "home" && <>
      <div className="shine" style={{ padding: 22, borderRadius: 22, textAlign: "center", marginTop: 10 }}>
        <div className="logo" style={{ fontSize: 62, background: "#fff", width: 92, height: 92, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "auto", boxShadow: "0 8px 20px rgba(0,0,0,0.25)" }}>🩺</div>
        <h1 style={{ margin: "10px 0 5px 0", fontSize: 26 }}>{T.title} <span className="glowAI">AI</span></h1>
        <p style={{ margin: 0, fontSize: 14 }}>{T.sub}</p>
        <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 8 }}>
          <span style={{ background: "rgba(255,255,255,0.25)", padding: "5px 10px", borderRadius: 20, fontSize: 12 }}>🤖✨ {T.aiBadge}</span>
          <span style={{ background: "rgba(255,255,255,0.25)", padding: "5px 10px", borderRadius: 20, fontSize: 12 }}>📸 {T.camBadge}</span>
        </div>
      </div>

      <div style={{ background: "#fff", padding: 14, borderRadius: 18, marginTop: 12, boxShadow: "0 4px 18px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={openCam} style={{ flex: 1, padding: "11px 6px", background: "linear-gradient(135deg,#E86A33,#FF8A3D)", color: "#fff", border: 0, borderRadius: 12, fontWeight: "bold", fontSize: 13, whiteSpace: "nowrap" }}>📸 {T.cam}</button>
          <label style={{ flex: 1, padding: "11px 6px", background: "#0F3D2E", color: "#fff", borderRadius: 12, fontWeight: "bold", fontSize: 13, textAlign: "center", cursor: "pointer", whiteSpace: "nowrap" }}>
            🖼️ {T.gal}
            <input type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
          </label>
        </div>
        {showCam && <div style={{ marginTop: 12 }}><video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", borderRadius: 14, background: "#000" }} /><button onClick={takePhoto} style={{ width: "100%", padding: 11, background: "#14532d", color: "#fff", border: 0, borderRadius: 10, marginTop: 8, fontWeight: "bold", fontSize: 13 }}>{T.take}</button></div>}
        {img && !showCam && <div style={{ marginTop: 12 }}><img src={img} style={{ width: "100%", borderRadius: 14, maxHeight: 340, objectFit: "cover" }} /><button onClick={analyse} style={{ width: "100%", padding: 13, background: "linear-gradient(90deg,#E86A33,#FF8A3D)", color: "#fff", border: 0, borderRadius: 12, marginTop: 8, fontWeight: "bold", fontSize: 14 }}>{load ? T.analysing : T.analyse}</button></div>}
      </div>

      {res && <div style={{ background: "#fff", padding: 16, borderRadius: 18, marginTop: 12, border: "2px solid #dcfce7" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 82, height: 82, borderRadius: "50%", background: `conic-gradient(#22c55e ${res.health * 3.6}deg, #eee 0deg)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ width: 62, height: 62, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: 18 }}>{res.health}%</div>
          </div>
          <div><h2 style={{ margin: "2px 0", fontSize: 19 }}>🌱 {res.name}</h2><p style={{ margin: 0, fontSize: 12, color: "#666" }}>{res.scientific}</p></div>
        </div>
        <p style={{ marginTop: 10 }}><b>{T.health}:</b> {res.health}% - {res.disease}</p>
        <p>💧 <b>{T.watering}:</b> {res.watering}</p><p>☀️ <b>{T.light}:</b> {res.light}</p><p>🌍 <b>{T.soil}:</b> {res.soil}</p><p>💊 <b>{T.treat}:</b> {res.treatment}</p>
      </div>}

      <div style={{ background: "#fff", padding: 16, borderRadius: 18, marginTop: 12 }}>
        <h3 style={{ margin: "0 0 10px 0" }}>{T.capTitle}</h3>
        {T.caps.map((c: string, i: number) => <p key={i} style={{ margin: "8px 0", fontSize: 14, lineHeight: 1.5 }}>{c}</p>)}
        <div style={{ background: "linear-gradient(135deg,#FEF3C7,#FFF8E7)", padding: 14, borderRadius: 14, marginTop: 12, borderRight: lang === "ar" ? "4px solid #E86A33" : "none", borderLeft: lang === "fr" ? "4px solid #E86A33" : "none" }}>
          <b style={{ fontSize: 14 }}>💡 {T.tipTitle}</b>
          <p style={{ margin: "6px 0 0 0", fontSize: 13, lineHeight: 1.6 }}>{T.tip}</p>
        </div>
      </div>
      </>}

      {/* ============ الصفحة التانية - Mon jardin - مزوقة كيما اللولة ============ */}
      {page === "garden" && <>
      <div className="shineGarden" style={{ padding: 22, borderRadius: 22, textAlign: "center", marginTop: 10 }}>
        <div className="logo" style={{ fontSize: 62, background: "#fff", width: 92, height: 92, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "auto", boxShadow: "0 8px 20px rgba(0,0,0,0.25)" }}>🌿</div>
        <h1 style={{ margin: "10px 0 5px 0", fontSize: 26 }}>{T.gardenTitle}</h1>
        <p style={{ margin: 0, fontSize: 14 }}>{T.gardenSub}</p>
        <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 8 }}>
          <span style={{ background: "rgba(255,255,255,0.25)", padding: "5px 10px", borderRadius: 20, fontSize: 12 }}>🪴 {T.gardenBadge1}</span>
          <span style={{ background: "rgba(255,255,255,0.25)", padding: "5px 10px", borderRadius: 20, fontSize: 12 }}>💧 {T.gardenBadge2}</span>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        {T.plants.map((p: any, i: number) => (
          <div key={i} style={{ background: "#fff", padding: 12, borderRadius: 18, marginBottom: 10, display: "flex", gap: 12, alignItems: "center", boxShadow: "0 4px 18px rgba(0,0,0,0.06)", border: "1px solid #BBF7D0" }}>
            <img src={p.img} alt={p.name} style={{ width: 85, height: 85, borderRadius: 14, objectFit: "cover", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <b style={{ fontSize: 15, color: "#0F3D2E" }}>{p.name}</b>
              <div style={{ marginTop: 6 }}><span style={{ background: p.status === "Alerte" ? "#FEE2E2" : "#FEF3C7", color: p.status === "Alerte" ? "#991B1B" : "#92400E", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: "bold" }}>{lang === "ar" ? p.statusAr : p.status}</span></div>
              <p style={{ margin: "6px 0 4px 0", fontSize: 13, color: "#1D4ED8", fontWeight: "bold" }}>💧 {lang === "ar" ? p.waterAr : p.water}</p>
              <p style={{ margin: "2px 0", fontSize: 12, color: "#666" }}>🌱 {lang === "ar" ? p.growthLabel : p.growthLabelFr} - {p.growth}%</p>
              <div style={{ height: 7, background: "#E5E7EB", borderRadius: 10, marginTop: 4 }}><div style={{ width: `${p.growth}%`, height: "100%", background: "linear-gradient(90deg,#22c55e,#0F3D2E)", borderRadius: 10 }} /></div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "linear-gradient(135deg,#FEF3C7,#FFF8E7)", padding: 14, borderRadius: 14, marginTop: 4, borderRight: lang === "ar" ? "4px solid #22c55e" : "none", borderLeft: lang === "fr" ? "4px solid #22c55e" : "none" }}>
        <b style={{ fontSize: 14 }}>💡 {T.tipTitle}</b>
        <p style={{ margin: "6px 0 0 0", fontSize: 13, lineHeight: 1.6 }}>{T.tip}</p>
      </div>
      </>}

      <p style={{ textAlign: "center", fontSize: 12, color: "#888", marginTop: 12 }}>{T.made}</p>
      </div>

      <button onClick={() => setShowTeam(true)} className="iBtn" style={{ position: "fixed", bottom: 88, right: 16, zIndex: 90, width: 44, height: 44, borderRadius: "50%", background: "#fff", color: "#0F3D2E", border: "2px solid #FFD700", fontSize: 20, fontWeight: "bold", cursor: "pointer" }}>i</button>

      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 80, background: "#fff", borderTop: "1px solid #eee", padding: "10px 12px", display: "flex", gap: 10, boxShadow: "0 -2px 12px rgba(0,0,0,0.08)" }}>
        <button onClick={() => setPage("home")} style={{ flex: 1, padding: 12, borderRadius: 14, border: "none", background: page === "home" ? "linear-gradient(135deg,#0F3D2E,#1a7a4a)" : "#F3F4F6", color: page === "home" ? "#fff" : "#0F3D2E", fontWeight: "bold", fontSize: 14, cursor: "pointer" }}>🩺 {T.navHome}</button>
        <button onClick={() => setPage("garden")} style={{ flex: 1, padding: 12, borderRadius: 14, border: "none", background: page === "garden" ? "linear-gradient(135deg,#E86A33,#FF8A3D)" : "#F3F4F6", color: page === "garden" ? "#fff" : "#0F3D2E", fontWeight: "bold", fontSize: 14, cursor: "pointer" }}>🌿 {T.navGarden}</button>
      </div>

      {showTeam && <div onClick={() => setShowTeam(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
        <div onClick={e => e.stopPropagation()} style={{ background: "#fff", width: "100%", maxWidth: 380, borderRadius: 16, padding: 20, textAlign: "center" }}>
          <h3 style={{ margin: "0 0 12px 0" }}>{T.teamTitle}</h3>
          <p style={{ color: "#666", fontSize: 13, margin: "0 0 12px 0" }}>{T.members}</p>
          <div style={{ background: "#f9f9f9", borderRadius: 12, padding: 12, textAlign: "right" }}>
            <p style={{ margin: "8px 0", fontWeight: "bold" }}>1. Abdeladim Zouhir</p>
            <p style={{ margin: "8px 0" }}>2. Hafsa Abdelmoumen</p>
            <p style={{ margin: "8px 0" }}>3. Arwa Akoujim</p>
            <p style={{ margin: "8px 0" }}>4. Fatima Zahra El Maachi</p>
          </div>
          <p style={{ fontWeight: "bold", marginTop: 12, fontSize: 14 }}>🏫 {T.school}</p>
          <button onClick={() => setShowTeam(false)} style={{ marginTop: 8, padding: "9px 18px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", fontWeight: "bold" }}>{T.close}</button>
        </div>
      </div>}
    </main>
  );
}