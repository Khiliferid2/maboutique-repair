// Liste des 24 gouvernorats de Tunisie avec leurs principales délégations.
// Utilisée pour la sélection en cascade Gouvernorat → Délégation
// (profil boutique + filtre de recherche).
//
// Remarque : la liste des délégations n'est pas exhaustive à 100% (il en
// existe environ 350 au total), mais couvre les délégations les plus
// peuplées / connues de chaque gouvernorat. Vous pouvez compléter cette
// liste au besoin, elle est volontairement simple (un objet JS).

export const TUNISIA_LOCATIONS: Record<string, string[]> = {
  "Tunis": ["Tunis Ville", "Le Bardo", "La Marsa", "Carthage", "Le Kram", "Sidi Bou Said", "El Menzah", "Cité El Khadra", "El Omrane", "Bab El Bhar", "Bab Souika"],
  "Ariana": ["Ariana Ville", "Ettadhamen", "Mnihla", "Raoued", "Sidi Thabet", "Kalâat el-Andalous", "La Soukra"],
  "Ben Arous": ["Ben Arous", "Hammam Lif", "Hammam Chott", "Radès", "Mégrine", "Mourouj", "El Mourouj", "Ezzahra", "Fouchana", "Mornag"],
  "Manouba": ["Manouba", "Den Den", "Oued Ellil", "Douar Hicher", "Tebourba", "El Battan", "Djedeida"],
  "Nabeul": ["Nabeul", "Hammamet", "Dar Chaabane", "Korba", "Kelibia", "Menzel Temime", "Soliman", "Grombalia", "Beni Khalled", "Takelsa"],
  "Zaghouan": ["Zaghouan", "Zriba", "Bir Mcherga", "El Fahs", "Nadhour"],
  "Bizerte": ["Bizerte Nord", "Bizerte Sud", "Menzel Bourguiba", "Menzel Jemil", "Mateur", "Ras Jebel", "Utique", "Sejnane"],
  "Béja": ["Béja Nord", "Béja Sud", "Medjez el-Bab", "Testour", "Nefza", "Téboursouk"],
  "Jendouba": ["Jendouba", "Jendouba Nord", "Bou Salem", "Tabarka", "Aïn Draham", "Fernana"],
  "Le Kef": ["Le Kef Est", "Le Kef Ouest", "Nebeur", "Dahmani", "Tajerouine", "Sakiet Sidi Youssef"],
  "Siliana": ["Siliana Nord", "Siliana Sud", "Bou Arada", "Gaâfour", "Makthar", "El Krib"],
  "Sousse": ["Sousse Ville", "Sousse Jawhara", "Sousse Riadh", "Msaken", "Kalaa Kebira", "Akouda", "Hammam Sousse", "Kantaoui", "Enfidha", "M'saken"],
  "Monastir": ["Monastir", "Skanes", "Ksar Hellal", "Moknine", "Jemmal", "Sayada", "Bembla", "Ksibet el-Médiouni"],
  "Mahdia": ["Mahdia", "Rejiche", "Ksour Essef", "El Jem", "Chebba", "Bou Merdes"],
  "Sfax": ["Sfax Ville", "Sfax Médina", "Sakiet Ezzit", "Sakiet Eddaïer", "Thyna", "El Ain", "Menzel Chaker", "Jebeniana", "Mahres", "Kerkennah"],
  "Kairouan": ["Kairouan Nord", "Kairouan Sud", "Haffouz", "Chebika", "Sbikha", "El Alaâ"],
  "Kasserine": ["Kasserine Nord", "Kasserine Sud", "Sbeitla", "Fériana", "Thala", "Sbiba"],
  "Sidi Bouzid": ["Sidi Bouzid Ouest", "Sidi Bouzid Est", "Jelma", "Meknassy", "Regueb", "Mezzouna"],
  "Gabès": ["Gabès Ville", "Gabès Ouest", "Ghannouch", "Métouia", "Mareth", "El Hamma"],
  "Médenine": ["Médenine Nord", "Médenine Sud", "Djerba Houmt Souk", "Djerba Midoun", "Djerba Ajim", "Zarzis", "Ben Gardane"],
  "Tataouine": ["Tataouine Nord", "Tataouine Sud", "Ghomrassen", "Remada", "Bir Lahmar"],
  "Gafsa": ["Gafsa Nord", "Gafsa Sud", "Métlaoui", "Moularès", "El Ksar", "Redeyef"],
  "Tozeur": ["Tozeur", "Nefta", "Degache", "Hazoua"],
  "Kébili": ["Kébili Nord", "Kébili Sud", "Douz", "Souk Lahad", "Faouar"],
};

export const GOUVERNORATS = Object.keys(TUNISIA_LOCATIONS);
