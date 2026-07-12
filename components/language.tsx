import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "sw" | "en";

interface LangContextType {
  lang: Lang;
  toggle: () => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextType | undefined>(undefined);

const translations: Record<string, Record<Lang, string>> = {
  // Nav
  "nav.findNurses": { sw: "Tafuta Wauguzi", en: "Find Nurses" },
  "nav.becomeNurse": { sw: "Kuwa Muuguzi", en: "Become a Nurse" },
  "nav.elective": { sw: "Elective Placement", en: "Elective Placement" },
  "nav.jobs": { sw: "Fursa za Kazi", en: "Job Opportunities" },
  "nav.login": { sw: "Ingia", en: "Log In" },
  "nav.signup": { sw: "Anza", en: "Sign Up" },
  "nav.search": { sw: "Tafuta wauguzi...", en: "Search nurses..." },

  // Hero
  "hero.badge": { sw: "Huduma za Uuguzi Tanzania", en: "Nurse Staffing in Tanzania" },
  "hero.title1": { sw: "Pata", en: "Find" },
  "hero.title2": { sw: "Wauguzi", en: "Nurses" },
  "hero.title3": { sw: "Wataalamu kwa Haraka", en: "Professionals Fast" },
  "hero.subtitle": { sw: "Unganisha na wauguzi wenye ujuzi wa kutoa huduma bora za afya. Huduma za nyumbani kuanzia TSh 45,000/saa.", en: "Connect with skilled nurses for quality healthcare. Home care services starting from TSh 45,000/hour." },
  "hero.searchPlaceholder": { sw: "Unahitaji huduma gani ya uuguzi?", en: "What nursing service do you need?" },
  "hero.searchBtn": { sw: "Tafuta Wauguzi", en: "Find Nurses" },
  "hero.rating": { sw: "Wauguzi Walioidhinishwa na TNMC", en: "TNMC Certified Nurses" },
  "hero.service": { sw: "Huduma za Uuguzi Tanzania", en: "Tanzania Nurse Services" },
  "hero.avail": { sw: "Huduma 24/7", en: "24/7 Service" },
  "hero.payLabel": { sw: "Malipo rahisi kupitia:", en: "Easy payment via:" },

  // Service Categories
  "services.title": { sw: "Huduma za Uuguzi", en: "Nursing Services" },
  "services.subtitle": { sw: "Chagua huduma unayohitaji kutoka kwa wauguzi wenye ujuzi wa hali ya juu", en: "Choose the service you need from highly skilled nurses" },
  "services.homeCare": { sw: "Huduma za Nyumbani", en: "Home Care" },
  "services.homeCareDesc": { sw: "Wauguzi wa nyumbani kwa wagonjwa na wazee", en: "Home nurses for patients and elderly" },
  "services.icu": { sw: "ICU Specialists", en: "ICU Specialists" },
  "services.icuDesc": { sw: "Wauguzi wa utunzaji mkuu (ICU)", en: "Intensive care unit nurses" },
  "services.heart": { sw: "Huduma za Moyo", en: "Cardiac Care" },
  "services.heartDesc": { sw: "Wauguzi wa matatizo ya moyo", en: "Cardiac condition nurses" },
  "services.child": { sw: "Huduma za Watoto", en: "Pediatric Care" },
  "services.childDesc": { sw: "Wauguzi wa matibabu ya watoto", en: "Child treatment nurses" },
  "services.general": { sw: "Huduma za Jumla", en: "General Care" },
  "services.generalDesc": { sw: "Wauguzi wa matibabu ya kawaida", en: "General treatment nurses" },
  "services.mental": { sw: "Afya ya Akili", en: "Mental Health" },
  "services.mentalDesc": { sw: "Wauguzi wa matatizo ya kiakili", en: "Mental health nurses" },
  "services.tnmc": { sw: "Huduma zote zinaidhinishwa na TNMC", en: "All services approved by TNMC" },

  // Featured Nurses
  "featured.title": { sw: "Wauguzi Bora Zaidi", en: "Top Rated Nurses" },
  "featured.subtitle": { sw: "Wauguzi wenye ujuzi wa kutoa huduma bora za afya (Mfano)", en: "Skilled nurses delivering quality healthcare (Sample)" },
  "featured.book": { sw: "Weka Wakati", en: "Book Now" },
  "featured.unavailable": { sw: "Hayupo", en: "Unavailable" },
  "featured.viewAll": { sw: "Ona Wauguzi Wote", en: "View All Nurses" },
  "featured.experience": { sw: "Ujuzi wa", en: "Experience:" },
  "featured.completed": { sw: "Huduma", en: "services completed" },
  "featured.starting": { sw: "Kuanzia", en: "Starting" },

  // Trust
  "trust.title": { sw: "Jukwaa la Kuaminika la Uuguzi", en: "Trusted Nursing Platform" },
  "trust.subtitle": { sw: "Lengo letu ni kuunganisha taasisi za afya na wauguzi wenye ujuzi nchini Tanzania", en: "Our goal is to connect healthcare facilities with skilled nurses across Tanzania" },
  "trust.tnmc": { sw: "Walioidhinishwa na TNMC", en: "TNMC Approved" },
  "trust.tnmcDesc": { sw: "Wataalamu wenye leseni tayari kutoa huduma", en: "Licensed professionals ready to serve" },
  "trust.service": { sw: "Huduma za Uuguzi", en: "Nurse Services" },
  "trust.serviceDesc": { sw: "Mahitaji ya afya yaliyotimizwa kwa ufanisi", en: "Healthcare needs met efficiently" },
  "trust.support": { sw: "Msaada 24/7", en: "24/7 Support" },
  "trust.supportDesc": { sw: "Huduma za uuguzi siku na usiku", en: "Nursing services day and night" },
  "trust.verified": { sw: "Umechunguzwa Vizuri", en: "Fully Vetted" },
  "trust.verifiedDesc": { sw: "Wauguzi wote wamechunguzwa na TNMC", en: "All nurses verified by TNMC" },
  "trust.partnersTitle": { sw: "Taasisi Tukiwa Tumeshaungana Nao", en: "Institutions We Aim to Partner With" },
  "trust.partnersSub": { sw: "Lengo letu ni kuunganisha na taasisi kuu za afya nchini Tanzania", en: "Our goal is to connect with major healthcare institutions in Tanzania" },
  "trust.ctaTitle": { sw: "Tayari Kuanza?", en: "Ready to Get Started?" },
  "trust.ctaSub": { sw: "Jiunge na taasisi za afya zinazomwamini NUZIA kwa mahitaji yao ya wauguzi", en: "Join healthcare institutions that trust NUZIA for their nursing needs" },
  "trust.cta1": { sw: "Tafuta Wauguzi", en: "Find Nurses" },
  "trust.cta2": { sw: "Kuwa Muuguzi", en: "Become a Nurse" },

  // Footer
  "footer.about": { sw: "Kuunganisha taasisi za afya na wauguzi wenye ujuzi nchini Tanzania na nje ya nchi.", en: "Connecting healthcare facilities with skilled nurses in Tanzania and abroad." },
  "footer.facilities": { sw: "Kwa Taasisi za Afya", en: "For Healthcare Facilities" },
  "footer.findNurses": { sw: "Tafuta Wauguzi", en: "Find Nurses" },
  "footer.pricing": { sw: "Bei za Huduma", en: "Service Pricing" },
  "footer.howItWorks": { sw: "Jinsi Inavyofanya Kazi", en: "How It Works" },
  "footer.forNurses": { sw: "Kwa Wauguzi", en: "For Nurses" },
  "footer.joinNurse": { sw: "Jiunge kama Muuguzi", en: "Join as a Nurse" },
  "footer.createProfile": { sw: "Tengeneza Profile", en: "Create Profile" },
  "footer.findJobs": { sw: "Tafuta Kazi", en: "Find Jobs" },
  "footer.elective": { sw: "Elective Placement", en: "Elective Placement" },
  "footer.contact": { sw: "Mawasiliano", en: "Contact" },
  "footer.privacy": { sw: "Sera za Faragha", en: "Privacy Policy" },
  "footer.terms": { sw: "Masharti ya Huduma", en: "Terms of Service" },
  "footer.compliance": { sw: "TNMC Compliance", en: "TNMC Compliance" },
  "footer.rights": { sw: "Haki zote zimehifadhiwa.", en: "All rights reserved." },
  "footer.tnmcNote": { sw: "Huduma zilizoidhinishwa na Tanzania Nurses and Midwifery Council (TNMC)", en: "Services approved by Tanzania Nurses and Midwifery Council (TNMC)" },

  // Auth
  "auth.signIn": { sw: "Ingia (Sign In)", en: "Sign In" },
  "auth.signUp": { sw: "Sajili (Sign Up)", en: "Sign Up" },
  "auth.welcome": { sw: "Karibu Tena Nuzia", en: "Welcome Back to Nuzia" },
  "auth.register": { sw: "Jiunge na Nuzia leo", en: "Join Nuzia today" },
  "auth.signInDesc": { sw: "Ingia kuendelea na huduma", en: "Log in to continue" },
  "auth.signUpDesc": { sw: "Tengeneza akaunti yako sasa", en: "Create your account now" },
  "auth.accountType": { sw: "Aina ya Akaunti", en: "Account Type" },
  "auth.client": { sw: "Mteja (Client)", en: "Client" },
  "auth.nurse": { sw: "Muuguzi (Nurse)", en: "Nurse" },
  "auth.fullName": { sw: "Jina Kamili", en: "Full Name" },
  "auth.phone": { sw: "Namba ya Simu", en: "Phone Number" },
  "auth.specialty": { sw: "Utaalamu wako", en: "Your Specialty" },
  "auth.email": { sw: "Barua Pepe (Email)", en: "Email Address" },
  "auth.password": { sw: "Neno la Siri (Password)", en: "Password" },
  "auth.submitLogin": { sw: "Ingia Sasa", en: "Log In Now" },
  "auth.submitRegister": { sw: "Kamilisha Usajili", en: "Complete Registration" },
  "auth.loading": { sw: "Tafadhali subiri...", en: "Please wait..." },
  "auth.back": { sw: "Rudi Nyumbani", en: "Back Home" },
  "auth.demoAccounts": { sw: "Akaunti za Kujaribu (Demo Logins)", en: "Demo Accounts" },
  "auth.admin": { sw: "Msimamizi", en: "Admin" },
  "auth.anyPassword": { sw: "Neno lolote", en: "Any password" },

  // Elective Placement
  "elective.title": { sw: "Elective Placement za Uuguzi", en: "Nursing Elective Placements" },
  "elective.subtitle": { sw: "Fursa za kujifunza na kukua kitaalamu kwa wauguzi wa Tanzania na wa nje", en: "Learning and professional growth opportunities for Tanzanian and international nurses" },
  "elective.local": { sw: "Fursa za Ndani ya Nchi", en: "Domestic Opportunities" },
  "elective.localDesc": { sw: "Pata uzoefu katika taasisi bora za afya nchini Tanzania", en: "Gain experience at Tanzania's leading healthcare institutions" },
  "elective.abroad": { sw: "Fursa za Nje ya Nchi", en: "International Opportunities" },
  "elective.abroadDesc": { sw: "Fursa za kujifunza na kazi katika nchi mbalimbali duniani", en: "Learning and work opportunities in countries worldwide" },
  "elective.apply": { sw: "Omba Sasa", en: "Apply Now" },
  "elective.learnMore": { sw: "Jifunze Zaidi", en: "Learn More" },
  "elective.reqTitle": { sw: "Mahitaji ya Jumla", en: "General Requirements" },
  "elective.req1": { sw: "Leseni ya TNMC ya sasa", en: "Current TNMC license" },
  "elective.req2": { sw: "Miaka 2+ ya uzoefu wa kazi", en: "2+ years of work experience" },
  "elective.req3": { sw: "Ujuzi mzuri wa Kiingereza", en: "Good English proficiency" },
  "elective.req4": { sw: "Barua ya mapendekezo kutoka kwa mwajiri", en: "Recommendation letter from employer" },
  "elective.howTitle": { sw: "Jinsi Inavyofanya Kazi", en: "How It Works" },
  "elective.step1": { sw: "Jiunge na Nuzia", en: "Join Nuzia" },
  "elective.step1Desc": { sw: "Fungua akaunti na weka wasifu wako wa kitaalamu", en: "Create an account and set up your professional profile" },
  "elective.step2": { sw: "Chagua programu", en: "Choose a program" },
  "elective.step2Desc": { sw: "Vinjari fursa za ndani na nje ya nchi", en: "Browse domestic and international opportunities" },
  "elective.step3": { sw: "Omba na usubiri", en: "Apply and wait" },
  "elective.step3Desc": { sw: "Tuma maombi yako na usubiri uthibitisho", en: "Submit your applications and wait for confirmation" },
  "elective.step4": { sw: "Anza safari yako", en: "Start your journey" },
  "elective.step4Desc": { sw: "Pata nafasi ya kujifunza na kukua kitaalamu", en: "Get the opportunity to learn and grow professionally" },

  // Jobs
  "jobs.title": { sw: "Fursa za Kazi kwa Wauguzi", en: "Job Opportunities for Nurses" },
  "jobs.subtitle": { sw: "Tafuta kazi ya uuguzi ndani ya Tanzania au nje ya nchi", en: "Find nursing jobs in Tanzania or abroad" },
  "jobs.local": { sw: "Kazi za Ndani ya Nchi", en: "Domestic Jobs" },
  "jobs.localDesc": { sw: "Fursa za kazi katika hospitali na vituo vya afya nchini Tanzania", en: "Job opportunities in hospitals and health centers across Tanzania" },
  "jobs.abroad": { sw: "Kazi za Nje ya Nchi", en: "International Jobs" },
  "jobs.abroadDesc": { sw: "Fursa za kazi za uuguzi katika nchi mbalimbali duniani", en: "Nursing job opportunities in countries worldwide" },
  "jobs.apply": { sw: "Omba Kazi Hii", en: "Apply for This Job" },
  "jobs.viewDetails": { sw: "Tazama Maelezo", en: "View Details" },
  "jobs.salary": { sw: "Mshahara", en: "Salary" },
  "jobs.location": { sw: "Eneo", en: "Location" },
  "jobs.type": { sw: "Aina ya Kazi", en: "Job Type" },
  "jobs.deadline": { sw: "Mwisho wa Kuomba", en: "Application Deadline" },
  "jobs.posted": { sw: "Imetangazwa", en: "Posted" },
  "jobs.benefits": { sw: "Faida", en: "Benefits" },
  "jobs.reqTitle": { sw: "Mahitaji ya Kazi", en: "Job Requirements" },

  // Client Portal
  "client.title": { sw: "Huduma Zangu", en: "My Services" },
  "client.subtitle": { sw: "Omba na ufuatilie wauguzi wako hapa", en: "Request and track your nurses here" },
  "client.newRequest": { sw: "Omba Muuguzi Mpya", en: "Request New Nurse" },
  "client.noJobs": { sw: "Hujafanya Ombi Bado", en: "No Requests Yet" },
  "client.noJobsDesc": { sw: "Bonyeza kitufe hapo juu kuomba huduma ya muuguzi mtaalamu", en: "Click the button above to request a professional nurse" },
  "client.startFirst": { sw: "Anza Ombi la Kwanza", en: "Start First Request" },

  // Nurse Portal
  "nurse.title": { sw: "Kazi Nilizopangiwa", en: "My Assigned Jobs" },
  "nurse.subtitle": { sw: "Kazi zenye uhitaji wa utendaji wako kwa sasa", en: "Jobs requiring your attention right now" },
  "nurse.noJobs": { sw: "Hakuna Kazi Bado", en: "No Jobs Yet" },
  "nurse.noJobsDesc": { sw: "Weka hali yako kama \"Niko Tayari Kazi\" ili msimamizi akupangie wagonjwa.", en: "Set your status to \"Available\" so the admin can assign you patients." },
  "nurse.history": { sw: "Kazi Zilizokamilika", en: "Completed Jobs" },
  "nurse.noHistory": { sw: "Bado hujakamilisha kazi yoyote kupitia jukwaa letu.", en: "You haven't completed any jobs through our platform yet." },
  "nurse.startTravel": { sw: "Anza Safari (Start Travel)", en: "Start Travel" },
  "nurse.complete": { sw: "Kamilisha Huduma (Complete)", en: "Complete Service" },

  // Admin Portal
  "admin.title": { sw: "Admin Dashboard", en: "Admin Dashboard" },
  "admin.subtitle": { sw: "Udhibiti na mgawanyo wa huduma za afya Nuzia", en: "Control and allocation of Nuzia healthcare services" },
  "admin.pending": { sw: "Inasubiri Wauguzi", en: "Awaiting Nurses" },
  "admin.active": { sw: "Huduma Active", en: "Active Services" },
  "admin.ready": { sw: "Wauguzi Tayari", en: "Nurses Available" },
  "admin.revenue": { sw: "Mapato (Paid)", en: "Revenue (Paid)" },
  "admin.matchmaking": { sw: "Panga Wauguzi (Matchmaking Assignment)", en: "Assign Nurses (Matchmaking)" },
  "admin.noPending": { sw: "Maombi yote ya wateja yameshapangiwa wauguzi! Hakuna foleni.", en: "All client requests have been assigned! No queue." },
  "admin.findNurse": { sw: "Tafuta Muuguzi", en: "Find Nurse" },
  "admin.assign": { sw: "Panga", en: "Assign" },
  "admin.cancel": { sw: "Ghairi", en: "Cancel" },
  "admin.selectNurse": { sw: "Chagua Muuguzi", en: "Select Nurse" },
  "admin.nurseList": { sw: "Orodha ya Wauguzi", en: "Nurse Directory" },
  "admin.security": { sw: "Mfumo na Ulinzi", en: "System & Security" },
  "admin.securityDesc": { sw: "Wauguzi wote wanasajiliwa na namba zao za TNMC. Hakikisha unapiga simu au kufanya uhakiki wa leseni kabla ya kumpitisha muuguzi kuwa active kwenye mfumo wa matchmaking.", en: "All nurses are registered with their TNMC numbers. Ensure you call or verify licenses before activating a nurse in the matchmaking system." },

  // Common
  "common.pending": { sw: "Inasubiri Muuguzi", en: "Awaiting Nurse" },
  "common.assigned": { sw: "Muuguzi Kapewa", en: "Nurse Assigned" },
  "common.inProgress": { sw: "Huduma Inaendelea", en: "Service In Progress" },
  "common.completed": { sw: "Imekamilika", en: "Completed" },
  "common.paid": { sw: "Imelipwa", en: "Paid" },
  "common.unpaid": { sw: "Haijalipwa", en: "Unpaid" },
  "common.logout": { sw: "Ondoka", en: "Log Out" },
  "common.loading": { sw: "Inapakia...", en: "Loading..." },
  "common.save": { sw: "Hifadhi", en: "Save" },
  "common.submit": { sw: "Tuma", en: "Submit" },
  "common.cancel": { sw: "Ghairi", en: "Cancel" },
  "common.perHour": { sw: "/saa", en: "/hr" },
  "common.monthly": { sw: "mwezi huu", en: "this month" },

  // Language
  "lang.toggle": { sw: "EN", en: "SW" },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("sw");

  const toggle = () => setLang((prev) => (prev === "sw" ? "en" : "sw"));

  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  return (
    <LangContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LangContext);
  if (!context) throw new Error("useLang must be used within LanguageProvider");
  return context;
}
