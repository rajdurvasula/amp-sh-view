import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { ShFindingsService } from '../sh-findings.service';
import { ShFindingUi } from '../sh-finding-ui';

@Component({
  selector: 'app-sh-finding-detail',
  templateUrl: './sh-finding-detail.component.html',
  styleUrls: ['./sh-finding-detail.component.css']
})
export class ShFindingDetailComponent implements OnInit {
  @Input() finding: ShFindingUi;

  constructor(
    private route: ActivatedRoute,
    private findingsService: ShFindingsService,
    private location: Location) { }

  ngOnInit(): void {
    this.getFinding();
  }
  
  getFinding(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id); 
    this.finding = this.findingsService.getFindingDetail(id as string);
  }
  
  goBack(): void {
    this.location.back();
  }

}
