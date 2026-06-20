"use client";

// Outils présents dans Simple Icons (slugs vérifiés)
const SI_MAP: Record<string, string> = {
  "snowflake":          "snowflake",
  "databricks":         "databricks",
  "bigquery":           "googlebigquery",
  "dbt-core":           "dbt",
  "dbt-cloud":          "dbt",
  "airflow":            "apacheairflow",
  "prefect":            "prefect",
  "kafka":              "apachekafka",
  "spark":              "apachespark",
  "fivetran":           "fivetran",
  "airbyte":            "airbyte",
  "power-bi":           "powerbi",
  "tableau":            "tableau",
  "looker":             "looker",
  "metabase":           "metabase",
  "mlflow":             "mlflow",
  "hugging-face":       "huggingface",
  "duckdb":             "duckdb",
  "pandas":             "pandas",
  "polars":             "polars",
  "apache-flink":       "apacheflink",
  "scikit-learn":       "scikitlearn",
  "pytorch":            "pytorch",
  "langchain":          "langchain",
  "openai-api":         "openai",
  "wandb":              "weightsandbiases",
  "grafana":            "grafana",
  "clickhouse":         "clickhouse",
  "elasticsearch":      "elasticsearch",
  "fastapi":            "fastapi",
  "terraform":          "terraform",
  "talend":             "talend",
  "streamlit":          "streamlit",
  "jupyter":            "jupyter",
  "qlik-sense":         "qlik",
  "google-cloud":       "googlecloud",
  "vertex-ai":          "googlecloud",
  "dataflow":           "googlecloud",
  "pubsub":             "googlecloud",
  "aws":                "amazonaws",
  "aws-glue":           "amazonaws",
  "aws-sagemaker":      "amazonaws",
  "aws-kinesis":        "amazonaws",
  "amazon-quicksight":  "amazonaws",
  "azure":              "microsoftazure",
  "azure-synapse":      "microsoftazure",
  "azure-data-factory": "microsoftazure",
  "azure-ml":           "microsoftazure",
  "microsoft-fabric":   "microsoftfabric",
  "pinecone":           "pinecone",
  "weaviate":           "weaviate",
  "sas-viya":           "sas",
};

// Domaines pour les outils sans Simple Icons → Google Favicons API
const DOMAIN_MAP: Record<string, string> = {
  "dataiku":            "dataiku.com",
  "dagster":            "dagster.io",
  "great-expectations": "greatexpectations.io",
  "evidently":          "evidentlyai.com",
  "apache-superset":    "superset.apache.org",
  "trino":              "trino.io",
  "apache-iceberg":     "iceberg.apache.org",
  "chromadb":           "trychroma.com",
  "llamaindex":         "llamaindex.ai",
  "kestra":             "kestra.io",
  "datahub":            "datahubproject.io",
  "dask":               "dask.org",
  "redash":             "redash.io",
  "soda-core":          "soda.io",
};

function faviconUrl(domain: string, sz = 128) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=${sz}`;
}

export function ToolLogo({
  slug,
  emoji,
  name,
  size = 32,
}: {
  slug: string;
  emoji: string;
  name: string;
  size?: number;
}) {
  const siSlug  = SI_MAP[slug];
  const domain  = DOMAIN_MAP[slug];

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    target.style.display = "none";
    const span = document.createElement("span");
    span.textContent = emoji;
    span.style.fontSize = `${Math.round(size * 0.78)}px`;
    target.parentNode?.insertBefore(span, target.nextSibling);
  };

  if (siSlug) {
    return (
      <img
        src={`https://cdn.simpleicons.org/${siSlug}`}
        alt={`${name} logo`}
        width={size}
        height={size}
        style={{ objectFit: "contain", display: "block" }}
        onError={handleError}
      />
    );
  }

  if (domain) {
    return (
      <img
        src={faviconUrl(domain, 128)}
        alt={`${name} logo`}
        width={size}
        height={size}
        style={{ objectFit: "contain", display: "block", borderRadius: 4 }}
        onError={handleError}
      />
    );
  }

  return <span style={{ fontSize: Math.round(size * 0.78) }}>{emoji}</span>;
}
