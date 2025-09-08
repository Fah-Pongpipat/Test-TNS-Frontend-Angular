import { Component, input, OnInit, signal, ViewChild } from '@angular/core';
import { User } from './types/userType';
import { Api } from './services/api';
import { CommonModule } from '@angular/common';
import { Department } from './types/departmentType';
import { firstValueFrom } from 'rxjs';
import { UserFormDialog } from './user-form-dialog/user-form-dialog';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, UserFormDialog],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  users: User[] = [];
  departments: Department[] = [];
  @ViewChild(UserFormDialog) userForm!: UserFormDialog;
  constructor(private apiService: Api) {}
  async ngOnInit(): Promise<void> {
    console.log('ngOnInit start');

    try {
      this.users = await firstValueFrom(this.apiService.getUsers());
      console.log('Users received:', this.users);

      this.departments = await firstValueFrom(this.apiService.getAllDepartments());
      console.log('Departments received:', this.departments);
    } catch (err) {
      console.error('API error:', err);
    }
  }
  addUser() {
    this.userForm.openDialog();
  }

  editUser(user: User) {
    const clone = { ...user };
    this.userForm.openDialog(clone);
  }

  deleteUser(user: User) {
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้: ${user.first_name} ${user.last_name}?`)) {
      return;
    }

    this.apiService.removeUserById(user.user_id!).subscribe({
      next: (res) => {
        console.log('ลบ User สำเร็จ:', res);

        // รีเฟรชข้อมูลผู้ใช้ใหม่
        this.refreshUsers();
      },
      error: (err) => {
        console.error('เกิดข้อผิดพลาดในการลบ User:', err);
        alert('ไม่สามารถลบ User ได้ ลองใหม่อีกครั้ง');
      },
    });
  }
  showPosition(id: number) {
    const data = this.departments.find((d) => d.department_id === id);
    return data?.department_name;
  }
  async reloadUsers() {
    try {
      this.users = await firstValueFrom(this.apiService.getUsers());
      console.log('Users reloaded:', this.users);
    } catch (err) {
      console.error('API error:', err);
    }
  }
  async refreshUsers() {
    try {
      this.users = await firstValueFrom(this.apiService.getUsers());
      console.log('Users updated:', this.users);
    } catch (err) {
      console.error('API error:', err);
    }
  }
}
