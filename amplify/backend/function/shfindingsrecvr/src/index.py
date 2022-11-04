import os
import sys
import boto3
import json
import logging
from datetime import date, datetime

session = boto3.Session()

LOGGER = logging.getLogger()
if 'log_level' in os.environ:
    LOGGER.setLevel(os.environ['log_level'])
    LOGGER.info('Log level set to %s' % LOGGER.getEffectiveLevel())
else:
    LOGGER.setLevel(logging.ERROR)

def json_serial(obj):
    if isinstance(obj, (datetime, date)):
        return obj.isoformat()
    raise TypeError('Type %s not serializable' % type(obj))

def assume_role(org_id, aws_account_number, role_name):
    sts_client = boto3.client('sts')
    partition = sts_client.get_caller_identity()['Arn'].split(":")[1]
    response = sts_client.assume_role(
        RoleArn='arn:%s:iam::%s:role/%s' % (
            partition, aws_account_number, role_name
        ),
        RoleSessionName=str(aws_account_number+'-'+role_name),
        ExternalId=org_id
    )
    sts_session = boto3.Session(
        aws_access_key_id=response['Credentials']['AccessKeyId'],
        aws_secret_access_key=response['Credentials']['SecretAccessKey'],
        aws_session_token=response['Credentials']['SessionToken']
    )
    LOGGER.info("Assumed region_session for Account {}".format(aws_account_number))
    return sts_session

def get_findings(member_session, account_id, region, product):
  try:
    filters = {
        'ProductName': [
            {
                'Value': product,
                'Comparison': 'EQUALS'
            }
        ],
        'AwsAccountId': [
            {
                'Value': account_id,
                'Comparison': 'EQUALS'
            }
        ],
        'Region': [
            {
                'Value': region,
                'Comparison': 'EQUALS'
            }
        ],
        'WorkflowStatus': [
            {
                'Value': 'NEW',
                'Comparison': 'EQUALS'
            },
            {
                'Value': 'NOTIFIED',
                'Comparison': 'EQUALS'
            }
        ],
        'RecordState': [
            {
                'Value': 'ACTIVE',
                'Comparison': 'EQUALS'
            }
        ],
        'ComplianceStatus': [
            {
                'Value': 'FAILED',
                'Comparison': 'EQUALS'
            }
        ]
    }
    sh_client = member_session.client('securityhub', endpoint_url=f"https://securityhub.{region}.amazonaws.com", region_name=region)
    paginator = sh_client.get_paginator('get_findings')
    iterator = paginator.paginate(Filters=filters)
    findings_array = []
    for page in iterator:
      for finding in page['Findings']:
        findings_item = {
          'id': finding['Id'],
          'account': finding['AwsAccountId'],
          'region': finding['Region'],
          'firstObservedAt': finding['FirstObservedAt'],
          'lastObservedAt': finding['LastObservedAt'],
          'severity': finding['Severity']['Label'],
          'compliance': finding['Compliance']['Status'],
          'title': finding['Title'],
          'description': finding['Description'],
          'remediation': {
            'recommendation': {
              'text': finding['Remediation']['Recommendation']['Text'],
              'url': finding['Remediation']['Recommendation']['Url']
            }
          }
        }
        resources = []
        for resource in finding['Resources']:
          resources.append({ 'id': resource['Id'], 'type': resource['Type'] })
        findings_item.update({'resources': resources})
        findings_array.append(findings_item)
      return findings_array
  except Exception as e:
    LOGGER.error("Failed in get_findings")
    LOGGER.error(str(e))

def handler(event, context):
  print('received event:')
  print(event)
  org_id = event['queryStringParameters']['org_id']
  account_id = event['queryStringParameters']['member_account']
  region = event['queryStringParameters']['member_region']
  product = event['queryStringParameters']['product_name']
  assume_role_name = event['queryStringParameters']['assume_role']
  member_session = assume_role(org_id, account_id, assume_role_name)
  findings_array = get_findings(member_session, account_id, region, product)
  return {
      'isBase64Encoded': 'false',
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': json.dumps(findings_array)
  }
