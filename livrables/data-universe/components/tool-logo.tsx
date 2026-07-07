"use client";
import { useState } from "react";

// Simple Icons CDN — slugs qui existent (ERR sans 404 = fonctionne en navigateur)
const SI_MAP: Record<string, string> = {
  // Data Warehouse / Lakehouse
  "snowflake":            "snowflake",
  "databricks":           "databricks",
  "google-bigquery":      "googlebigquery",
  "clickhouse":           "clickhouse",
  "delta-lake":           "delta",
  // Orchestration
  "apache-airflow":       "apacheairflow",
  "airflow":              "apacheairflow",
  "prefect":              "prefect",
  // Streaming / Messaging
  "apache-kafka":         "apachekafka",
  "rabbitmq":             "rabbitmq",
  // Processing
  "apache-spark":         "apachespark",
  "apache-flink":         "apacheflink",
  "pandas":               "pandas",
  "polars":               "polars",
  "duckdb":               "duckdb",
  "trino":                "trino",
  // Databases
  "mongodb":              "mongodb",
  "postgresql":           "postgresql",
  "redis":                "redis",
  "elasticsearch":        "elasticsearch",
  // Integration
  "airbyte":              "airbyte",
  "talend":               "talend",
  // BI / Dataviz
  "looker":               "looker",
  "metabase":             "metabase",
  "grafana":              "grafana",
  // ML / Frameworks
  "pytorch":              "pytorch",
  "tensorflow":           "tensorflow",
  "scikit-learn":         "scikitlearn",
  "mlflow":               "mlflow",
  "hugging-face":         "huggingface",
  // IA Générative
  "anthropic":            "anthropic",
  "langchain":            "langchain",
  "ollama":               "ollama",
  // Data Apps
  "streamlit":            "streamlit",
  "fastapi":              "fastapi",
  "jupyter":              "jupyter",
  "jupyterlab":           "jupyter",
  // Infra / DevOps
  "terraform":            "terraform",
  "docker":               "docker",
  "kubernetes":           "kubernetes",
  "pulumi":               "pulumi",
  // Cloud Providers
  "gcp":                  "googlecloud",
  "google-cloud":         "googlecloud",
  // BI misc
  "qlik-sense":           "qlik",
  // MLOps
  "weights-and-biases":   "weightsandbiases",
};

// Domaines → Google Favicons API (outils absents de Simple Icons ou slugs 404)
const DOMAIN_MAP: Record<string, string> = {
  // dbt (slug "dbt" retourne 404 sur SI)
  "dbt-core":             "getdbt.com",
  "dbt-cloud":            "getdbt.com",
  // Fivetran (slug 404 sur SI)
  "fivetran":             "fivetran.com",
  // OpenAI (slug 404 sur SI)
  "openai":               "openai.com",
  // Power BI (slugs powerbi et microsoftpowerbi retournent 404 sur SI)
  "power-bi":             "powerbi.microsoft.com",
  // Tableau (slug 404 sur SI)
  "tableau":              "tableau.com",
  // SAS (slug 404 sur SI)
  "sas-viya":             "sas.com",
  // Amazon / AWS (aucun slug AWS n'existe sur SI)
  "aws":                  "aws.amazon.com",
  "amazon-kinesis":       "aws.amazon.com",
  "amazon-redshift":      "aws.amazon.com",
  "amazon-sagemaker":     "aws.amazon.com",
  "aws-sagemaker":        "aws.amazon.com",
  // Microsoft Azure (slug microsoftazure retourne 404 sur SI)
  "azure":                "azure.microsoft.com",
  "azure-ml":             "azure.microsoft.com",
  "azure-machine-learning": "azure.microsoft.com",
  // Google Cloud services
  "google-vertex-ai":     "cloud.google.com",
  "vertex-ai":            "cloud.google.com",
  // Microsoft
  "microsoft-fabric":     "microsoft.com",
  "microsoft-purview":    "microsoft.com",
  // Vector DBs (slugs 404 sur SI)
  "pinecone":             "pinecone.io",
  "weaviate":             "weaviate.io",
  // Analytics (slugs 404 sur SI)
  "amplitude":            "amplitude.com",
  "segment":              "segment.com",
  // Orchestration
  "dagster":              "dagster.io",
  "astronomer":           "astronomer.io",
  "kestra":               "kestra.io",
  "mage-ai":              "mage.ai",
  // Data Quality / Observabilité
  "great-expectations":   "greatexpectations.io",
  "monte-carlo":          "montecarlodata.com",
  "soda":                 "soda.io",
  "evidently":            "evidentlyai.com",
  // Data Governance / Catalog
  "datahub":              "datahubproject.io",
  "alation":              "alation.com",
  "collibra":             "collibra.com",
  // Formats Lakehouse
  "apache-iceberg":       "iceberg.apache.org",
  "apache-hudi":          "hudi.apache.org",
  // BI
  "apache-superset":      "superset.apache.org",
  "lightdash":            "lightdash.com",
  "looker-studio":        "lookerstudio.google.com",
  "redash":               "redash.io",
  "evidence":             "evidence.dev",
  // Data Engineering
  "dask":                 "dask.org",
  "altimate-code":        "altimate.ai",
  // ML Platform
  "dataiku":              "dataiku.com",
  "hopsworks":            "hopsworks.ai",
  "metaflow":             "metaflow.org",
  "feast":                "feast.dev",
  "ray":                  "ray.io",
  // MLOps
  "langfuse":             "langfuse.com",
  // IA Générative
  "mistral":              "mistral.ai",
  "chromadb":             "trychroma.com",
  "llamaindex":           "llamaindex.ai",
  "dspy":                 "dspy.ai",
  "gradio":               "gradio.app",
  "qdrant":               "qdrant.tech",
  "vllm":                 "vllm.ai",
  // Integration
  "census":               "getcensus.com",
  // Monitoring
  "datadog":              "datadoghq.com",
  // Misc
  "optuna":               "optuna.org",
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
  const [failed, setFailed] = useState(false);

  const siSlug = SI_MAP[slug];
  const domain = DOMAIN_MAP[slug];

  const emojiSize = Math.round(size * 0.78);

  if (failed || (!siSlug && !domain)) {
    return <span style={{ fontSize: emojiSize, lineHeight: 1 }}>{emoji}</span>;
  }

  if (siSlug) {
    return (
      <img
        src={`https://cdn.simpleicons.org/${siSlug}`}
        alt={`${name} logo`}
        width={size}
        height={size}
        style={{ objectFit: "contain", display: "block" }}
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <img
      src={faviconUrl(domain!, 128)}
      alt={`${name} logo`}
      width={size}
      height={size}
      style={{ objectFit: "contain", display: "block", borderRadius: 4 }}
      onError={() => setFailed(true)}
    />
  );
}
