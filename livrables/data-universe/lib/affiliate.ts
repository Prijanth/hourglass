// Config centralisée des liens affiliés
// Quand tu rejoins un programme, remplace les IDs ici — toutes les pages se mettent à jour automatiquement.
//
// Programmes à rejoindre :
// - Udemy   : https://www.udemy.com/affiliate/  (via Rakuten/LinkSynergy, commission ~10-15%)
// - Coursera: https://about.coursera.org/affiliates/ (via Impact.com, commission ~45%)
// - DataCamp: https://www.datacamp.com/affiliates (commission ~33%)

const UDEMY_AFFILIATE_ID = "";    // ex: "ABC123xyz" (depuis Rakuten dashboard)
const COURSERA_AFFILIATE_ID = ""; // ex: "imp.i384100.net" (depuis Impact.com)

export function udemyUrl(courseUrl: string): string {
  if (!UDEMY_AFFILIATE_ID) return courseUrl;
  return `https://click.linksynergy.com/deeplink?id=${UDEMY_AFFILIATE_ID}&mid=39197&murl=${encodeURIComponent(courseUrl)}`;
}

export function courseraUrl(courseUrl: string): string {
  if (!COURSERA_AFFILIATE_ID) return courseUrl;
  return `https://${COURSERA_AFFILIATE_ID}/net/i/${encodeURIComponent(courseUrl)}`;
}

export function datacampUrl(courseUrl: string): string {
  return courseUrl; // DataCamp utilise un lien de tracking personnalisé — à configurer dans leur dashboard
}

// Mapping des cours de préparation recommandés par certification (ID certif → URL Udemy du meilleur cours)
export const CERT_PREP_COURSES: Record<string, { udemy?: string; coursera?: string; datacamp?: string }> = {
  "aws-cloud-practitioner": {
    udemy: "https://www.udemy.com/course/aws-certified-cloud-practitioner-new/",
    coursera: "https://www.coursera.org/learn/aws-cloud-practitioner-essentials",
  },
  "aws-data-engineer-associate": {
    udemy: "https://www.udemy.com/course/aws-certified-data-engineer-associate/",
  },
  "aws-ml-specialty": {
    udemy: "https://www.udemy.com/course/aws-machine-learning/",
    coursera: "https://www.coursera.org/specializations/machine-learning-amazon-aws",
  },
  "aws-solutions-architect-associate": {
    udemy: "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/",
  },
  "azure-fundamentals-900": {
    udemy: "https://www.udemy.com/course/az900-azure/",
    coursera: "https://www.coursera.org/learn/microsoft-azure-fundamentals-az-900-exam-prep",
  },
  "azure-data-fundamentals-900": {
    udemy: "https://www.udemy.com/course/azure-data-fundamentals-dp-900/",
  },
  "azure-data-engineer-203": {
    udemy: "https://www.udemy.com/course/dp200-azure/",
  },
  "gcp-professional-data-engineer": {
    udemy: "https://www.udemy.com/course/google-cloud-professional-data-engineer-get-certified/",
    coursera: "https://www.coursera.org/professional-certificates/gcp-data-engineering",
  },
  "databricks-ml-associate": {
    udemy: "https://www.udemy.com/course/databricks-certified-machine-learning-associate/",
  },
  "snowflake-snowpro-core": {
    udemy: "https://www.udemy.com/course/snowflake-snowpro-core-certification/",
  },
  "dbt-analytics-engineer": {
    udemy: "https://www.udemy.com/course/complete-dbt-data-build-tool-bootcamp-zero-to-hero-learn-dbt/",
  },
};

export function getCertPrepUrl(certId: string, platform: "udemy" | "coursera" | "datacamp"): string | null {
  const courses = CERT_PREP_COURSES[certId];
  if (!courses?.[platform]) return null;
  const url = courses[platform]!;
  if (platform === "udemy") return udemyUrl(url);
  if (platform === "coursera") return courseraUrl(url);
  return url;
}
