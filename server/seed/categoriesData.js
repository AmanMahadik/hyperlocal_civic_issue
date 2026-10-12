const categoriesData = [
  {
    code: 'GARBAGE',
    name: 'Garbage & Waste Dumps',
    slug: 'garbage-and-waste',
    icon: 'Trash2',
    defaultPriority: 'high',
    slaDays: 2,
    department: 'Solid Waste Management'
  },
  {
    code: 'ROAD',
    name: 'Road Damage & Potholes',
    slug: 'road-damage-potholes',
    icon: 'AlertTriangle',
    defaultPriority: 'high',
    slaDays: 3,
    department: 'Road & Infrastructure Dept'
  },
  {
    code: 'DRAINAGE',
    name: 'Drainage Overflow & Water-logging',
    slug: 'drainage-water-logging',
    icon: 'Droplets',
    defaultPriority: 'high',
    slaDays: 2,
    department: 'Drainage & Sewerage Dept'
  },
  {
    code: 'WATER_SUPPLY',
    name: 'Water Supply & Pipeline Leakage',
    slug: 'water-supply-leakage',
    icon: 'Activity',
    defaultPriority: 'high',
    slaDays: 2,
    department: 'Water Supply Dept'
  },
  {
    code: 'STREETLIGHT',
    name: 'Broken Streetlights & Electrical',
    slug: 'broken-streetlights',
    icon: 'Zap',
    defaultPriority: 'medium',
    slaDays: 2,
    department: 'Electrical Dept'
  },
  {
    code: 'FOOTPATH',
    name: 'Damaged Footpaths & Manholes',
    slug: 'footpath-manholes',
    icon: 'Footprints',
    defaultPriority: 'medium',
    slaDays: 4,
    department: 'Civil Works Dept'
  },
  {
    code: 'TREE',
    name: 'Fallen Trees & Hazardous Branches',
    slug: 'tree-and-greenery',
    icon: 'TreePine',
    defaultPriority: 'medium',
    slaDays: 2,
    department: 'Garden Dept'
  },
  {
    code: 'STRAY_ANIMALS',
    name: 'Stray Animals & Menace',
    slug: 'stray-animals',
    icon: 'Dog',
    defaultPriority: 'medium',
    slaDays: 3,
    department: 'Veterinary Dept'
  },
  {
    code: 'PUBLIC_TOILET',
    name: 'Unhygienic Public Toilets',
    slug: 'public-toilets',
    icon: 'Sparkles',
    defaultPriority: 'high',
    slaDays: 2,
    department: 'Health & Sanitation Dept'
  },
  {
    code: 'MOSQUITO',
    name: 'Mosquito Breeding & Stagnant Water',
    slug: 'mosquito-breeding',
    icon: 'Bug',
    defaultPriority: 'high',
    slaDays: 2,
    department: 'Health Dept'
  },
  {
    code: 'ENCROACHMENT',
    name: 'Illegal Encroachments & Hawkers',
    slug: 'encroachment',
    icon: 'ShieldAlert',
    defaultPriority: 'medium',
    slaDays: 5,
    department: 'Anti-Encroachment Dept'
  },
  {
    code: 'OTHER',
    name: 'Other Civic Grievance',
    slug: 'other-grievance',
    icon: 'HelpCircle',
    defaultPriority: 'medium',
    slaDays: 5,
    department: 'Citizen Grievance Cell'
  }
];

module.exports = categoriesData;
