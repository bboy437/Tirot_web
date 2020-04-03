import { Injectable } from '@angular/core';
 
// import ในส่วนที่จะใช้งานกับ Observable
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';
import { map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppConfig } from '../../app.config';


@Injectable()
export class AuthService {
  public results:any;
  public isLoggedIn:boolean = false; // กำหนดสถานะล็อกอินเริ่มต้นเป็น false
  public redirectUrl: string; // กำหนดตัวแปรสำหรับเก็บ url ที่จะลิ้งค์ไป
  public responseLogin:ResponseLogin;
  protected ServerApiUrl = AppConfig.settings.ServerApiUrl;
  constructor(private http: HttpClient) { }
 


login(username: string, password: string) {

    var content = JSON.stringify({
        UserName: username,
        Password: password
    });

    const headerDict = {
        'Content-Type': 'application/json'
        //  ,'Host':'192.168.0.2'
        // ,'Access-Control-Allow-Origin': '*'
      }


    return this.http.post<any>(this.ServerApiUrl +'Account/Login', content,{headers:headerDict})
        .map(res => {
            this.responseLogin = res;
            console.log(this.responseLogin);
            if(this.responseLogin.success)
            {
                localStorage.setItem("token",this.responseLogin.data);
                localStorage.setItem("isLoggedIn","true");
                
            }
            else
            {

            }
            return this.responseLogin.success;
        });
}

  // ฟังก์ชั่นจำลองการล็อกเอาท์
  logout(): void {
    // ให้ค่าสถานะล็อกอินเป็น false
    localStorage.clear();
  }  
 
}

interface ResponseLogin {
    success: boolean;
    message: string;
    data: string;
  }