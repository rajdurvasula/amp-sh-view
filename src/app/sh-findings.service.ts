import { Injectable } from '@angular/core';

import { API } from 'aws-amplify';

import { Observable, of } from 'rxjs';

import { ShFinding, Resource } from './sh-finding';
import { ShFindingUi, ControlData } from './sh-finding-ui';


@Injectable({
  providedIn: 'root'
})
export class ShFindingsService {

  public findings: Array<ShFindingUi> = [];
  selectedFindingId: string;

  constructor() { }
  
  public getFindings() {
    this.queryFindings();
    return this.findings;
  }
  
  public getTopFindings(): Observable<ShFindingUi[]> {
    this.queryFindings();
    // return HIGH, MEDIUM
    return of(this.findings);
  }
  
  public selectFinding(findingId: string) {
    this.selectedFindingId = findingId;
  }
  
  public getFindingDetail(id: string): ShFindingUi {
    const finding = this.findings.find(f => f.id.identifier === id);
    return finding as ShFindingUi;
  }

  private parseFindingId(id: string): ControlData {
	  let delim_by_colons = id.split(':');
	  let product = delim_by_colons[2];
	  let region = delim_by_colons[3];
	  let account = delim_by_colons[4];
	  let delim_by_slash = delim_by_colons[5].split('/');
	  let control_name = delim_by_slash[1];
	  let version = delim_by_slash[3];
	  let control_number = delim_by_slash[4];
	  let identifier = delim_by_slash[6];
	  let controlData: ControlData = {
		  identifier: identifier,
		  product: product,
		  region: region,
		  account: account,
		  name: control_name,
		  version: version,
		  index: control_number
	  };
	  return controlData;

  }
  
  async queryFindings() {
    const req_headers = {
	    headers: {},
	    response: true,
	    queryStringParameters: {
      		'org_id': 'o-a4tlobvmc0',
      		'member_account': '779225950789',
      		'member_region': 'us-east-1',
      		'product_name': 'Security Hub',
      		'assume_role': 'AWSControlTowerExecution'
	    }
    }
    await API.get('shfindingsrecvr', '/shfindings', req_headers)
    .then(response => {
	    let localFindings: ShFinding[]  = response.data;
	    localFindings.forEach(localFinding => {
		    let newFinding: ShFindingUi = {
		    	'id': this.parseFindingId(localFinding.id),
		    	'account': localFinding.account,
		    	'firstObservedAt': localFinding.firstObservedAt,
		    	'lastObservedAt': localFinding.lastObservedAt,
		    	'severity': localFinding.severity,
		    	'compliance': localFinding.compliance,
		    	'title': localFinding.title,
		    	'description': localFinding.description,
		    	'remediation': {
			    'recommendation': {
				    'text': localFinding.remediation.recommendation.text,
				    'url': localFinding.remediation.recommendation.url
			    }
		    	},
			'region': localFinding.region,
			'resources': localFinding.resources 
		    };
		    this.findings.push(newFinding);
	    });
    }).catch(e => {
      console.log('Error in API.get()', e);
    })
  }
}
