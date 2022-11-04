import { Component, OnInit } from '@angular/core';
import { ShFindingsService } from '../sh-findings.service';
import { ShFindingUi, ControlData } from '../sh-finding-ui';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  findings: ShFindingUi[] = [];
  selectedFinding: ShFindingUi;

  constructor(private findingsService: ShFindingsService) { }

  ngOnInit(): void {
    this.refreshFindings();
  }

  public selectFinding(finding: ShFindingUi) {
	  this.selectedFinding = finding;
  }
  
  private refreshFindings() {
    this.findingsService.getTopFindings()
    .subscribe(results => {
	    this.findings = results;
    }, error => {
	    console.log(error);
    });
    
  }

}
