import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RegisterCreds, User } from '../../../types/user';
import { AccountService } from '../../../core/services/account-service';
import { JsonPipe } from '@angular/common';
import { TextInput } from "../../../shared/text-input/text-input";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  protected accountService = inject(AccountService)
  protected router = inject(Router)
  private fb = inject(FormBuilder);
  cancelRegister = output<boolean>();
  protected creds = {} as RegisterCreds;
  protected credentialForms: FormGroup;
  protected profileForm: FormGroup;
  protected currentStep = signal(1);
  protected validationErrors = signal<string[]>([]);

  constructor() {
    this.credentialForms = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      displayName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]]
    });

    this.profileForm = this.fb.group({
      gender: ['male', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required]
    });

    this.credentialForms.controls['password'].valueChanges.subscribe(() => {
      this.credentialForms.controls['confirmPassword'].updateValueAndValidity();
    })
  }

  // Validator to check if two form fields: password and confirmPassword
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const parent = control.parent;
      if (!parent) return null;

      const matchValue = parent.get(matchTo)?.value;
      return control.value === matchValue ? null : { passwordMismatch: true }
    }
  }

  nextStep() {
    if (this.credentialForms.valid) {
      this.currentStep.update(prevState => prevState + 1);
    }
  }

  prevStep() {
    this.currentStep.update(prevState => prevState - 1);
  }

  //Make sure only 18 and above can sign up
  getMaxDate() {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split('T')[0];
  }

  register() {
    if (this.credentialForms.valid && this.profileForm.valid) {
      const formData = { ...this.credentialForms.value, ...this.profileForm.value } as RegisterCreds;
      
      console.log('Form data', formData);
      this.accountService.register(formData).subscribe({
        next: () => {
          this.router.navigateByUrl('/members');
        },
        error: error => {
          this.validationErrors.set(error)
        }
      })
    }
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
