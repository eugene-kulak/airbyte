{#
    Adapter Macros for the following functions:
    - Bigquery: unnest() -> https://cloud.google.com/bigquery/docs/reference/standard-sql/arrays#flattening-arrays-and-repeated-fields
    - Snowflake: flatten() -> https://docs.snowflake.com/en/sql-reference/functions/flatten.html
    - Redshift: -> https://blog.getdbt.com/how-to-unnest-arrays-in-redshift/
#}

{# flatten -------------------------------------------------     #}

{% macro unnest(array_col) -%}
  {{ adapter.dispatch('unnest')(array_col) }}
{%- endmacro %}

{% macro default__unnest(array_col) -%}
    unnest({{ array_col }})
{%- endmacro %}

{% macro bigquery__unnest(array_col) -%}
    unnest({{ array_col }})
{%- endmacro %}

{% macro redshift__unnest(array_col) -%}
    -- FIXME to implement as described here? https://blog.getdbt.com/how-to-unnest-arrays-in-redshift/
{%- endmacro %}

{% macro snowflake__unnest(array_col) -%}
    -- TODO test this!! not so sure yet...
    table(flatten({{ array_col }}))
{%- endmacro %}