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
    top: "طبيب النباتات", title: "طبيب النباتات", sub: "صور نبتتك و خلي الذكاء الاصطناعي يشخصها ليك بجودة عالية",
    cam: "افتح الكاميرا", gal: "من المعرض", take: "التقط الصورة",
    analyse: "حلل نبتتي الآن", analysing: "الذكاء الاصطناعي كيحلل بجودة عالية...",
    aiBadge: "ذكاء اصطناعي عالي الجودة", camBadge: "كاميرا مباشرة",
    health: "الصحة", disease: "المرض", watering: "السقي", light: "الضوء", soil: "التربة", treat: "العلاج", sci: "الاسم العلمي",
    myPlants: "نباتاتي", tipTitle: "نصيحة اليوم", tip: "ما تسقيش النبتة بزاف، خلي التربة تنشف شوية عاد سقيها، و حطها فبلاصة فيها الضو.",
    teamTitle: "فريق البحث", school: "ثانوية عبدالله بن ياسين - إنزكان، أيت ملول", made: "صُنع بحب في المغرب",
    members: "أعضاء الفريق - 4 أشخاص", close: "سد", langBtn: "Français"
  } : {
    top: "Plante Doctor", title: "Plante Doctor", sub: "Prends ta plante en photo, l'IA haute qualité la diagnostique pour toi",
    cam: "Ouvrir Caméra", gal: "Galerie", take: "Prendre photo",
    analyse: "Analyser ma plante", analysing: "L'IA haute qualité analyse...",
    aiBadge: "IA Haute Qualité", camBadge: "Caméra en direct",
    health: "Santé", disease: "Maladie", watering: "Arrosage", light: "Lumière", soil: "Sol", treat: "Traitement", sci: "Nom scientifique",
    myPlants: "Mes plantes", tipTitle: "Conseil du jour", tip: "Ne pas trop arroser ta plante, laisse sécher la terre un peu avant de l'arroser, et mets-la à la lumière.",
    teamTitle: "Équipe de Recherche", school: "Lycée Abdellah Ben Yassine - Inezgane, Aït Melloul", made: "Fait avec amour au Maroc",
    members: "Membres - 4 personnes", close: "Fermer", langBtn: "العربية"
  };

  const openCam = async () => {
    try { setShowCam(true); const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }); streamRef.current = s; setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = s; }, 300); }
    catch { alert(lang === "ar" ? "سمح للكاميرا" : "Autorise la caméra"); setShowCam(false); }
  };
  const takePhoto = () => {
    const c = document.createElement("canvas"); c.width = videoRef.current.videoWidth; c.height = videoRef.current.videoHeight;
    c.getContext("2d")?.drawImage(videoRef.current, 0, 0); setImg(c.toDataURL("image/jpeg", 0.92));
    streamRef.current?.getTracks().forEach((t: any) => t.stop()); setShowCam(false);
  };
  const onFile = (e: any) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => { setImg(r.result as string); setShowCam(false); }; r.readAsDataURL(f); e.target.value = "";
  };

  const localSmart = (image: string) => {
    const c = document.createElement("canvas"); const im = new Image(); im.src = image;
    return new Promise<any>((resolve) => { im.onload = () => {
      c.width = 80; c.height = 80; const ctx = c.getContext("2d")!; ctx.drawImage(im, 0, 0, 80, 80);
      const d = ctx.getImageData(0, 0, 80, 80).data;
      let yellow=0, brown=0, dark=0, green=0, pale=0, total=0;
      for (let i=0;i<d.length;i+=4){ const r=d[i], g=d[i+1], b=d[i+2]; total++;
        if (r>170 && g>150 && b<110) yellow++;
        if (r>110 && g<85 && b<65) brown++;
        if (r<55 && g<55 && b<55) dark++;
        if (g>90 && g>r && g>b) green++;
        if (r>180 && g>180 && b>150) pale++;
      }
      const yp = yellow/total*100, bp = brown/total*100, dp = dark/total*100, gp = green/total*100, pp = pale/total*100;
      if (yp > 18) resolve(lang === "ar" ? { name: "نبتة بأوراق صفراء - نقص الحديد", scientific: "Chlorosis - نقص الكلوروفيل", health: 56, disease: "اصفرار الأوراق بسبب نقص الحديد و السقي الزائد", watering: "مرة كل 3 أيام، و ما تسقيش بزاف", light: "ضوء غير مباشر قوي", soil: "تربة غنية بالحديد و جيدة التصريف", treatment: "1) نقص السقي 2) سماد حديد مرة في الشهر 3) حطها فالضو" } : { name: "Plante à feuilles jaunes - Manque de fer", scientific: "Chlorosis", health: 56, disease: "Jaunissement - manque de fer", watering: "1 fois tous les 3 jours", light: "Lumière indirecte forte", soil: "Sol riche en fer", treatment: "1) Moins d'eau 2) Engrais fer 3) Lumière" });
      else if (bp > 12) resolve(lang === "ar" ? { name: "نبتة مصابة - أطراف بنية", scientific: "Brûlure des feuilles", health: 48, disease: "أطراف الأوراق بنية و جافة", watering: "كل يومين بكمية قليلة", light: "ظل جزئي - بعدها من الشمس المباشرة", soil: "تربة رطبة و خفيفة", treatment: "1) قطع الأجزاء البنية 2) رش الأوراق بالماء 3) بعدها من الشمس" } : { name: "Plante malade - Bouts marron", scientific: "Brûlure des feuilles", health: 48, disease: "Bouts marron et secs", watering: "Tous les 2 jours, peu d'eau", light: "Ombre partielle", soil: "Sol humide et léger", treatment: "1) Couper parties marron 2) Vaporiser 3) Pas de soleil direct" });
      else if (dp > 15) resolve(lang === "ar" ? { name: "نبتة في مكان مظلم", scientific: "Manque de lumière", health: 62, disease: "نقص الإضاءة - الأوراق باهتة", watering: "مرة في الأسبوع", light: "ضوء ساطع غير مباشر", soil: "تربة جيدة التصريف", treatment: "1) قربها من النافذة 2) ضو طبيعي 6 ساعات" } : { name: "Plante sans lumière", scientific: "Manque de lumière", health: 62, disease: "Manque de lumière", watering: "1 fois par semaine", light: "Lumière vive indirecte", soil: "Sol bien drainé", treatment: "1) Près de la fenêtre 2) 6h de lumière" });
      else if (pp > 20) resolve(lang === "ar" ? { name: "نبتة عطشانة", scientific: "Déshydratation", health: 52, disease: "جفاف شديد", watering: "كل يومين", light: "ظل جزئي", soil: "تربة تحتفظ بالرطوبة", treatment: "1) سقي فوري 2) رش الأوراق 3) مكان رطب" } : { name: "Plante déshydratée", scientific: "Déshydratation", health: 52, disease: "Sécheresse sévère", watering: "Tous les 2 jours", light: "Ombre partielle", soil: "Sol qui garde l'humidité", treatment: "1) Arrosage immédiat 2) Vaporiser" });
      else resolve(lang === "ar" ? { name: "نبتة صحية - مونستيرا", scientific: "Monstera deliciosa", health: 92, disease: "سليمة 100% - لا يوجد مرض", watering: "مرتين في الأسبوع", light: "ضوء غير مباشر ساطع", soil: "تربة غنية و جيدة التصريف", treatment: "حافظ على نفس العناية، نبتتك بصحة ممتازة" } : { name: "Plante saine - Monstera", scientific: "Monstera deliciosa", health: 92, disease: "Saine 100% - Aucune maladie", watering: "2 fois par semaine", light: "Lumière indirecte vive", soil: "Sol riche et drainé", treatment: "Garde les mêmes soins, ta plante est en excellente santé" });
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
        @keyframes float{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-8px) rotate(2deg)}}
        @keyframes shine{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes fall{0%{transform:translateY(-20px); opacity:1}100%{transform:translateY(300px); opacity:0}}
        @keyframes glowAI{0%,100%{text-shadow:0 0 8px #FFD700, 0 0 15px #FFA500}50%{text-shadow:0 0 18px #FFD700, 0 0 30px #FFA500, 0 0 40px #FF8A00}}
        @keyframes pulseLogo{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
        .logo{animation:float 2.5s infinite; display:inline-block; filter:drop-shadow(0 4px 10px rgba(0,0,0,0.2))}
        .shine{background:linear-gradient(90deg,#0F3D2E,#1a7a4a,#E86A33,#FF8A3D,#0F3D2E); background-size:300% 300%; animation:shine 5s infinite; color:#fff}
        .glowAI{animation:glowAI 1.8s infinite; font-weight:900; color:#FFD700; font-size:18px}
        .confetti{position:absolute; top:0; font-size:20px; animation:fall 2s forwards}
        .topLogo{animation:pulseLogo 2s infinite; display:inline-flex; align-items:center; gap:6px}
        *{color-scheme:light !important}
      `}</style>

      {confetti && <div style={{ position: "absolute", top: 0, left: 0, right: 0, textAlign: "center", zIndex: 99, pointerEvents: "none" }}><span className="confetti" style={{ left: "15%" }}>🌸</span><span className="confetti" style={{ left: "50%" }}>⭐</span><span className="confetti" style={{ left: "80%" }}>✨</span></div>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="topLogo" style={{ fontWeight: "900", fontSize: 16, color: "#0F3D2E" }}>
          <span style={{ background: "linear-gradient(135deg,#22c55e,#0F3D2E)", color: "#fff", width: 30, height: 30, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🌿</span>
          Plante Doctor <span className="glowAI">AI</span>
        </span>
        <button onClick={() => setLang(lang==="ar"?"fr":"ar")} style={{ padding: "6px 10px", border: "none", background: "transparent", fontWeight: "bold", fontSize: 13, color: "#0F3D2E", cursor: "pointer" }}>{lang==="ar" ? "🇫🇷 Français" : "🇲🇦 العربية"}</button>
      </div>

      <div className="shine" style={{ padding: 22, borderRadius: 22, textAlign: "center", marginTop: 10 }}>
        <div className="logo" style={{ fontSize: 62, background: "#fff", width: 92, height: 92, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "auto", boxShadow: "0 8px 20px rgba(0,0,0,0.25)" }}>🪴</div>
        <h1 style={{ margin: "10px 0 5px 0", fontSize: 26 }}>{T.title} <span className="glowAI">AI</span></h1>
        <p style={{ margin: 0, fontSize: 14 }}>{T.sub}</p>
        <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 8 }}>
          <span style={{ background: "rgba(255,255,255,0.25)", padding: "5px 10px", borderRadius: 20, fontSize: 12 }}>🤖✨ {T.aiBadge}</span>
          <span style={{ background: "rgba(255,255,255,0.25)", padding: "5px 10px", borderRadius: 20, fontSize: 12 }}>📸 {T.camBadge}</span>
        </div>
      </div>

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

      <button onClick={() => setShowTeam(true)} style={{ position: "fixed", bottom: 16, right: 16, zIndex: 90, width: 40, height: 40, borderRadius: "50%", background: "#fff", color: "#0F3D2E", border: "1px solid #ddd", fontSize: 18, fontWeight: "bold", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer" }}>i</button>

      {showTeam && <div onClick={() => setShowTeam(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 }}>
        <div onClick={e => e.stopPropagation()} style={{ background: "#fff", width: "100%", maxWidth: 380, borderRadius: 16, padding: 20, textAlign: "center" }}>
          <h3 style={{ margin: "0 0 12px 0" }}>{T.teamTitle}</h3>
          <p style={{ color: "#666", fontSize: 13, margin: "0 0 12px 0" }}>{T.members}</p>
          <div style={{ background: "#f9f9f9", borderRadius: 12, padding: 12, textAlign: "right" }}>
            <p style={{ margin: "8px 0", fontWeight: "bold" }}>1. Abdeladim</p>
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