import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    helpline: 'Citizen Grievance Helpline: 1800-233-1234 / 020-67333333 (Toll Free, 24x7)',
    notice: 'PCMC Civic Connect: Report monsoon waterlogging, drainage overflow, and pothole issues on priority.',
    skipToContent: 'Skip to Main Content',
    title: 'PCMC Civic Connect',
    subtitle: 'Hyperlocal Civic Issue Reporter',
    navHome: 'Home',
    navAbout: 'About',
    navServices: 'Civic Services',
    navReport: 'Report an Issue',
    navTrack: 'Track Complaint',
    navDashboard: 'Public Dashboard',
    navAdminQueue: 'Officer Queue',
    navAdminDash: 'Admin Analytics',
    heroHeadline: 'Your City, Your Voice. Let\'s Build a Better PCMC.',
    heroSub: 'Report civic issues in your neighbourhood, track complaint progress, and help make Pimpri-Chinchwad cleaner, safer, and better connected.',
    heroCTA1: 'Report a Civic Issue',
    heroCTA2: 'Track My Complaint',
    servicesTitle: 'Civic Issue Categories',
    servicesDesc: 'Select an issue category below to submit a geo-tagged complaint directly to the relevant municipal department.',
    howItWorksTitle: 'How It Works',
    howItWorksSub: 'Simple 4-step process to ensure civic issues get verified, assigned, and resolved with photographic proof.',
    step1Title: 'Spot & Capture',
    step1Desc: 'Identify an issue in your locality and take clear photos showing the condition.',
    step2Title: 'Pin & Submit',
    step2Desc: 'Drop a pin on the PCMC map. The system automatically identifies the ward boundary.',
    step3Title: 'Receive Tracking ID',
    step3Desc: 'Get an instant unique Complaint ID (e.g. PCMC-2026-XXXX) for status updates.',
    step4Title: 'Track & Verify',
    step4Desc: 'Follow progress through verification, departmental work, and resolution proof.',
    statsTitle: 'Civic Complaint Statistics',
    statsSub: 'Live transparent breakdown of complaints across all 8 administrative wards in PCMC.',
    mapTitle: 'Interactive Civic Issue Map',
    mapSub: 'Explore real-time geo-located issues, active municipal works, and resolved complaints in your ward.',
    recentTitle: 'Recent Civic Reports',
    recentSub: 'Public transparency log of complaints registered across Pimpri, Chinchwad, Bhosari, Akurdi, and surrounding localities.',
    disclaimer: 'Project Prototype — Hyperlocal Civic Issue Reporter designed for the PCMC region. Not an official municipal government service.'
  },
  mr: {
    helpline: 'नागरिक तक्रार निवारण कक्ष: १८००-२३३-१२३४ / ०२०-६७३३३३३३ (टोल फ्री, २४x७)',
    notice: 'पिंपरी चिंचवड: पावसाळ्यातील पाण्याचा निचरा, खड्डे व कचरा समस्या प्राधान्याने नोंदवा.',
    skipToContent: 'मुख्य मजकुरावर जा',
    title: 'पीसीएमसी सिव्हिक कनेक्ट',
    subtitle: 'स्थानिक नागरी तक्रार निवारण पोर्टल',
    navHome: 'मुख्यपृष्ठ',
    navAbout: 'माहिती',
    navServices: 'नागरी सेवा',
    navReport: 'तक्रार नोंदवा',
    navTrack: 'तक्रार स्थिती पहा',
    navDashboard: 'सार्वजनिक डॅशबोर्ड',
    navAdminQueue: 'अधिकारी पडताळणी',
    navAdminDash: 'प्रशासकीय विश्लेषण',
    heroHeadline: 'आपले शहर, आपली जबाबदारी! चला घडवूया सुंदर पिंपरी-चिंचवड.',
    heroSub: 'आपल्या परिसरातील नागरी समस्या छायाचित्रासह नोंदवा, प्रगतीचा मागोवा घ्या आणि पिंपरी-चिंचवड अधिक स्वच्छ व सुरक्षित बनविण्यात मदत करा.',
    heroCTA1: 'तक्रार नोंदवा',
    heroCTA2: 'तक्रार स्थिती पहा',
    servicesTitle: 'नागरी समस्यांचे प्रकार',
    servicesDesc: 'खालील प्रकार निवडून संबंधित महापालिका विभागाकडे थेट तक्रार नोंदवा.',
    howItWorksTitle: 'कार्यपद्धती',
    howItWorksSub: 'नागरी तक्रार पडताळणी, वाटप आणि पुराव्यासह निवारण करण्याची ४-टप्प्यांची सोपी प्रक्रिया.',
    step1Title: '१. समस्या व फोटो',
    step1Desc: 'परिसरातील समस्येचे स्पष्ट छायाचित्र (फोटो) घ्या.',
    step2Title: '२. नकाशावर स्थान',
    step2Desc: 'नकाशावर ठिकाण निवडा, प्रभाग आपोआप निश्चित होईल.',
    step3Title: '३. तक्रार क्रमांक',
    step3Desc: 'तक्रार ट्रॅक करण्यासाठी तात्काळ युनिक आयडी (उदा. PCMC-2026-XXXX) मिळवा.',
    step4Title: '४. निवारण व पडताळणी',
    step4Desc: 'महापालिकेच्या प्रत्यक्ष कामानंतर फोटो पुराव्यासह समाधान तपासा.',
    statsTitle: 'नागरी तक्रार आकडेवारी',
    statsSub: 'पिंपरी-चिंचवडमधील सर्व ८ प्रभागांमधील तक्रारींचा पारदर्शक आढावा.',
    mapTitle: 'परिसर नागरी समस्या नकाशा',
    mapSub: 'आपल्या प्रभागातील प्रलंबित व निवारण झालेल्या तक्रारी थेट नकाशावर पहा.',
    recentTitle: 'नुकत्याच नोंदवलेल्या तक्रारी',
    recentSub: 'पिंपरी, चिंचवड, भोसरी, आकुर्डी आणि परिसरातील नोंदवलेल्या समस्यांचा सार्वजनिक तपशील.',
    disclaimer: 'प्रकल्प प्रोटोटाइप — पिंपरी-चिंचवड महापालिका क्षेत्रासाठी प्रायोगिक नागरी तक्रार प्रणाली.'
  },
  hi: {
    helpline: 'नागरिक शिकायत हेल्पलाइन: 1800-233-1234 / 020-67333333 (टोल फ्री, 24x7)',
    notice: 'पीसीएमसी सिविक कनेक्ट: जलभराव, सड़क के गड्ढे और कचरा समस्या की प्राथमिकता पर रिपोर्ट करें।',
    skipToContent: 'मुख्य सामग्री पर जाएं',
    title: 'पीसीएमसी सिविक कनेक्ट',
    subtitle: 'हाइपरलोकल नागरिक समस्या निवारण पोर्टल',
    navHome: 'होम',
    navAbout: 'हमारे बारे में',
    navServices: 'नागरिक सेवाएं',
    navReport: 'समस्या दर्ज करें',
    navTrack: 'शिकायत ट्रैक करें',
    navDashboard: 'पब्लिक डैशबोर्ड',
    navAdminQueue: 'अधिकारी समीक्षा',
    navAdminDash: 'एडमिन एनालिटिक्स',
    heroHeadline: 'आपका शहर, आपकी आवाज़। आइए बनाएं बेहतर पिंपरी-चिंचवड।',
    heroSub: 'अपने क्षेत्र की नागरिक समस्याओं की रिपोर्ट करें, प्रगति ट्रैक करें और शहर को स्वच्छ व सुरक्षित बनाने में सहयोग दें।',
    heroCTA1: 'समस्या दर्ज करें',
    heroCTA2: 'शिकायत ट्रैक करें',
    servicesTitle: 'नागरिक सेवा श्रेणियां',
    servicesDesc: 'संबंधित नगर निगम विभाग को शिकायत भेजने के लिए उपयुक्त श्रेणी चुनें।',
    howItWorksTitle: 'यह कैसे काम करता है',
    howItWorksSub: 'सत्यापन, कार्य आवंटन और समाधान का आसान 4-चरणीय सिस्टम।',
    step1Title: '1. समस्या और फोटो',
    step1Desc: 'समस्या की स्पष्ट तस्वीर खींचें।',
    step2Title: '2. मैप पर लोकेशन',
    step2Desc: 'मैप पर पिन लगाएं, वार्ड अपने आप पहचाना जाएगा।',
    step3Title: '3. शिकायत आईडी प्राप्त करें',
    step3Desc: 'ट्रैकिंग के लिए तत्काल यूनिक कंप्लेंट आईडी प्राप्त करें।',
    step4Title: '4. समाधान और ट्रैकिंग',
    step4Desc: 'विभाग द्वारा कार्य पूर्ण होने पर प्रमाण फोटो के साथ स्थिति देखें।',
    statsTitle: 'नागरिक शिकायत आंकड़े',
    statsSub: 'सभी 8 वार्डों में शिकायतों की पारदर्शी स्थिति।',
    mapTitle: 'इंटरएक्टिव सिविक मैप',
    mapSub: 'अपने क्षेत्र में दर्ज शिकायतों को मैप पर देखें।',
    recentTitle: 'हाल की नागरिक शिकायतें',
    recentSub: 'पिंपरी, चिंचवड, भोसरी आदि क्षेत्रों से दर्ज शिकायतों का सार्वजनिक रिकॉर्ड।',
    disclaimer: 'प्रोजेक्ट प्रोटोटाइप — पिंपरी-चिंचवड क्षेत्र के लिए नागरिक समस्या रिपोर्टर। आधिकारिक सरकारी सेवा नहीं है।'
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
