#!/usr/bin/env bash

set -e

mkdir airbyte-integrations/connectors/destination-bigquery/secrets/
echo "$BIGQUERY_INTEGRATION_TEST_CREDS" > airbyte-integrations/connectors/destination-bigquery/secrets/credentials.json

mkdir airbyte-integrations/connectors/source-stripe-singer/secrets/
echo "$STRIPE_INTEGRATION_TEST_CREDS" > airbyte-integrations/connectors/source-stripe-singer/secrets/config.json

mkdir airbyte-integrations/connectors/source-github-singer/secrets/
# pull sample config. add in the access key. write to secrets.
jq --arg v "$GH_INTEGRATION_TEST_CREDS" '.access_token = $v' airbyte-integrations/connectors/source-github-singer/config.sample.json > airbyte-integrations/connectors/source-github-singer/secrets/config.json

mkdir airbyte-integrations/connectors/source-googleanalytics-singer/secrets/
echo "$GOOGLE_ANALYTICS_TEST_CREDS" > airbyte-integrations/connectors/source-googleanalytics-singer/secrets/config.json
echo "GOOGLE_ANALYTICS_TEST_TRACKING_ID" > airbyte-integrations/connectors/source-googleanalytics-singer/secrets/tracker.txt

mkdir airbyte-integrations/connectors/source-salesforce-singer/secrets/
echo "$SALESFORCE_INTEGRATION_TESTS_CREDS" > airbyte-integrations/connectors/source-salesforce-singer/secrets/config.json

mkdir airbyte-integrations/connectors/source-hubspot-singer/secrets/
echo "$HUBSPOT_INTEGRATION_TESTS_CREDS" > airbyte-integrations/connectors/source-hubspot-singer/secrets/config.json

mkdir airbyte-integrations/connectors/source-google-sheets/secrets
echo "$GSHEETS_INTEGRATION_TESTS_CREDS" > airbyte-integrations/connectors/source-google-sheets/secrets/creds.json

mkdir airbyte-integrations/connectors/destination-snowflake/secrets
echo "$SNOWFLAKE_INTEGRATION_TEST_CREDS" > airbyte-integrations/connectors/destination-snowflake/secrets/config.json

mkdir airbyte-integrations/connectors/source-google-adwords-singer/secrets
echo "$ADWORDS_INTEGRATION_TEST_CREDS" > airbyte-integrations/connectors/source-google-adwords-singer/secrets/config.json

FB_SECRETS_DIR=airbyte-integrations/connectors/source-facebook-marketing-api-singer/secrets
mkdir $FB_SECRETS_DIR
echo "$FACEBOOK_MARKETING_API_TEST_INTEGRATION_CREDS" > "${FB_SECRETS_DIR}/config.json"
