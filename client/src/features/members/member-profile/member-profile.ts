import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../../types/member';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css'
})
export class MemberProfile implements OnInit {
  private route = inject(ActivatedRoute);
  protected member = signal<Member | undefined>(undefined);
  
  ngOnInit(): void {
    this.route.parent?.data.subscribe(data => {
      this.member.set(data['member']);//explain this line: it subscribes to the parent route's data to get the member information and sets it to the member signal
    })
}
}
