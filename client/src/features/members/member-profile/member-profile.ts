import { Component, Host, HostListener, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableMember, Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import { ToastService } from '../../../core/services/toast-service';
import { FormsModule, NgForm } from '@angular/forms';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css'
})
export class MemberProfile implements OnInit, OnDestroy {
  @ViewChild('editForm') editForm?: NgForm; //explain this line: it gets a reference to the form in the template with the variable name 'editForm' using ViewChild decorator
  @HostListener('window:beforeunload', ['$event']) notify($event: BeforeUnloadEvent) {
    if (this.editForm?.dirty) {
      $event.preventDefault();
    }
  }

  protected memberService = inject(MemberService);
  protected toastService = inject(ToastService);
  private accountService = inject(AccountService);
  protected editableMember: EditableMember = {
    displayName: '',
    city: '',
    country: '',
    description: ''
  }
  
  ngOnInit(): void {
    this.editableMember = {
      displayName: this.memberService.member()?.displayName || '',
      city: this.memberService.member()?.city || '',
      country: this.memberService.member()?.country || '',
      description: this.memberService.member()?.description || ''
    }
  }

  updateProfile() {
    if (!this.memberService.member()) return;
    const updatedMember = {...this.memberService.member(), ...this.editableMember};
    this.memberService.updateMember(this.editableMember).subscribe({ 
      next: () => {
        const currentUser = this.accountService.currentUser();
        if (currentUser && updatedMember.displayName !== currentUser?.displayName) { //explain this line: it checks if the current user exists and if the display name has changed
          currentUser.displayName = updatedMember.displayName; //explain this line: it updates the display name of the current user
          this.accountService.setCurrentUser(currentUser); //explain this line: it updates the current user in the account service
        }
        this.toastService.success("Profile updated successfully");
        this.memberService.editMode.set(false);
        this.memberService.member.set(updatedMember as Member);
        this.editForm?.reset(updatedMember);
      }
    });
  }

  //This lifecycle hook is used to reset the editMode signal in the MemberService when the component is destroyed, ensuring that the edit mode state does not persist unintentionally.
  ngOnDestroy(): void {
    if (this.memberService.editMode()) {
      this.memberService.editMode.set(false);
    }
  }
}
