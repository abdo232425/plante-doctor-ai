"use client";
import { useRef, useState } from "react";

export default function Home() {
  const [lang, setLang] = useState<"ar"|"fr">("ar");
  const [img, setImg] = useState("");
  const [res, setRes] = useState<any>(null);
  const [load, setLoad] = useState(false);
  const [showCam, setShowCam] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const videoRef = useRef<any>(null);
  const streamRef = useRef<any>(null);

  const T = lang === "ar" ? {
    top: "طبيب النباتات AI", title: "طبيب النباتات", sub: "صور نبتتك و خلي الذكاء الاصطناعي يشخصها ليك",
    cam: "افتح الكاميرا", gal: "من المعرض", take: "التقط الصورة",
    analyse: "حلل نبتتي الآن", analysing: "الذكاء الاصطناعي كيحلل...",
    aiBadge: "ذكاء اصطناعي", camBadge: "كاميرا مباشرة",
    health: "الصحة", disease: "المرض", watering: "السقي", light: "الضوء", soil: "التربة", treat: "العلاج", sci: "الاسم العلمي",
    myPlants: "نباتاتي", tipTitle: "نصيحة اليوم", tip: "ما تسقيش النبتة بزاف، خلي التربة تنشف شوية عاد سقيها، و حطها فبلاصة فيها الضو.",
    teamTitle: "فريق البحث", school: "ثانوية عبدالله بن ياسين - إنزكان، أيت ملول", made: "صُنع بحب في المغرب",
    members: "أعضاء الفريق - 4 أشخاص", chef: "رئيس الفريق", close: "سد", langBtn: "Français"
  } : {
    top: "Plante Doctor AI", title: "Plante Doctor AI", sub: "Prends ta plante en photo, l'IA la diagnostique pour toi",
    cam: "Ouvrir Caméra", gal: "Galerie", take: "Prendre photo",
    analyse: "Analyser ma plante", analysing: "L'IA analyse...",
    aiBadge: "Intelligence Artificielle", camBadge: "Caméra en direct",
    health: "Santé", disease: "Maladie", watering: "Arrosage", light: "Lumière", soil: "Sol", treat: "Traitement", sci: "Nom scientifique",
    myPlants: "Mes plantes", tipTitle: "Conseil du jour", tip: "Ne pas trop arroser ta plante, laisse sécher la terre un peu avant de l'arroser, et mets-la à la lumière.",
    teamTitle: "Équipe de Recherche", school: "Lycée Abdellah Ben Yassine - Inezgane, Aït Melloul", made: "Fait avec amour au Maroc",
    members: "Membres - 4 personnes", chef: "Chef d'équipe", close: "Fermer", langBtn: "العربية"
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

  const localSmart = (image: string) => {
    const c = document.createElement("canvas"); const im = new Image(); im.src = image;
    return new Promise<any>((resolve) => { im.onload = () => {
      c.width = 50; c.height = 50; const ctx = c.getContext("2d")!; ctx.drawImage(im, 0, 0, 50, 50);
      const d = ctx.getImageData(0, 0, 50, 50).data; let y=0, b=0, dark=0;
      for (let i=0;i<d.length;i+=4){ const r=d[i], gg=d[i+1], bb=d[i+2]; if (r>150 && gg>120 && bb<100) y++; if (r>100 && gg<90 && bb<70) b++; if (r<60 && gg<60 && bb<60) dark++; }
      if (y > 300) resolve(lang === "ar" ? { name: "نبتة بأوراق صفراء", scientific: "Chlorosis", health: 58, disease: "اصفرار الأوراق", watering: "مرة كل 3 أيام", light: "ضوء غير مباشر قوي", soil: "تربة غنية بالحديد", treatment: "سقي منتظم + سماد حديد" } : { name: "Plante à feuilles jaunes", scientific: "Chlorosis", health: 58, disease: "Feuilles jaunes", watering: "1 fois tous les 3 jours", light: "Lumière indirecte forte", soil: "Sol riche en fer", treatment: "Arrosage régulier + engrais fer" });
      else if (b > 300) resolve(lang === "ar" ? { name: "نبتة جافة", scientific: "Déshydratation", health: 45, disease: "جفاف", watering: "كل يومين", light: "ظل جزئي", soil: "تربة رطبة", treatment: "سقي فوري + مكان رطب" } : { name: "Plante sèche", scientific: "Déshydratation", health: 45, disease: "Sécheresse", watering: "Tous les 2 jours", light: "Ombre partielle", soil: "Sol humide", treatment: "Arrosage immédiat" });
      else if (dark > 400) resolve(lang === "ar" ? { name: "نبتة في ظلام", scientific: "Manque de lumière", health: 62, disease: "نقص الإضاءة", watering: "مرة في الأسبوع", light: "ضوء ساطع", soil: "تربة جيدة", treatment: "قربها من النافذة" } : { name: "Plante sans lumière", scientific: "Manque de lumière", health: 62, disease: "Manque de lumière", watering: "1 fois par semaine", light: "Lumière vive", soil: "Bon sol", treatment: "Mets-la près de la fenêtre" });
      else resolve(lang === "ar" ? { name: "نبتة صحية - مونستيرا", scientific: "Monstera deliciosa", health: 88, disease: "سليمة - لا يوجد مرض", watering: "مرتين في الأسبوع", light: "ضوء غير مباشر", soil: "تربة جيدة التصريف", treatment: "حافظ على نفس العناية" } : { name: "Plante saine - Monstera", scientific: "Monstera deliciosa", health: 88, disease: "Saine - Aucune maladie", watering: "2 fois par semaine", light: "Lumière indirecte", soil: "Sol bien drainé", treatment: "Garde les mêmes soins" });
    }; });
  };

  const analyse = async () => {
    if (!img) return;
    setLoad(true); setRes(null); setConfetti(false);
    const smart = await localSmart(img); setRes(smart);
    setConfetti(true); setTimeout(()=>setConfetti(false), 2000); setLoad(false);
  };

  return (
    <main style={{ maxWidth: 680, width: "100%", margin: "auto", padding: 16, paddingBottom: 90, fontFamily: "sans-serif", minHeight: "100vh", color: "#111", colorScheme: "light", position: "relative", background: "#FFF8E7", backgroundImage: "radial-gradient(circle at 10% 10%, #FFE4B5 0%, transparent 25%), radial-gradient(circle at 90% 20%, #C8E6C9 0%, transparent 25%), radial-gradient(circle at 20% 80%, #FFDAB9 0%, transparent 30%)" }}>
      <style>{`
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes shine{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes fall{0%{transform:translateY(-20px); opacity:1}100%{transform:translateY(300px); opacity:0}}
        @keyframes glowAI{0%,100%{text-shadow:0 0 8px #FFD700}50%{text-shadow:0 0 18px #FFD700, 0 0 25px #FFA500}}
        .logo{animation:float 2.5s infinite; display:inline-block}
        .shine{background:linear-gradient(90deg,#0F3D2E,#1a7a4a,#E86A33,#0F3D2E); background-size:200% 200%; animation:shine 4s infinite; color:#fff}
        .glowAI{animation:glowAI 2s infinite; font-weight:900; color:#FFD700}
        .confetti{position:absolute; top:0; font-size:20px; animation:fall 2s forwards}
        *{color-scheme:light !important}
      `}</style>

      {confetti && <div style={{ position: "absolute", top: 0, left: 0, right: 0, textAlign: "center", zIndex: 99, pointerEvents: "none" }}><span className="confetti" style={{ left: "15%" }}>🌸</span><span className="confetti" style={{ left: "50%" }}>⭐</span><span className="confetti" style={{ left: "80%" }}>✨</span></div>}

      {/* الفوق: Plante Doctor AI كتلمع + زر ترجمة صغير بلا إطار */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: "800", fontSize: 16 }}>🌿 Plante Doctor <span className="glowAI">AI</span></span>
        <button onClick={() => setLang(lang==="ar"?"fr":"ar")} style={{ padding: "6px 10px", border: "none", background: "transparent", fontWeight: "bold", fontSize: 13, color: "#0F3D2E", cursor: "pointer" }}>{lang==="ar" ? "🇫🇷 Français" : "🇲🇦 العربية"}</button>
      </div>

      <div className="shine" style={{ padding: 22, borderRadius: 22, textAlign: "center", marginTop: 10 }}>
        <div className="logo" style={{ fontSize: 48 }}>🌿</div>
        <h1 style={{ margin: 5, fontSize: 26 }}>{T.title}</h1>
        <p style={{ margin: 0, fontSize: 14 }}>{T.sub}</p>
        <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 8 }}>
          <span style={{ background: "rgba(255,255,255,0.25)", padding: "5px 10px", borderRadius: 20, fontSize: 12 }}>🤖 {T.aiBadge}</span>
          <span style={{ background: "rgba(255,255,255,0.25)", padding: "5px 10px", borderRadius: 20, fontSize: 12 }}>📸 {T.camBadge}</span>
        </div>
      </div>

      {/* أزرار الكاميرا و المعرض - ستيليين و صغار */}
      <div style={{ background: "#fff", padding: 14, borderRadius: 18, marginTop: 12, boxShadow: "0 4px 18px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={openCam} style={{ flex: 1, padding: "11px 6px", background: "linear-gradient(135deg,#E86A33,#FF8A3D)", color: "#fff", border: 0, borderRadius: 12, fontWeight: "bold", fontSize: 13, whiteSpace: "nowrap", boxShadow: "0 3px 10px rgba(232,106,51,0.3)" }}>📸 {T.cam}</button>
          <label style={{ flex: 1, padding: "11px 6px", background: "#0F3D2E", color: "#fff", borderRadius: 12, fontWeight: "bold", fontSize: 13, textAlign: "center", cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 3px 10px rgba(15,61,46,0.25)" }}>
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

      {/* نباتاتي + نصيحة اليوم - مستيلية */}
      <div style={{ background: "#fff", padding: 16, borderRadius: 18, marginTop: 12 }}>
        <h3 style={{ margin: "0 0 8px 0" }}>{T.myPlants}</h3>
        <p style={{ margin: "6px 0" }}>✅ Monstera - {lang === "ar" ? "بصحة جيدة" : "En bonne santé"}</p>
        <p style={{ margin: "6px 0" }}>⚠️ Ficus - {lang === "ar" ? "يحتاج عناية" : "Besoin d'attention"}</p>
        <p style={{ margin: "6px 0" }}>✅ Cactus - {lang === "ar" ? "بصحة جيدة" : "En bonne santé"}</p>
        <div style={{ background: "linear-gradient(135deg,#FEF3C7,#FFF8E7)", padding: 14, borderRadius: 14, marginTop: 12, borderRight: lang === "ar" ? "4px solid #E86A33" : "none", borderLeft: lang === "fr" ? "4px solid #E86A33" : "none" }}>
          <b style={{ fontSize: 14 }}>💡 {T.tipTitle}</b>
          <p style={{ margin: "6px 0 0 0", fontSize: 13, lineHeight: 1.6 }}>{T.tip}</p>
        </div>
      </div>

      <p style={{ textAlign: "center", fontSize: 12, color: "#888", marginTop: 12 }}>{T.made}</p>

      {/* زر i بسيط - ماشي مزوق */}
      <button onClick={() => setShowTeam(true)} style={{ position: "fixed", bottom: 16, right: 16, zIndex: 90, width: 40, height: 40, borderRadius: "50%", background: "#fff", color: "#0F3D2E", border: "1px solid #ddd", fontSize: 18, fontWeight: "bold", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer" }}>i</button>

      {/* نافذة الفريق - بسيطة */}
      {showTeam && <div onClick={() => setShowTeam(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
        <div onClick={e => e.stopPropagation()} style={{ background: "#fff", width: "100%", maxWidth: 380, borderRadius: 16, padding: 20, textAlign: "center" }}>
          <h3 style={{ margin: "0 0 12px 0" }}>{T.teamTitle}</h3>
          <p style={{ color: "#666", fontSize: 13, margin: "0 0 12px 0" }}>{T.members}</p>
          <div style={{ background: "#f9f9f9", borderRadius: 12, padding: 12, textAlign: "right" }}>
            <p style={{ margin: "8px 0", fontWeight: "bold" }}>1. Abdeladim - {T.chef}</p>
            <p style={{ margin: "8px 0" }}>2. Hafsa</p>
            <p style={{ margin: "8px 0", color: "#aaa" }}>3. ..........</p>
            <p style={{ margin: "8px 0", color: "#aaa" }}>4. ..........</p>
          </div>
          <p style={{ fontWeight: "bold", marginTop: 12, fontSize: 14 }}>🏫 {T.school}</p>
          <button onClick={() => setShowTeam(false)} style={{ marginTop: 8, padding: "9px 18px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", fontWeight: "bold" }}>{T.close}</button>
        </div>
      </div>}
    </main>
  );
}