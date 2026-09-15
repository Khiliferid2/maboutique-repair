// Dictionnaire de traduction pour le site MaBoutique Repair.
// Ajoutez de nouvelles clés ici au fur et à mesure qu'on traduit
// d'autres pages (pour l'instant : page d'accueil + navigation).

export type Lang = "fr" | "ar" | "en";

export const LANGUAGES: { code: Lang; label: string; dir: "ltr" | "rtl" }[] = [
  { code: "fr", label: "Français", dir: "ltr" },
  { code: "ar", label: "العربية", dir: "rtl" },
  { code: "en", label: "English", dir: "ltr" },
];

type Dict = Record<string, string>;

export const translations: Record<Lang, Dict> = {
  fr: {
    // Navigation
    "nav.shop": "Boutique en ligne",
    "nav.find": "Trouver un réparateur",
    "nav.login": "Connexion",
    "nav.register": "S'inscrire",

    // Hero
    "hero.title1": "Réparez, gérez",
    "hero.title2": "et développez votre activité",
    "hero.title3": "avec MaBoutique Repair",
    "hero.lead":
      "Le logiciel n°1 en Tunisie pour la gestion des ateliers de réparation smartphones et électronique.",
    "hero.cta.start": "Commencer gratuitement",
    "hero.cta.demo": "J'ai déjà un compte",
    "hero.client.line": "Vous êtes un client ?",
    "hero.client.link": "Trouver un réparateur près de chez vous →",

    // Features strip
    "features.title": "Tout l'atelier, un seul outil",
    "features.clients.title": "Clients & appareils",
    "features.clients.desc": "Historique complet, IMEI enregistré.",
    "features.repairs.title": "Réparations & garantie",
    "features.repairs.desc": "Suivi du statut en temps réel.",
    "features.stock.title": "Stock & pièces",
    "features.stock.desc": "Alertes de rupture automatiques.",
    "features.invoices.title": "Factures",
    "features.invoices.desc": "Générées automatiquement.",
    "features.dashboard.title": "Tableau de bord",
    "features.dashboard.desc": "Chiffre d'affaires en un coup d'œil.",
    "features.multi.title": "Multi-boutiques",
    "features.multi.desc": "Plusieurs points de vente, un compte.",

    // CTA band
    "cta.title": "Prêt à organiser votre atelier ?",
    "cta.desc": "Créez votre boutique en 2 minutes. Aucune carte bancaire requise.",
    "cta.button": "Créer ma boutique",

    // Footer
    "footer.platform": "Plateforme",
    "footer.howitworks": "Comment ça marche",
    "footer.faq": "FAQ",
    "footer.partner": "Devenir partenaire",
    "footer.clients": "Clients",
    "footer.findrepairer": "Trouver un réparateur",
    "footer.onlineshop": "Boutique en ligne",
    "footer.cities": "Villes populaires",
    "footer.city.tunis": "Réparateur à Tunis",
    "footer.city.sfax": "Réparateur à Sfax",
    "footer.city.sousse": "Réparateur à Sousse",
    "footer.workshops": "Ateliers",
    "footer.createshop": "Créer ma boutique",
    "footer.login": "Connexion",
    "footer.tagline": "« Réparez aujourd'hui, grandissez demain ! »",
    "footer.location": "Tunisie",
  },

  en: {
    "nav.shop": "Online shop",
    "nav.find": "Find a repairer",
    "nav.login": "Log in",
    "nav.register": "Sign up",

    "hero.title1": "Repair, manage",
    "hero.title2": "and grow your business",
    "hero.title3": "with MaBoutique Repair",
    "hero.lead":
      "The #1 software in Tunisia for managing smartphone and electronics repair shops.",
    "hero.cta.start": "Start for free",
    "hero.cta.demo": "I already have an account",
    "hero.client.line": "Are you a customer?",
    "hero.client.link": "Find a repairer near you →",

    "features.title": "Your whole shop, one tool",
    "features.clients.title": "Clients & devices",
    "features.clients.desc": "Full history, IMEI recorded.",
    "features.repairs.title": "Repairs & warranty",
    "features.repairs.desc": "Real-time status tracking.",
    "features.stock.title": "Stock & parts",
    "features.stock.desc": "Automatic low-stock alerts.",
    "features.invoices.title": "Invoices",
    "features.invoices.desc": "Generated automatically.",
    "features.dashboard.title": "Dashboard",
    "features.dashboard.desc": "Revenue at a glance.",
    "features.multi.title": "Multi-shop",
    "features.multi.desc": "Several locations, one account.",

    "cta.title": "Ready to organize your shop?",
    "cta.desc": "Create your shop in 2 minutes. No credit card required.",
    "cta.button": "Create my shop",

    "footer.platform": "Platform",
    "footer.howitworks": "How it works",
    "footer.faq": "FAQ",
    "footer.partner": "Become a partner",
    "footer.clients": "Customers",
    "footer.findrepairer": "Find a repairer",
    "footer.onlineshop": "Online shop",
    "footer.cities": "Popular cities",
    "footer.city.tunis": "Repairer in Tunis",
    "footer.city.sfax": "Repairer in Sfax",
    "footer.city.sousse": "Repairer in Sousse",
    "footer.workshops": "Workshops",
    "footer.createshop": "Create my shop",
    "footer.login": "Log in",
    "footer.tagline": "\"Repair today, grow tomorrow!\"",
    "footer.location": "Tunisia",
  },

  ar: {
    "nav.shop": "المتجر الإلكتروني",
    "nav.find": "ابحث عن فني تصليح",
    "nav.login": "تسجيل الدخول",
    "nav.register": "إنشاء حساب",

    "hero.title1": "أصلح، أدر",
    "hero.title2": "ونمّي نشاطك",
    "hero.title3": "مع MaBoutique Repair",
    "hero.lead":
      "البرنامج رقم 1 في تونس لإدارة ورشات تصليح الهواتف والإلكترونيات.",
    "hero.cta.start": "ابدأ مجانًا",
    "hero.cta.demo": "لدي حساب بالفعل",
    "hero.client.line": "هل أنت زبون؟",
    "hero.client.link": "ابحث عن فني تصليح بالقرب منك ←",

    "features.title": "كل الورشة، أداة واحدة",
    "features.clients.title": "الزبائن والأجهزة",
    "features.clients.desc": "سجل كامل، رقم IMEI مسجل.",
    "features.repairs.title": "الإصلاحات والضمان",
    "features.repairs.desc": "متابعة الحالة لحظيًا.",
    "features.stock.title": "المخزون وقطع الغيار",
    "features.stock.desc": "تنبيهات تلقائية عند نفاد المخزون.",
    "features.invoices.title": "الفواتير",
    "features.invoices.desc": "تُنشأ تلقائيًا.",
    "features.dashboard.title": "لوحة التحكم",
    "features.dashboard.desc": "رقم الأعمال في لمحة واحدة.",
    "features.multi.title": "عدة محلات",
    "features.multi.desc": "عدة نقاط بيع، حساب واحد.",

    "cta.title": "مستعد لتنظيم ورشتك؟",
    "cta.desc": "أنشئ متجرك في دقيقتين. لا حاجة لبطاقة بنكية.",
    "cta.button": "أنشئ متجري",

    "footer.platform": "المنصة",
    "footer.howitworks": "كيف يعمل الموقع",
    "footer.faq": "الأسئلة الشائعة",
    "footer.partner": "كن شريكًا",
    "footer.clients": "الزبائن",
    "footer.findrepairer": "ابحث عن فني تصليح",
    "footer.onlineshop": "المتجر الإلكتروني",
    "footer.cities": "المدن الأكثر بحثًا",
    "footer.city.tunis": "فني تصليح في تونس",
    "footer.city.sfax": "فني تصليح في صفاقس",
    "footer.city.sousse": "فني تصليح في سوسة",
    "footer.workshops": "الورشات",
    "footer.createshop": "أنشئ متجري",
    "footer.login": "تسجيل الدخول",
    "footer.tagline": "«أصلح اليوم، انمُ غدًا!»",
    "footer.location": "تونس",
  },
};
