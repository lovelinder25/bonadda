import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, catchError, concatAll, map, observeOn, retry, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class ProductService {

    API_URL = 'https://private-anon-ef202c5fa9-onlineorderingapisv210.apiary-mock.com/fetchmenu ';
    APIMYURL = 'https://api.bongateaubakeryncafe.in/'


    APIMYURL2 = 'http://localhost:3000/'




    isUserLoggedIn = new BehaviorSubject<boolean>(false);
    isAdminLoggedIn = new BehaviorSubject<boolean>(false);
    isLoginError = new BehaviorSubject<boolean>(false);



    constructor(
        private _http: HttpClient,
        private router: Router
    ) { }


    headers = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('app-key', '2xmbdf5e01pjusiqokcw64nh38r9ytgv')
        .set('app-secret', '617cde9e9fffa154ca8515f3bf692f79803261ab')
        .set('access-token', 'ba6f62f4121aa56b042f605a45bd91f45606c8bf')
        .set('Access-Control-Allow-Origin', '*')
  



    //  fatchMenu() {
    //      let data = `{ "restID": "okz15g4x" }`;
    //      return this._http.post(`${this.APIMYURL}store_status_ui`,  { observe: "response" }).pipe(
    //          retry(1)
    //      )
    //  }

    fatchMenu() {
        return this._http.get(`${this.APIMYURL}get_menu`, { observe: "response" }).pipe(
            retry(1)
        )
    }

    fatchMenu2(restID: any) {
        return this._http.get(`${this.APIMYURL}getmenu/${restID}`, { observe: "response" })
    }


    getOtp(data: any) {
        return this._http.post(`${this.APIMYURL}user_login`, data, { observe: "response" })
    }

    VerifyOtp(data: any) {
        return this._http.post(`${this.APIMYURL}mobile_login`, data, { observe: "response" }).subscribe((response: any) => {
            console.warn(response)
            if (response && response.body && response.body.status == true) {
                let obj = {
                    session_key: response.body.session_key,
                    reFreshToken: response.body.reFreshToken
                }
                localStorage.setItem('user', JSON.stringify(obj));
                this.router.navigate(['Menu']);
                // });
                this.isUserLoggedIn.next(true);
            } else {
                console.warn('failed');
                this.isLoginError.next(true);
            }
        })
    }




    MobileLogin(data: any) {
        return this._http.post(`${this.APIMYURL}app_login`, data, { observe: "response" }).subscribe((response: any) => {
            console.warn(response)
            if (response && response.body && response.body.status == true) {
                let obj = {
                    session_key: response.body.session_key,
                    reFreshToken: response.body.reFreshToken
                }
                localStorage.setItem('user', JSON.stringify(obj));
                console.log('#/')
                this.router.navigate(['/']);
                // });
                this.isUserLoggedIn.next(true);
            } else {
                console.warn('failed');
                this.isLoginError.next(true);
            }
        })
    }




    reloadUser() {
        if (localStorage.getItem('user')) {
            this.isUserLoggedIn.next(true);
            // this.router.navigate(['home']);
        }
    }

    tokenLocal: any
    getToken() {
        if (localStorage.getItem('user')) {
            let UserStore = localStorage.getItem('user');
            let UserData = UserStore && JSON.parse(UserStore);
            var bytes = JSON.parse(CryptoJS.AES.decrypt(UserData.reFreshToken, 'hiddenKey').toString(CryptoJS.enc.Utf8));
            this.tokenLocal = UserData.session_key
        }
        return this.tokenLocal

    }



    adminLogin(data: any) {
        return this._http.post(`${this.APIMYURL}auth_login`, data, { observe: "response" }).subscribe((response: any) => {
            console.warn(response)

            if (response && response.body && response.body.status == true) {
                let obj = {
                    token: response.body.token,
                }
                localStorage.setItem('uD1XOyRKsw85ZGm4Sr', JSON.stringify(obj));
                this.router.navigate(['Admin/Restaurants']);
                // });
                this.isAdminLoggedIn.next(true);
            } else {
                console.warn('failed');
                // this.isLoginError.next(true);
            }
        })
    }



    getUserByMobile(data: any) {
        return this._http.get(`${this.APIMYURL}get_user/${data}`)
    }

    saveAddress(data: any) {
        return this._http.post(`${this.APIMYURL}save_address`, data, { observe: "response" })
    }
    getUserAddress(data: any) {
        return this._http.get(`${this.APIMYURL}get_address_user/${data}`)
    }

    updateAddress(user: any, data: any) {
        return this._http.put(`${this.APIMYURL}update-address/${user}`, data, { observe: "response" })
    }




    // payUBuy() {
    //     return this._http.post<any>(`${this.APIMYURL2}/payu-payment`, { observe: "response" });
    // }
    payUBuy(data: any) {
        console.warn(data)
        return this._http.post(`https://bongateaubakeryncafe.in/payubiz_php7/index.php`, data, { observe: "response" });
    }










    headers2 = new HttpHeaders()
        .set('Content-Type', 'application/json')
        .set('app-key', '2xmbdf5e01pjusiqokcw64nh38r9ytgv')
        .set('app-secret', '617cde9e9fffa154ca8515f3bf692f79803261ab')
        .set('access-token', 'ba6f62f4121aa56b042f605a45bd91f45606c8bf')
        .set('Access-Control-Allow-Origin', '*')

    oredrsave(dataSend: any) {

        return this._http.post(`https://pponlineordercb.petpooja.com/save_order`, dataSend, { 'headers': this.headers2, observe: "response" })
    }


    getStoreStatus() {

        return this._http.get(`${this.APIMYURL}store_status_ui`, { observe: 'response' })
    }


    getItemsStockStatus() {

        return this._http.get(`${this.APIMYURL}item_stock`, { observe: 'response' })
    }

    getItemsStockStatus2(restID: any) {
        console.log(restID)
        return this._http.get(`${this.APIMYURL2}item_stock_on/${restID}`, { observe: 'response' })
    }



    getOrderHistory(phone: any) {

        return this._http.get(`${this.APIMYURL}get_ordersBy_Mobile/${phone}`, { observe: 'response' })
    }

    getSingleOrder(orderId: any) {
        return this._http.get(`${this.APIMYURL}get_single_orderById/${orderId}`, { observe: 'response' })
    }
    saveOrder(data: any) {
        console.log('save_order', data)
        return this._http.post(`${this.APIMYURL}save_order`, data, { observe: "response" })
    }


    get_restaurants() {
        return this._http.get(`${this.APIMYURL}get_restaurants`, { observe: 'response' })
    }


    get_restaurants_location(restID: any) {
        return this._http.get(`${this.APIMYURL}get_restaurants_location/${restID}`, { observe: 'response' })
    }





    // https://qle1yy2ydc.execute-api.ap-southeast-1.amazonaws.com/V1/update_order_status

    cancelOrder(data: any) {
        return this._http.post(`https://pponlineordercb.petpooja.com/update_order_status`, data, { 'headers': this.headers2, observe: "response" })
    }

    cancelOrderStatus(custId: any, data: any) {
        return this._http.put(`${this.APIMYURL}cancelFromUser/${custId}`, data, { observe: "response" })
    }


    book_Table(payload: any) {
        return this._http.post(`${this.APIMYURL}BookTable`, payload)
    }


    get_booked_tables(reg_mob: any) {
        return this._http.get(`${this.APIMYURL}get_table/${reg_mob}`, { observe: 'response' })
    }

    get_restaurant_by_id(restID: any) {
        return this._http.get(`${this.APIMYURL}get_restaurant_by_id/${restID}`, { observe: 'response' })
    }

    get_restaurant_by_RESTid(restID: any) {
        return this._http.get(`${this.APIMYURL}get_table_restID/${restID}`, { observe: 'response' })
    }

    update_booking(status: any, id: any) {
        return this._http.put(`${this.APIMYURL}update_booking/${id}`, status, { observe: "response" })
    }


    update_restaurant(payload: any, id: any) {
        return this._http.put(`${this.APIMYURL}update_restaurant/${id}`, payload, { observe: "response" })
    }

    add_restaurant(data: any) {
        return this._http.post(`${this.APIMYURL}post-restaurant`, data, { observe: "response" })
    }

    delete_restaurant(id: any) {
        return this._http.delete(`${this.APIMYURL}delete_restaurant/${id}`,)
    }




    Adminlogout() {


        let PermissionsLogout = confirm("Are u want to logout");
        if (PermissionsLogout == true) {
            if (localStorage.getItem('uD1XOyRKsw85ZGm4Sr')) {
                localStorage.removeItem('uD1XOyRKsw85ZGm4Sr')
                this.router.navigate(['Admin/admin-login']);
            }
        } else {

            // do nothing
        }
    }


    reloadAdmin() {
        if (localStorage.getItem('uD1XOyRKsw85ZGm4Sr')) {
            this.isUserLoggedIn.next(true);
            this.router.navigate(['Admin/']);
        }
    }




    // https://api.cpeel.net/app_login?mobile=8437303899

}
