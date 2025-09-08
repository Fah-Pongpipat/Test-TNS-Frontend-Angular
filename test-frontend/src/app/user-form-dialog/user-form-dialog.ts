import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { User } from '../types/userType';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Api } from '../services/api';
import { firstValueFrom } from 'rxjs';
import { Department } from '../types/departmentType';
@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './user-form-dialog.html',
  styleUrl: './user-form-dialog.css',
})
export class UserFormDialog {
  showDialog = false; // ควบคุมการแสดง dialogฃ
  @Input() formData: User = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department_id: 0,
  };
  departments: Department[] = [];
  constructor(private apiService: Api) {}
  async ngOnInit(): Promise<void> {
    console.log('ngOnInit start');

    try {
      this.departments = await firstValueFrom(this.apiService.getAllDepartments());
      console.log('Departments received:', this.departments);
    } catch (err) {
      console.error('API error:', err);
    }
  }
  openDialog(user?: User) {
    if (user) {
      this.formData = { ...user }; // copy ไม่ใช่ reference
      console.log('data :', this.formData);
    } else {
      this.formData = {
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        department_id: 0,
      };
    }
    this.showDialog = true;
  }
  closeDialog() {
    this.showDialog = false;
  }
  @Output() userAdded = new EventEmitter<void>(); // ส่ง event ไปแม่
  saveData() {
    if (!this.formData.first_name || !this.formData.last_name || !this.formData.email) {
      console.warn('กรุณากรอกข้อมูลให้ครบ');
      return;
    }
    if (this.formData.user_id && this.formData.user_id > 0) {
      const updateUser = { ...this.formData };
      delete updateUser.user_id;
      this.apiService.updateUserById(this.formData.user_id, updateUser).subscribe({
        next: (res) => {
          console.log('อัปเดต User สำเร็จ:', res);

          this.closeDialog();

          // รีเซ็ตค่า
          this.formData = {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            department_id: 0,
          };
          this.userAdded.emit();
        },
        error: (err) => {
          console.error('เกิดข้อผิดพลาดในการอัปเดต User:', err);
          alert('ไม่สามารถอัปเดต User ได้ ลองใหม่อีกครั้ง');
        },
      });
    } else {
      this.apiService.createdNewUser(this.formData).subscribe({
        next: (res) => {
          console.log('เพิ่ม User สำเร็จ:', res);

          // ปิด dialog
          this.closeDialog();

          // รีเซ็ต formData
          this.formData = {
            first_name: '',
            last_name: '',
            email: '',
            phone: '',
            department_id: 0,
          };
          this.userAdded.emit();
        },

        error: (err) => {
          console.error('เกิดข้อผิดพลาดในการเพิ่ม User:', err);
          alert('ไม่สามารถเพิ่ม User ได้ ลองใหม่อีกครั้ง');
        },
      });
    }
  }
}
