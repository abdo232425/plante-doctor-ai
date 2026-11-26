"use client";
import { useRef, useState, useEffect } from "react";

export default function Home() {
  const [lang, setLang] = useState<"ar"|"fr">("fr");
  const [page, setPage] = useState<"home"|"garden">("home");
  const [img, setImg] = useState("");
  const [res, setRes] = useState<any>(null);
  const [load, setLoad] = useState(false);
  const [showCam, setShowCam] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [myPlants, setMyPlants] = useState<any[]>([]);
  const videoRef = useRef<any>(null);
  const streamRef = useRef<any>(null);
  useEffect(() => { try { const s = localStorage.getItem("mon-jardin-plantes"); if (s) setMyPlants(JSON.parse(s)); } catch {} }, []);
  useEffect(() => { try { localStorage.setItem("mon-jardin-plantes", JSON.stringify(myPlants)); } catch {} }, [myPlants]);

  const T = lang === "ar" ? {
    title: "طبيب النباتات", sub: "صور نبتتك و خلي AI الحقيقي يشخصها ليك",
    cam: "افتح الكاميرا", gal: "من المعرض", take: "التقط الصورة",
    analyse: "حلل نبتتي بـ AI", analysing: "AI كيحلل بدقة...",
    aiBadge: "AI دقيق", camBadge: "كاميرا مباشرة",
    health: "الصحة", disease: "المرض", watering: "السقي", light: "الضوء", soil: "التربة", treat: "العلاج", sci: "الاسم العلمي",
    capTitle: "شنو كيعرف يدير التطبيق؟", tipTitle: "نصيحة اليوم", tip: "ما تسقيش النبتة بزاف، خلي التربة تنشف شوية عاد سقيها، و حطها فبلاصة فيها الضو.",
    gardenTitle: "حديقتي", gardenSub: "غير النباتات لي حللتيها نيت - محفوظة",
    gardenBadge1: "نباتاتي فقط", gardenBadge2: "متابعة حية",
    teamTitle: "فريق البحث", school: "ثانوية عبدالله بن ياسين - إنزكان، أيت ملول", made: "صُنع بحب في المغرب",
    members: "أعضاء الفريق - 4 أشخاص", close: "سد",
    navHome: "تشخيص", navGarden: "حديقتي",
    caps: ["📸 تحليل أي نبتة من التصويرة بـ AI الدقيق","🌱 يعطيك اسم النبتة الحقيقي و الاسم العلمي","🩺 تشخيص دقيق للمرض و الصحة","💧 تتبع السقي و مراحل النمو","🌍 نصائح الضوء و التربة و العلاج","🇲🇦🇫🇷 عربية كاملة أو فرنسية كاملة"],
    plants: [] as any[],
    emptyGarden: "حديقتك خاوية. صور شي نبتة و حللها، غادي تبان هنا بوحدها."
  } : {
    title: "Plante Doctor", sub: "Prends ta plante en photo, le vrai AI la diagnostique avec précision",
    cam: "Ouvrir Caméra", gal: "Galerie", take: "Prendre photo",
    analyse: "Analyser avec AI", analysing: "AI analyse avec précision...",
    aiBadge: "AI précis", camBadge: "Caméra en direct",
    health: "Santé", disease: "Maladie", watering: "Arrosage", light: "Lumière", soil: "Sol", treat: "Traitement", sci: "Nom scientifique",
    capTitle: "Que peut faire l'application ?", tipTitle: "Conseil du jour", tip: "Ne pas trop arroser ta plante, laisse sécher la terre un peu avant de l'arroser, et mets-la à la lumière.",
    gardenTitle: "Mon jardin", gardenSub: "Uniquement les plantes que TU as analysées - sauvegardées",
    gardenBadge1: "Mes plantes", gardenBadge2: "Suivi en direct",
    teamTitle: "Équipe de Recherche", school: "Lycée Abdellah Ben Yassine - Inezgane, Aït Melloul", made: "Fait avec amour au Maroc",
    members: "Membres - 4 personnes", close: "Fermer",
    navHome: "Diagnostic", navGarden: "Mon jardin",
    caps: ["📸 Analyser n'importe quelle plante avec AI précis","🌱 Donner le vrai nom et le nom scientifique","🩺 Diagnostic précis de la maladie et de la santé","💧 Suivi de l'arrosage et des étapes de croissance","🌍 Conseils lumière, sol et traitement","🇲🇦🇫🇷 Tout en arabe ou tout en français"],
    plants: [] as any[],
    emptyGarden: "Ton jardin est vide. Prends une plante en photo et analyse-la, elle apparaîtra ici."
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
  const callAI = async (model: string, base64: string, prompt: string, key: string) => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 10000);
    try {
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: ctrl.signal,
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }, { inline_data: { mime_type: "image/jpeg", data: base64 } }] }], generationConfig: { temperature: 0, topP: 0.1, topK: 1, maxOutputTokens: 1000 } })
      });
      clearTimeout(timer);
      return await r.json();
    } catch (e) { clearTimeout(timer); throw e; }
  };

  const MAROC_DATA: any = {
    tou: { ar: "توت", fr: "Fraise", sci: "Fragaria x ananassa", formeAr: "نبتة زاحفة، 3 وريقات مسننة، زهرة بيضاء، ثمرة حمراء", formeFr: "Plante rampante, 3 folioles dentées, fleur blanche, fruit rouge", diseaseAr: "البياض: بودرة بيضاء - العفن الرمادي", diseaseFr: "Oidium: poudre blanche - Pourriture grise", wateringAr: "سقي منتظم كل يومين بلا ما تقيس الأوراق", wateringFr: "Arrosage régulier tous les 2 jours sans mouiller feuilles", lightAr: "ضوء قوي", lightFr: "Lumière forte", soilAr: "تربة خفيفة", soilFr: "Sol léger", treatAr: "حيد الأوراق البيضاء و ما تقيسش الأوراق", treatFr: "Enlever feuilles blanches, ne pas mouiller feuilles", croisAr: "تكبر بسرعة، ثمرة في 2 أشهر", croisFr: "Pousse vite, fruit en 2 mois" },
    hriga: { ar: "حريقة", fr: "Ortie", sci: "Urtica dioica", formeAr: "واقفة 30-120سم، أوراق قلب مسننة + شعيرات كتلسع", formeFr: "Dressée 30-120cm, feuilles coeur dentées + poils qui piquent", diseaseAr: "المن الأسود", diseaseFr: "Pucerons noirs", wateringAr: "سقي معتدل، تربة رطبة", wateringFr: "Arrosage modéré, sol humide", lightAr: "شبه ظل", lightFr: "Mi-ombre", soilAr: "تربة غنية", soilFr: "Sol riche", treatAr: "رش ماء + صابون ضد المن", treatFr: "Pulvériser eau + savon contre pucerons", croisAr: "تكبر بسرعة فالربيع", croisFr: "Pousse vite au printemps" },
    naanaa: { ar: "نعناع", fr: "Menthe", sci: "Mentha spicata", formeAr: "ساق مربعة، أوراق متقابلة، ريحة قوية", formeFr: "Tige CARREE, feuilles opposées, parfum fort", diseaseAr: "الصدأ برتقالي + البياض", diseaseFr: "Rouille orange + Oidium", wateringAr: "سقي كثير، تربة ديما رطبة", wateringFr: "Beaucoup d'eau, sol toujours humide", lightAr: "ضوء قوي", lightFr: "Lumière forte", soilAr: "تربة رطبة", soilFr: "Sol humide", treatAr: "حيد الأوراق البرتقالية", treatFr: "Enlever feuilles oranges", croisAr: "تكبر بسرعة و كتنتاشر", croisFr: "Pousse très vite" },
    zitoun: { ar: "زيتون", fr: "Olivier", sci: "Olea europaea", formeAr: "شجرة، أوراق رمحية فوق خضر و تحت رمادي", formeFr: "Arbre, feuilles lancéolées dessus vert dessous gris", diseaseAr: "عين الطاووس بقع سوداء + ذبابة الزيتون", diseaseFr: "Oeil de paon taches noires + mouche olive", wateringAr: "سقي قليل، يقاوم الجفاف", wateringFr: "Peu d'eau, résistant sécheresse", lightAr: "شمس كاملة", lightFr: "Plein soleil", soilAr: "تربة جافة", soilFr: "Sol sec", treatAr: "حيد الأوراق السوداء و رش بالنحاس", treatFr: "Enlever feuilles noires et traiter au cuivre", croisAr: "تكبر بشوية، تعيش 100 عام", croisFr: "Pousse lentement, vit 100 ans" },
    azir: { ar: "أزير", fr: "Romarin", sci: "Rosmarinus", formeAr: "شجيرة، أوراق إبر، ريحة قوية", formeFr: "Arbuste, feuilles aiguilles, parfum fort", diseaseAr: "تعفن الجذور إلا سقيتي بزاف", diseaseFr: "Pourriture racines si trop d'eau", wateringAr: "سقي قليل بزاف", wateringFr: "Très peu d'eau", lightAr: "شمس", lightFr: "Soleil", soilAr: "تربة جافة", soilFr: "Sol sec", treatAr: "نقص السقي", treatFr: "Réduire arrosage", croisAr: "تكبر بشوية", croisFr: "Pousse lentement" },
    zaatar: { ar: "زعتر", fr: "Thym", sci: "Thymus", formeAr: "شجيرة صغيرة، أوراق صغار رمادية، ريحة قوية", formeFr: "Petit arbuste, petites feuilles grises, parfum fort", diseaseAr: "تعفن إلا سقيتي بزاف", diseaseFr: "Pourriture si trop d'eau", wateringAr: "سقي قليل", wateringFr: "Peu d'eau", lightAr: "شمس", lightFr: "Soleil", soilAr: "تربة جافة", soilFr: "Sol sec", treatAr: "نقص السقي", treatFr: "Réduire arrosage", croisAr: "تكبر بشوية", croisFr: "Pousse lentement" },
    limoun: { ar: "ليمون", fr: "Citronnier", sci: "Citrus limon", formeAr: "شجرة، أوراق بيضاوية لامعة، ثمرة صفراء", formeFr: "Arbre, feuilles ovales brillantes, fruit jaune", diseaseAr: "حافرة الأوراق خطوط بيضاء + قشريات", diseaseFr: "Mineuse lignes blanches + cochenilles", wateringAr: "سقي منتظم 2 مرات فالسيمانا", wateringFr: "Arrosage régulier 2x semaine", lightAr: "شمس", lightFr: "Soleil", soilAr: "تربة خفيفة", soilFr: "Sol léger", treatAr: "حيد الأوراق المخططة", treatFr: "Enlever feuilles lignées", croisAr: "تكبر بمتوسط", croisFr: "Pousse moyenne" },
    karmous: { ar: "كرموس", fr: "Figuier", sci: "Ficus carica", formeAr: "شجرة، أوراق كبيرة 5 أقسام", formeFr: "Arbre, grandes feuilles 5 lobes", diseaseAr: "الصدأ بقع برتقالية", diseaseFr: "Rouille taches oranges", wateringAr: "سقي قليل", wateringFr: "Peu d'eau", lightAr: "شمس", lightFr: "Soleil", soilAr: "تربة عادية", soilFr: "Sol normal", treatAr: "حيد الأوراق المصابة", treatFr: "Enlever feuilles atteintes", croisAr: "تكبر بسرعة", croisFr: "Pousse vite" },
    ward: { ar: "ورد", fr: "Rosier", sci: "Rosa", formeAr: "شجيرة فيها شوك، زهرة معطرة", formeFr: "Arbuste avec épines, fleur parfumée", diseaseAr: "البياض بودرة بيضاء + بقع سوداء", diseaseFr: "Oidium poudre blanche + taches noires", wateringAr: "سقي منتظم بلا ما تقيس الأوراق", wateringFr: "Arrosage régulier sans mouiller feuilles", lightAr: "شمس", lightFr: "Soleil", soilAr: "تربة غنية", soilFr: "Sol riche", treatAr: "حيد الأوراق البيضاء", treatFr: "Enlever feuilles blanches", croisAr: "تكبر بمتوسط", croisFr: "Pousse moyenne" },
    sabbar: { ar: "صبار", fr: "Aloe Vera", sci: "Aloe vera", formeAr: "أوراق لحمية فيها جيل و شوك فالجوانب", formeFr: "Feuilles charnues avec gel et épines sur bords", diseaseAr: "تعفن إلا سقيتي بزاف", diseaseFr: "Pourriture si trop d'eau", wateringAr: "سقي قليل بزاف مرة فالشهر", wateringFr: "Très peu d'eau 1x par mois", lightAr: "ضوء قوي", lightFr: "Lumière forte", soilAr: "تربة رملية", soilFr: "Sol sableux", treatAr: "حبسي السقي", treatFr: "Arrêter arrosage", croisAr: "تكبر بشوية", croisFr: "Pousse lentement" },
  };
  const MAROC = "PLANTES DU MAROC: Fraise, Ortie, Menthe, Olivier, Romarin, Thym, Citron, Figuier, Rosier, Aloe, Oranger, Grenadier, Palmier, Argan, Cedre, Vigne, Tomate, Pomme de terre, Ble, Orge, Mais, Feve, Jasmin, Geranium, Lavande, Sauge, Verveine, Armoise, Mauve, Chardon, Pissenlit, Pourpier, Basilic, Persil, Coriandre, Piment, Courgette, Eucalyptus, Laurier, Bougainvillier, Monstera, Pothos, Ficus, Cactus Hindi. Chaque plante avec sa forme, sa maladie, son arrosage, sa croissance.";
  const analyseAI = async (image: string) => {
    // ===== ETAPE 1 - D'ABORD LE DICTIONNAIRE QUI EST CHEZ LUI =====
    // Il regarde d'abord dans son dictionnaire de plantes du Maroc (MAROC_DATA)
    // Si il trouve la plante a 100% la, il retourne le resultat du dictionnaire et il s'arrete ici
    // Il ne va PAS aux 3 versions
    // ===== ETAPE 2 - SINON LES 3 VERSIONS =====
    // Si il ne la trouve PAS dans le dictionnaire, il va analyser dans les 3 :
    // gemini-3.5-flash-lite -> gemini-3-flash -> gemini-3.8-flash

    const key = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!key) { setErrMsg(lang === "ar" ? "المفتاح ما كاينش في Vercel" : "Clé manquante dans Vercel"); return null; }
    const base64 = image.split(",")[1];
    const promptDictionnaire = lang === "ar" ? "قائمة المغرب: tou توت, hriga حريقة, naanaa نعناع, zitoun زيتون, azir أزير, zaatar زعتر, limoun ليمون, karmous كرموس, ward ورد, sabbar صبار. انظر للصورة: إذا كانت تشبه واحدة 100% قل كودها فقط. وإلا قل pas_maroc. كلمة واحدة فقط." : "Liste Maroc: tou Fraise, hriga Ortie, naanaa Menthe, zitoun Olivier, azir Romarin, zaatar Thym, limoun Citron, karmous Figuier, ward Rosier, sabbar Aloe. Regarde photo: si elle ressemble à 100% à une, dis son code seulement. Sinon dis pas_maroc. UN SEUL MOT.";
    try {
      const j1 = await callAI("gemini-3.5-flash-lite", base64, promptDictionnaire, key); // ETAPE 1 : on regarde SEULEMENT dans le dictionnaire
      let code1 = (j1.candidates?.[0]?.content?.parts?.[0]?.text || "").toLowerCase().trim();
      for (const k of ["tou","hriga","naanaa","zitoun","azir","zaatar","limoun","karmous","ward","sabbar"]) { if (code1.includes(k)) { code1 = k; break; } }
      // TROUVE DANS LE DICTIONNAIRE -> on retourne le dictionnaire, on ne va pas aux 3
      if (MAROC_DATA[code1]) {
        const d = MAROC_DATA[code1];
        const isAr = lang === "ar";
        setErrMsg("");
        return { name: isAr ? d.ar : d.fr, scientific: d.sci, health: 80, disease: (isAr ? d.formeAr + " | المرض: " + d.diseaseAr : d.formeFr + " | Maladie: " + d.diseaseFr), watering: isAr ? d.wateringAr + " | النمو: " + d.croisAr : d.wateringFr + " | Croissance: " + d.croisFr, light: isAr ? d.lightAr : d.lightFr, soil: isAr ? d.soilAr : d.soilFr, treatment: isAr ? d.treatAr : d.treatFr };
      }
    } catch {}
    const prompt = lang === "ar" ? `أنت عالم نباتات خبير يعرف جميع نباتات المغرب والعالم. علمك عن المغرب: ${MAROC} ممنوع تخمن الاسم. إذا عرفت 100% قل اسمها. إذا لم تكن متأكدا قل "نبتة غير محددة" واترك العلمي فارغا. حتى إذا لم تعرف الاسم، حلل المرض والسقي والعلاج بصحيح من ما تراه فعلا. أعد فقط JSON: {"name":"الاسم الحقيقي بالعربية أو نبتة غير محددة","scientific":"الاسم العلمي أو فارغ","health": رقم 0-100,"disease":"المرض الظاهر فعلا","watering":"السقي","light":"الضوء","soil":"التربة","treatment":"العلاج"}` : `Tu es botaniste expert qui connait toutes les plantes du Maroc et du monde. Connaissance Maroc: ${MAROC} INTERDIT de deviner. Si tu connais à 100% dis son nom. Sinon dis "Plante non identifiée" et laisse scientifique vide. Meme si tu ne connais pas le nom, analyse maladie, arrosage, traitement d'après ce que tu vois VRAIMENT. Retourne UNIQUEMENT JSON: {"name":"vrai nom ou Plante non identifiée","scientific":"nom scientifique ou vide","health": nombre 0-100,"disease":"maladie visible","watering":"arrosage","light":"lumière","soil":"sol","treatment":"traitement"}`;
    // PAS TROUVE DANS LE DICTIONNAIRE -> on va aux 3 versions
    let lastErr = "";
    for (const model of ["gemini-3.5-flash-lite", "gemini-3-flash", "gemini-3.8-flash"]) {
      try {
        const j = await callAI(model, base64, prompt, key);
        if (j.error) { lastErr = j.error.message || ""; continue; }
        let txt = j.candidates?.[0]?.content?.parts?.[0]?.text || "";
        if (!txt) continue;
        const start = txt.indexOf("{");
        const end = txt.lastIndexOf("}") + 1;
        if (start === -1 || end === 0) continue;
        const parsed = JSON.parse(txt.slice(start, end));
        if (!parsed.name) parsed.name = lang === "ar" ? "نبتة غير محددة" : "Plante non identifiée";
        if (!parsed.scientific) parsed.scientific = "";
        if (typeof parsed.health !== "number") parsed.health = 75;
        if (parsed.health < 0) parsed.health = 0;
        if (parsed.health > 100) parsed.health = 100;
        setErrMsg("");
        return parsed;
      } catch (e: any) { lastErr = e.message || "timeout"; continue; }
    }
    setErrMsg((lang === "ar" ? "ما خدمش: " : "Ca n a pas marché: ") + lastErr);
    return null;
  };
  const analyse = async () => {
    if (!img) return;
    setLoad(true); setRes(null); setErrMsg(""); setConfetti(false);
    const ai = await analyseAI(img);
    if (ai) {
      setRes(ai);
      const displayName = ai.scientific ? ai.name + " (" + ai.scientific + ")" : ai.name;
      const newPlant = { name: displayName, img: img, status: ai.health > 70 ? "À surveiller" : "Alerte", statusAr: ai.health > 70 ? "راقبها" : "خطر", water: ai.watering, waterAr: ai.watering, growth: ai.health, growthLabel: "مرحلة النمو", growthLabelFr: "Croissance" };
      setMyPlants((prev) => [newPlant, ...prev]);
      setConfetti(true); setTimeout(()=>setConfetti(false), 2000);
    }
    setLoad(false);
  };
  const removePlant = (idx: number) => { setMyPlants((prev) => prev.filter((_, i) => i !== idx)); };
  const FALLING = ["🍃","🍂","🌿","🍁","🌱","🍃","🍂","🌿","🍁","🍃","🌱","🍂"];

  return (
    <main style={{ maxWidth: 680, width: "100%", margin: "auto", padding: 16, paddingBottom: 60, fontFamily: "sans-serif", minHeight: "auto", height: "auto", color: "#111", position: "relative", background: "#fff", overflow: "visible", colorScheme: "light" }}>
      <style>{`
        @keyframes float{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-8px) rotate(2deg)}}
        @keyframes shine{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes fall{0%{transform:translateY(-100px) translateX(0) rotate(0deg); opacity:0}10%{opacity:1}50%{transform:translateY(50vh) translateX(20px) rotate(180deg)}90%{opacity:1}100%{transform:translateY(115vh) translateX(-20px) rotate(360deg); opacity:0}}
        @keyframes glowAI{0%,100%{text-shadow:0 0 8px #FFD700}50%{text-shadow:0 0 18px #FFD700, 0 0 30px #FFA500}}
        @keyframes pulseLogo{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
        @keyframes iMove{0%,100%{transform:translateY(0) rotate(0deg); box-shadow:0 0 10px #FFD700}50%{transform:translateY(-6px) rotate(5deg); box-shadow:0 0 20px #FFD700, 0 0 30px #FFA500}}
        .logo{animation:float 2.5s infinite; display:inline-block}
        .shine{background:linear-gradient(90deg,#0F3D2E,#1a7a4a,#E86A33,#FF8A3D,#0F3D2E); background-size:300% 300%; animation:shine 5s infinite; color:#fff}
        .shineGarden{background:linear-gradient(90deg,#0F3D2E,#22c55e,#F59E0B,#E86A33,#0F3D2E); background-size:300% 300%; animation:shine 5s infinite; color:#fff}
        .glowAI{animation:glowAI 1.8s infinite; font-weight:900; color:#FFD700; font-size:22px}
        .confetti{position:absolute; top:0; font-size:20px; animation:fall 2s forwards}
        .topLogo{animation:pulseLogo 2s infinite; display:inline-flex; align-items:center; gap:6px}
        .falling{position:absolute; top:-80px; animation:fall linear infinite; opacity:0.9; pointer-events:none; z-index:0}
        .iBtn{animation:iMove 2s infinite !important}
      `}</style>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {FALLING.map((e, i) => (<span key={i} className="falling" style={{ left: `${(i * 8 + 3) % 100}%`, fontSize: 22 + (i % 3) * 8, animationDuration: `${7 + (i % 5) * 2}s`, animationDelay: `${i * 0.9}s` }}>{e}</span>))}
      </div>
      {confetti && <div style={{ position: "absolute", top: 0, left: 0, right: 0, textAlign: "center", zIndex: 99, pointerEvents: "none" }}><span className="confetti" style={{ left: "15%" }}>🌸</span><span className="confetti" style={{ left: "50%" }}>⭐</span><span className="confetti" style={{ left: "80%" }}>✨</span></div>}
      <div style={{ position: "relative", zIndex: 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="topLogo" style={{ fontWeight: "900", fontSize: 22, color: "#0F3D2E" }}>
          <span style={{ background: "linear-gradient(135deg,#22c55e,#0F3D2E)", color: "#fff", width: 36, height: 36, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🌿</span>
          Plante Doctor <span className="glowAI">AI</span>
        </span>
        <button onClick={() => setLang(lang==="ar"?"fr":"ar")} style={{ padding: "6px 10px", border: "none", background: "transparent", fontWeight: "bold", fontSize: 13, color: "#0F3D2E", cursor: "pointer" }}>{lang==="ar" ? "🇫🇷 Français" : "🇲🇦 العربية"}</button>
      </div>
      {page === "home" && <>
      <div className="shine" style={{ padding: 22, borderRadius: 22, textAlign: "center", marginTop: 10 }}>
        <div className="logo" style={{ fontSize: 62, background: "#fff", width: 92, height: 92, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "auto", boxShadow: "0 8px 20px rgba(0,0,0,0.25)" }}>🩺</div>
        <h1 style={{ margin: "10px 0 5px 0", fontSize: 28 }}>{T.title} <span className="glowAI">AI</span></h1>
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
        {img && !showCam && <div style={{ marginTop: 12, position: "relative" }}><img src={img} style={{ width: "100%", borderRadius: 14, maxHeight: 340, objectFit: "cover", border: "3px solid #22c55e" }} /><span style={{ position: "absolute", top: 10, right: 10, background: "white", borderRadius: "50%", width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, boxShadow: "0 2px 10px rgba(0,0,0,.3)" }}>🩺</span><button onClick={analyse} style={{ width: "100%", padding: 13, background: "linear-gradient(90deg,#E86A33,#FF8A3D)", color: "#fff", border: 0, borderRadius: 12, marginTop: 8, fontWeight: "bold", fontSize: 14 }}>{load ? T.analysing : T.analyse}</button></div>}
        {img && <div style={{ display: "flex", gap: 8, marginTop: 10, overflowX: "auto" }}><img src={img} style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 12, border: "2px solid #22c55e" }} alt="" />{myPlants.slice(0,4).map((g:any,i:number)=>(<img key={i} src={g.img} style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 12, border: "2px solid #ddd" }} alt="" />))}</div>}
        {errMsg && <div style={{ background: "#FEE2E2", color: "#991B1B", padding: 12, borderRadius: 12, marginTop: 10, fontSize: 13, lineHeight: 1.5, border: "1px solid #FCA5A5" }}>⚠️ {errMsg}</div>}
      </div>
      {res && <div style={{ background: "#fff", padding: 16, borderRadius: 18, marginTop: 12, border: "2px solid #dcfce7" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 82, height: 82, borderRadius: "50%", background: `conic-gradient(#22c55e ${res.health * 3.6}deg, #eee 0deg)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ width: 62, height: 62, background: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: 18 }}>{res.health}%</div>
          </div>
          <div><h2 style={{ margin: "2px 0", fontSize: 19 }}>🌱 {res.name}</h2>{res.scientific ? <p style={{ margin: 0, fontSize: 12, color: "#666" }}>{res.scientific}</p> : <p style={{ margin: 0, fontSize: 12, color: "#999" }}>{lang==="ar" ? "الاسم غير محدد - ولكن تحليل المرض صحيح" : "Nom non identifié - mais analyse maladie juste"}</p>}</div>
        </div>
        <p style={{ marginTop: 10 }}><b>{T.health}:</b> {res.health}% - {res.disease}</p>
        <p>💧 <b>{T.watering}:</b> {res.watering}</p><p>☀️ <b>{T.light}:</b> {res.light}</p><p>🌍 <b>{T.soil}:</b> {res.soil}</p><p>💊 <b>{T.treat}:</b> {res.treatment}</p>
        <p style={{ textAlign: "center", fontSize: 12, color: "#16a34a", fontWeight: "bold", marginTop: 8 }}>✅ {lang==="ar" ? "تحطات بوحدها فـ حديقتي" : "Ajoutée automatiquement à Mon jardin"}</p>
      </div>}
      </>}
      {page === "garden" && <>
      <div className="shineGarden" style={{ padding: 22, borderRadius: 22, textAlign: "center", marginTop: 10 }}>
        <div className="logo" style={{ fontSize: 62, background: "#fff", width: 92, height: 92, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "auto", boxShadow: "0 8px 20px rgba(0,0,0,0.25)" }}>🌿</div>
        <h1 style={{ margin: "10px 0 5px 0", fontSize: 26 }}>{T.gardenTitle}</h1>
        <p style={{ margin: 0, fontSize: 14 }}>{T.gardenSub}</p>
        <div style={{ marginTop: 10, display: "flex", justifyContent: "center", gap: 8 }}>
          <span style={{ background: "rgba(255,255,255,0.25)", padding: "5px 10px", borderRadius: 20, fontSize: 12 }}>🪴 {myPlants.length} {T.gardenBadge1}</span>
          <span style={{ background: "rgba(255,255,255,0.25)", padding: "5px 10px", borderRadius: 20, fontSize: 12 }}>💧 {T.gardenBadge2}</span>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        {myPlants.length === 0 && <div style={{ background: "#fff", padding: 20, borderRadius: 18, textAlign: "center", color: "#666" }}>🌱<br />{(T as any).emptyGarden}</div>}
        {myPlants.map((p: any, i: number) => (
          <div key={i} style={{ background: "#fff", padding: 12, borderRadius: 18, marginBottom: 10, display: "flex", gap: 12, alignItems: "center", boxShadow: "0 4px 18px rgba(0,0,0,0.06)", border: "1px solid #BBF7D0" }}>
            <img src={p.img} alt={p.name} style={{ width: 85, height: 85, borderRadius: 14, objectFit: "cover", flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <b style={{ fontSize: 15, color: "#0F3D2E", flex: 1 }}>{p.name}</b>
                <button onClick={() => removePlant(i)} title={lang === "ar" ? "حيدها من حديقتي" : "Retirer du jardin"} style={{ background: "#FEE2E2", border: "none", borderRadius: 8, width: 30, height: 30, fontSize: 14, cursor: "pointer", flexShrink: 0 }}>🗑️</button>
              </div>
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
      </div>
      <button onClick={() => setShowTeam(true)} className="iBtn" style={{ position: "fixed", bottom: 88, right: 16, zIndex: 90, width: 44, height: 44, minWidth: 44, minHeight: 44, borderRadius: "50%", background: "#ffffff", color: "#0F3D2E", border: "2px solid #FFD700", fontSize: 22, fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: "1", padding: 0, whiteSpace: "nowrap", overflow: "hidden", flexShrink: 0 }}>i</button>
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 80, background: "#fff", borderTop: "1px solid #eee", padding: "10px 12px", display: "flex", gap: 10, boxShadow: "0 -2px 12px rgba(0,0,0,0.08)" }}>
        <button onClick={() => setPage("home")} style={{ flex: 1, padding: 12, borderRadius: 14, border: "none", background: page === "home" ? "linear-gradient(135deg,#0F3D2E,#1a7a4a)" : "#F3F4F6", color: page === "home" ? "#fff" : "#0F3D2E", fontWeight: "bold", fontSize: 14, cursor: "pointer" }}>🩺 {T.navHome}</button>
        <button onClick={() => setPage("garden")} style={{ flex: 1, padding: 12, borderRadius: 14, border: "none", background: page === "garden" ? "linear-gradient(135deg,#E86A33,#FF8A3D)" : "#F3F4F6", color: page === "garden" ? "#fff" : "#0F3D2E", fontWeight: "bold", fontSize: 14, cursor: "pointer" }}>🌿 {T.navGarden}</button>
      </div>
      {showTeam && <div onClick={() => setShowTeam(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20, overflowY: "auto" }}>
        <div onClick={e => e.stopPropagation()} style={{ background: "#fff", width: "100%", maxWidth: 400, borderRadius: 16, padding: 20, textAlign: "center", maxHeight: "90vh", overflowY: "auto" }}>
          <h3 style={{ margin: "0 0 12px 0" }}>{T.teamTitle}</h3>
          <p style={{ color: "#666", fontSize: 13, margin: "0 0 12px 0" }}>{T.members}</p>
          <div style={{ background: "#f9f9f9", borderRadius: 12, padding: 12, textAlign: "right" }}>
            <p style={{ margin: "8px 0", fontWeight: "bold" }}>1. Abdeladim Zouhair</p>
            <p style={{ margin: "8px 0" }}>2. Hafsa Abdelmoumen</p>
            <p style={{ margin: "8px 0" }}>3. Arwa Akoujim</p>
            <p style={{ margin: "8px 0" }}>4. Fatima Zahra El Maachi</p>
          </div>
          <p style={{ fontWeight: "bold", marginTop: 12, fontSize: 14 }}>🏫 {T.school}</p>
          <div style={{ background: "#fff", border: "1px solid #dcfce7", borderRadius: 12, padding: 12, marginTop: 12, textAlign: "left" }}>
            <h4 style={{ margin: "0 0 8px 0" }}>{T.capTitle}</h4>
            {T.caps.map((c: string, i: number) => <p key={i} style={{ margin: "6px 0", fontSize: 13, lineHeight: 1.5 }}>{c}</p>)}
            <div style={{ background: "linear-gradient(135deg,#FEF3C7,#FFF8E7)", padding: 10, borderRadius: 10, marginTop: 10 }}>
              <b style={{ fontSize: 13 }}>💡 {T.tipTitle}</b>
              <p style={{ margin: "6px 0 0 0", fontSize: 12, lineHeight: 1.6 }}>{T.tip}</p>
            </div>
          </div>
          <button onClick={() => setShowTeam(false)} style={{ marginTop: 12, padding: "9px 18px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", fontWeight: "bold" }}>{T.close}</button>
        </div>
      </div>}
    </main>
  );
}