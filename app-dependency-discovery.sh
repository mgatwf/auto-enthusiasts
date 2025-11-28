#!/bin/bash
# Dependency Discovery Script for:
# Java Spring Boot + Embedded/External Tomcat
# Environments: OpenShift + OpenShift Service Mesh + VMWare

REPO_DIR=${1:-"."}
OUTPUT_DIR="./dependency-output"
mkdir -p $OUTPUT_DIR

echo "🔍 Scanning source code and configurations..."

# ---- 1. Find REST & HTTP dependencies ----
echo "📡 Extracting REST/HTTP upstream calls..."
grep -R --include="*.java" -nE "httpClient|RestTemplate|WebClient|HttpURLConnection|HttpClient" $REPO_DIR > $OUTPUT_DIR/http_call_sites.txt
grep -R --include="*.java" -nE "http://|https://" $REPO_DIR >> $OUTPUT_DIR/http_call_sites.txt

# ---- 2. Scan for URLs in YAML / properties ----
grep -R --include="*.yml" --include="*.yaml" --include="*.properties" -nE "http://|https://|url=|uri=" $REPO_DIR \
 > $OUTPUT_DIR/config_urls.txt

# ---- 3. Detect Databases & Message Brokers ----
echo "🗄️ Extracting JDBC / DB / Cache dependencies..."
grep -R -nE "jdbc:|datasource|spring.datasource|mongo|redis|cassandra" $REPO_DIR \
 > $OUTPUT_DIR/datastores.txt

echo "📨 Extracting Messaging dependencies..."
grep -R -nE "kafka|amqp|rabbitmq|jms|pubsub|sns|sqs" $REPO_DIR > $OUTPUT_DIR/messaging.txt

# ---- 4. Extract Service Mesh Runtime Dependencies ----
echo "📘 Extracting Istio Service Mesh runtime dependencies (traffic telemetry)..."

oc adm top pods >/dev/null 2>&1
if [ $? -eq 0 ]; then
  # Assume oc CLI authenticated
  APP_NAMESPACE=$(oc project -q)
  echo "Using OpenShift namespace: $APP_NAMESPACE"

  # Find all pods in namespace with istio-proxy sidecar
  oc get pods -n $APP_NAMESPACE -l istio.io/rev -o json \
    | jq '.items[].metadata.name' -r > $OUTPUT_DIR/mesh_pods.txt

  # Extract inbound & outbound calls from envoy access logs
  for pod in $(cat $OUTPUT_DIR/mesh_pods.txt); do
    echo "➡️ Getting envoy logs for pod: $pod"
    oc logs $pod -c istio-proxy \
      | grep -E "GET|POST|PUT|PATCH|DELETE" \
      | awk '{print $1, $4, $7, $8}' >> $OUTPUT_DIR/mesh_runtime_calls.txt
  done
else
  echo "⚠️ oc CLI not logged in. Skipping service mesh runtime extraction."
fi

# ---- 5. Generate simple dependency summary ----
echo "📄 Generating summary file..."

{
  echo "=============================="
  echo "  Dependency Discovery Summary"
  echo "=============================="
  echo "--- Upstream HTTP Calls ---"
  cut -d '"' -f2 $OUTPUT_DIR/http_call_sites.txt | sort -u
  echo
  echo "--- Configured Upstream URLs ---"
  cut -d '=' -f2 $OUTPUT_DIR/config_urls.txt | sort -u
  echo
  echo "--- Datastores (DB/Caches) ---"
  sort -u $OUTPUT_DIR/datastores.txt
  echo
  echo "--- Messaging Systems ---"
  sort -u $OUTPUT_DIR/messaging.txt
  echo
  echo "--- Service Mesh Runtime Calls ---"
  sort -u $OUTPUT_DIR/mesh_runtime_calls.txt
} > $OUTPUT_DIR/dependency_summary.txt

echo "✅ Dependency discovery complete!"
echo "📦 Output stored in: $OUTPUT_DIR/"