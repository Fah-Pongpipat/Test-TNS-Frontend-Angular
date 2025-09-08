import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../types/userType';
import { Department } from '../types/departmentType';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private BASE_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) {}
  getUsers(): Observable<User[]> {
    console.log('Fetching users from API...');
    return this.http.get<User[]>(`${this.BASE_URL}/users`);
  }

  updateUserById(id: number, user: User) {
    return this.http.put(`${this.BASE_URL}/users/${id}`, user);
  }
  findUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.BASE_URL}/users/${id}`);
  }
  removeUserById(id: number) {
    return this.http.delete(`${this.BASE_URL}/users/${id}`);
  }
  createdNewUser(user: User) {
    return this.http.post(`${this.BASE_URL}/users/addUser`, user);
  }
  findDepartmentById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.BASE_URL}/department/${id}`);
  }
  getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.BASE_URL}/department`);
  }
}
