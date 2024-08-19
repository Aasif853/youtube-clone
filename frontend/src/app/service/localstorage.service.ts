import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LocalStorageService {
  setItem(key: string, value: any) {
    localStorage.setItem(key, value);
  }

  getItem(key: string): any {
    return localStorage.getItem(key);
  }

  setBool(key: string, value: boolean) {
    localStorage.setItem(key, String(value));
  }

  getBool(key: string): boolean {
    return localStorage.getItem(key) === "true";
  }

  setObject(key: string, value: object) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  removeItem(key: string) {
    localStorage.removeItem(key);
  }
  getObject(key: string): object {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : false;
  }
}
