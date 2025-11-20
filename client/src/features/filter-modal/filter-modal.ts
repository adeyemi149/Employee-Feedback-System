import { Component, ElementRef, input, model, output, signal, ViewChild } from '@angular/core';
import { MemberParams } from '../../types/member';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-modal',
  imports: [FormsModule],
  templateUrl: './filter-modal.html',
  styleUrl: './filter-modal.css'
})
export class FilterModal {
  @ViewChild('filterModal') modalRef!: ElementRef<HTMLDialogElement>
  closeModal = output();
  submitData = output<MemberParams>();
  memberParams = signal(new MemberParams());
  currentParams = input.required<MemberParams>();

  // constructor() {
  //   const filters = localStorage.getItem('filters'); 
  //   if (filters) {
  //     this.memberParams.set(JSON.parse(filters));
  //   }
  // }


  open() {
    this.memberParams.set({...this.currentParams()}); 
    this.modalRef.nativeElement.showModal();
  }

  close() {
    this.modalRef.nativeElement.close();
    this.closeModal.emit();
  }

  submit() {
    this.submitData.emit(this.memberParams());
    this.close();
  }

  onMinAgeChange() {
    if (this.memberParams().minAge > 18) this.memberParams().minAge = 18;
  }

  onMaxAgeChange() {
    if (this.memberParams().maxAge < this.memberParams().minAge) {
      this.memberParams().maxAge = this.memberParams().minAge;
    }
  }
}
