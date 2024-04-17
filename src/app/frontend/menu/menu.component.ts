import { Component, OnInit, signal } from '@angular/core';
import { ProductService } from '../api/product.service';
import { Router } from '@angular/router';
import { Statement } from '@angular/compiler';
import { map } from 'rxjs';
import * as CryptoJS from 'crypto-js';

import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,

} from '@angular/material/dialog';

import { NgZone } from '@angular/core'

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit {
  [x: string]: any;
  panelOpenState = false;
  show: boolean = false
  categories: any = [];
  items: any = [];
  attributes: any = [];
  loader: boolean = false;
  parent_category_id: any = 0;
  cartShow: boolean = false;
  CartOpened: boolean = false;
  CartCount: any = 0;
  total: any;
  totalPrice: any;
  singleCategories: any

  searchProducts: any;
  localCartItemsIds: any;
  ItemsIds: any;

  closeMSG: any;
  resturentStatus: any = [];
  openStatus: boolean = false;

  itemsStockStatusData: any;
  addonStockStatusData: any;
  menuId: any
  constructor(private Api: ProductService, private router: Router, public dialog: MatDialog, private zone: NgZone) {
    this.Api.getStoreStatus().subscribe((res: any) => {
      for (let s of res.body) {
        this.resturentStatus = JSON.parse(s.data);
      }
    });

    // console.log((2.5 * 380) / 100)
    let menuID: any = localStorage.getItem('restID')
    this.menuId = JSON.parse(menuID);
  }


  testSif = signal('test');
  ngOnInit(): void {


    var date = new Date();
    console.log(date.toLocaleString('en-GB'));


    var options = { hour12: false };
    console.log(date.toLocaleString('en-US', options));
    // this.Api.getItemsStockStatus().subscribe((response:any)=>{
    //   this.itemsStockStatusData =JSON.parse(response.body.data).itemID
    // })





    this.fatchMENU();
    this.IsCart();
    this.getTotal();
  }

  modalShow: boolean = false
  id: any;
  closeAddOn() {
    this.modalShow = false
    this.id = ''
  }
  expand(e: any) {
    // this.id = e
    if (this.id == e) {
      this.id = ''
      this.modalShow = false
      console.log(this.modalShow)
    } else {
      this.id = e
      this.modalShow = true
      console.log(this.modalShow)
    }
    console.log(e)

    // this.modalShow = !this.modalShow
  }

  CartItemData: any = [];
  cartAdons: any = []
  dubCart: any
  IsCart() {
    let itemsInCart: any = sessionStorage.getItem('OrderItem');
    this.CartItemData = JSON.parse(itemsInCart);

    let addon__Total: any
    if (this.CartItemData) {
      for (let c of this.CartItemData) {
        c.AddonItem.details.forEach((item: any) => {
          addon__Total = c.AddonItem.details.reduce(function (acc: any, item: any) {
            return acc + item.price;
          }, 0);

          // c.temp_addon__Total = addon__Total
          // console.log(c.temp_addon__Total)
        });
      }
    } else {

    }
    // let dataArray


    // console.log('this.CartItemData',this.CartItemData)



    if (!this.CartItemData) {
      this.CartCount = 0;
    } else {
      this.CartCount = JSON.parse(itemsInCart).length;
    }

    if (itemsInCart && this.CartCount) {
      this.cartShow = true;
    } else {
      this.cartShow = false;
    }
  }

  cartQtyDown(item: any) {
    // console.log(item)
    for (let i = 0; i < this.CartItemData.length; i++) {
      if (this.CartItemData[i].id === item.id) {

        if (item.quantity > 1) {
          this.CartItemData[i].quantity = item.quantity -= 1;
          
        // this.CartItemData[i].gst_total_tax_amount = this.CartItemData[i].quantity * this.CartItemData[i].gst_total_tax_amount

          this.CartItemData[i].final_price = this.CartItemData[i].test_price * this.CartItemData[i].quantity; // - this.CartItemData[i].item_discount

      //  this.CartItemData[i].gst_total_tax_amount = this.CartItemData[i].quantity * this.CartItemData[i].gst_total_tax_amount 

        }

       
      }
    }

    sessionStorage.setItem('OrderItem', JSON.stringify(this.CartItemData));

    this.IsCart();
    this.getTotal();
  }

  cartQtyUpdate(item: any) {

    for (let i = 0; i < this.CartItemData.length; i++) {
      if (this.CartItemData[i].id === item.id) {
        this.CartItemData[i].quantity = item.quantity += 1;
        // this.CartItemData[i].gst_total_tax_amount = this.CartItemData[i].gst_total_tax_amount * this.CartItemData[i].quantity


        this.CartItemData[i].final_price = this.CartItemData[i].test_price * this.CartItemData[i].quantity; //- this.CartItemData[i].item_discount

      }
    }
    sessionStorage.setItem('OrderItem', JSON.stringify(this.CartItemData));
    this.IsCart();
    this.getTotal();
  }

  getTotal() {
    if (this.CartItemData) {
      this.CartItemData.forEach((item: any) => {
        this.total = this.CartItemData.reduce(function (acc: any, item: any) {
          if (!item.addTotal) {

            return acc + item.final_price;
          } else {

            return acc + item.final_price// + item.addTotal;
          }
        }, 0);

        localStorage.setItem('subTotal', this.total)
      });
    }
  }

  getAddObn(e: any) {
    return this.addOn.filter((it: any) => it.addongroupid === e);
    // // // // console.log(result)
  }

  getUPdateStoreStatus() {
    this.Api.getStoreStatus().subscribe((res: any) => {
      for (let s of res.body) {
        this.resturentStatus = JSON.parse(s.data);
        // // // console.log(this.resturentStatus.reason);
        this.openStatus = this.resturentStatus.store_status;
      }
    });
  }
  taxesList: any;
  addOn: any;
  parentcategories: any;
  variations: any
  discountArray: any
  discountedIdItems: any
  fatchMENU() {
    this.loader = true;
    this.Api.fatchMenu2(this.menuId)
      .pipe(

        map((data: any) => {

          let SendData = data.body;

          console.warn(data.body)
          for (let d of data.body.items) {
            if (d.addon.length) {
              d.enable_addon = true
            } else {
              d.enable_addon = false
            }
          }

          let itemsInCart: any = sessionStorage.getItem('OrderItem');
          let HasPro = JSON.parse(itemsInCart);

          if (HasPro) {
            for (let a of HasPro) {
              SendData.items.filter((d: any) => {
                if (d.itemid == a.id) {
                  // if (d.itemid == a.id && !a.variation_id ) {
                  d.iscart = true;
                }
              });
            }
          }
          return SendData;
        })
      )
      .subscribe((res: any) => {
        // console.warn(res)
        this.searchProducts = res.items;
        this.getUPdateStoreStatus();

        for (let data of res.restaurants) {
          if (this.resturentStatus.restID === data.details.menusharingcode) {
            data.details.store_status = this.resturentStatus.store_status;
            data.details.reason = this.resturentStatus.reason;
            data.details.turn_on_time = this.resturentStatus.turn_on_time;
            if (this.resturentStatus.store_status == '0') {
              this.openStatus = false;
              this.closeMSG = this.resturentStatus.turn_on_time;
            } else {
              this.openStatus = true;
            }
          }
          // // // // console.log('restaurant',data.details.menusharingcode, this.resturentStatus.restID)
        }
        // // // // console.log(res.restaurants)

        if (res) {
          this.loader = false;
        }

        let Restaurant: any = {
          "details": {
            "res_name": res.restaurants[0].details.restaurantname,
            "address": res.restaurants[0].details.address,
            "contact_information": res.restaurants[0].details.contact,
            "restID": res.restaurants[0].details.menusharingcode,
          }
        }
        let JSON_Restaurant = JSON.stringify(Restaurant)
        sessionStorage.setItem('Restaurant', JSON_Restaurant)
        console.log('dssfdf', Restaurant)
        // this.resturentStatus
        this.addOn = res.addongroups;
        this.categories = res.categories;
        this.taxesList = res.taxes;
        this.attributes = res.attributes;
        this.parentcategories = res.parentcategories;
        this.discountArray = res.discounts;
        this.variations = res.variations
        // let discount = res.discounts;

        let taxes = res.taxes;

        console.log('element.tax_detail', this.taxesList)

        sessionStorage.setItem('taxes', JSON.stringify(this.taxesList));

        sessionStorage.setItem('discount', JSON.stringify(this.discountArray));


        this.singleCategories = this.categories.filter((cat: any) => {
          return cat.parent_category_id == 0
        })


        let findAllD: any

        if (this.discountArray) {
          findAllD = this.discountArray.filter((d: any) => {
            return d.discountapplicableon == 'All'
          })

          let coreDiscount = this.discountArray.filter((d: any) => {
            return d.discountapplicableon == "Items"
          })
        } else {

        }






        this.Api.getItemsStockStatus().subscribe((response: any) => {

          this.itemsStockStatusData = JSON.parse(response.body.data).itemID;
          console.log('stockstatus', this.itemsStockStatusData)

          if (JSON.parse(response.body.data).inStock === false && JSON.parse(response.body.data).type == 'item') {
            for (let i of this.itemsStockStatusData) {
              let stOf = res.items.filter((itms: any) => {
                return itms.itemid === i;
              });

              for (let s of stOf) {
                s.in_stock = '0';
                // // // console.log(s);
              }
            }
          } else {
            for (let i of this.itemsStockStatusData) {
              let stOf = res.items.filter((itms: any) => {
                return itms.itemid === i;
              });

              for (let s of stOf) {
                s.in_stock = '1';
                // // // console.log(s);
              }
            }
          }










          if (JSON.parse(response.body.data).inStock === false && JSON.parse(response.body.data).type == 'addon') {
            this.addonStockStatusData = JSON.parse(response.body.data).itemID;
            // console.log('addon', this.addonStockStatusData, this.addOn.addongroupitems)


            for (let i of this.itemsStockStatusData) {


              for (let a of this.addOn) {
                for (let b of a.addongroupitems) {

                  // console.log(b)
                  let sAtOf = a.addongroupitems.filter((itms: any) => {
                    return itms.addonitemid == i;
                  });

                  for (let adItm of sAtOf) {
                    adItm.in_stock = false
                  }
                  // console.log( 'sd',sAtOf)
                }
              }

            }
          } else {

          }
        });

        // for (let i of this.discountedIdItems) {
        //   let stOf = res.items.filter((itms: any) => {
        //     return itms.itemid == i.value;
        //   });
        // }













        res.items.forEach((element: any) => {

          // if(findAllD[0].discount){

          //   element.item_discount = findAllD[0].discount
          // } else {
          //   element.item_discount = '0'

          // }


          //   element.tax_detail = this.taxesList.filter(
          //     (it: any) => it.item_tax === element.taxid
          //   );

          //  element.addon.forEach((el: any) => {
          //     el.full = this.addOn.filter(
          //       (it: any) => it.addongroupid === el.addon_group_id
          //     );

          //     for (let t of el.full) {
          //       el.name = t.addongroup_name;
          //       el.addongroupitems = this.getAddOnName(el.addon_group_id);
          //     }
          //   });


        });





        for (let element of res.items) {

          let numbersObject = element.item_tax
          console.warn(element.item_tax)

          let numbersArray = numbersObject.split(',')

            .map((num: any, index: any) => ({ [`id`]: parseInt(num) }));

          element.tax_detail = []

          let tdetail

          for (let nt of numbersArray) {
            tdetail = this.taxesList.filter(
              (it: any) => it.taxid == nt.id
            );

            element.tax_detail.push(...tdetail)
            console.log('this.taxesList', element.tax_detail)
          }


          element.addon.forEach((el: any) => {
            el.full = this.addOn.filter(
              (it: any) => it.addongroupid === el.addon_group_id
            );

            for (let t of el.full) {
              el.name = t.addongroup_name;
              el.addongroupitems = this.getAddOnName(el.addon_group_id);
            }
          });



        }


        this.items = res.items;


        // console.log(this.items);
      });
  }


  newCats: any;
  getIdCat(id: any) {
    this.newCats = this.categories.filter((itm: any) => {
      return itm.parent_category_id === id;
    });

    // // // console.log(this.categories);
  }

  getAddOnName(id: any) {
    let ADON_GRP = this.addOn.filter((it: any) => it.addongroupid === id);
    for (let n of ADON_GRP) {
      return n;
    }
  }

  notFound: boolean = false;
  filterByCategory(c: any) {
    this.loader = true;
    this.notFound = false;
    this.Api.fatchMenu2(this.menuId)
      .subscribe((res: any) => {
        console.log('addongroupitems', res)
        if (res) {
          this.items = this.searchProducts.filter(
            (t: { item_categoryid: any }) => t.item_categoryid == c
          );
          if (this.items.length) {
            this.notFound = false;
          } else {
            this.notFound = true;;
          }
          this.loader = false;
        }
      });
  }




  filterByAttribute(a: any) {
    this.loader = true;
    this.notFound = false;

    // this.Api.fatchMenu2(this.menuId)
    //   .pipe(
    //     map((data: any) => {
    //       let SendData = data.body

    //       let itemsInCart: any = sessionStorage.getItem('OrderItem');
    //       let HasPro = JSON.parse(itemsInCart);
    //       if (HasPro) {
    //         for (let a of HasPro) {
    //           SendData.items.filter((d: any) => {
    //             if (d.itemid == a.id) {
    //               d.iscart = true;
    //             }
    //           });
    //         }
    //       }

    //       return SendData;
    //     })
    //   )
    //   .subscribe((res: any) => {
    //     if (res) {
    //       this.items = res.items.filter(
    //         (t: { item_attributeid: any }) => t.item_attributeid == a
    //       );
    //       if (this.items.length) {
    //         this.notFound = false;
    //       } else {
    //         this.notFound = true;
    //       }
    //       this.loader = false;
    //     }
    //   });

    this.Api.fatchMenu2(this.menuId)
      .pipe(

        map((data: any) => {

          let SendData = data.body;
          for (let d of data.body.items) {
            if (d.addon.length) {
              d.enable_addon = true
            } else {
              d.enable_addon = false
            }
          }

          let itemsInCart: any = sessionStorage.getItem('OrderItem');
          let HasPro = JSON.parse(itemsInCart);

          if (HasPro) {
            for (let a of HasPro) {
              SendData.items.filter((d: any) => {
                if (d.itemid == a.id) {
                  // if (d.itemid == a.id && !a.variation_id ) {
                  d.iscart = true;
                }
              });
            }
          }
          return SendData;
        })
      )
      .subscribe((res: any) => {
        // console.warn(res)
        this.searchProducts = res.items;
        this.getUPdateStoreStatus();

        for (let data of res.restaurants) {
          if (this.resturentStatus.restID === data.details.menusharingcode) {
            data.details.store_status = this.resturentStatus.store_status;
            data.details.reason = this.resturentStatus.reason;
            data.details.turn_on_time = this.resturentStatus.turn_on_time;
            if (this.resturentStatus.store_status == '0') {
              this.openStatus = false;
              this.closeMSG = this.resturentStatus.turn_on_time;
            } else {
              this.openStatus = true;
            }
          }
          // // // // console.log('restaurant',data.details.menusharingcode, this.resturentStatus.restID)
        }
        // // // // console.log(res.restaurants)

        if (res) {
          this.loader = false;
        }
        // // // // console.log('dssfdf',res.categories)
        // this.resturentStatus
        this.addOn = res.addongroups;
        this.categories = res.categories;
        this.taxesList = res.taxes;
        this.attributes = res.attributes;
        this.parentcategories = res.parentcategories;
        this.discountArray = res.discounts;
        this.variations = res.variations



        let taxes = res.taxes;

        sessionStorage.setItem('taxes', JSON.stringify(this.taxesList));



        this.singleCategories = this.categories.filter((cat: any) => {
          return cat.parent_category_id == 0
        })



        let findAllD: any

        if (this.discountArray! == '') {
          console.log('yess')
          findAllD = this.discountArray.filter((d: any) => {
            return d.discountapplicableon == 'All'
          })
          sessionStorage.setItem('discount', JSON.stringify(findAllD));
          let coreDiscount = this.discountArray.filter((d: any) => {
            return d.discountapplicableon == "Items"
          })
        } else {

          console.log('yesnoes')
          findAllD = [
            {
              "discount": "0",
            },

          ]
          sessionStorage.setItem('discount', JSON.stringify(findAllD));
        }



        // if (findAllD) {
        //   sessionStorage.setItem('discount', JSON.stringify(findAllD));
        // } else {

        // }


        // for (let i of coreDiscount) {
        //   console.log('findAllD', i.discountcategoryitemids)
        //   const numbersArray = i.discountcategoryitemids.split(',').map(Number);


        //   this.discountedIdItems = numbersArray.map((number: any, index: any) => ({
        //     name: `itemID`,
        //     value: number,
        //     discount: i.discount
        //   }));

        // }




        // sessionStorage.setItem('discount', JSON.stringify(this.discountArray));

        this.Api.getItemsStockStatus().subscribe((response: any) => {
          console.log('stockstatus', JSON.parse(response.body.data))
          this.itemsStockStatusData = JSON.parse(response.body.data).itemID;

          if (JSON.parse(response.body.data).inStock === false) {
            for (let i of this.itemsStockStatusData) {
              let stOf = res.items.filter((itms: any) => {
                return itms.itemid === i;
              });

              for (let s of stOf) {
                s.in_stock = '0';
                // // // console.log(s);
              }
            }
          } else {
            for (let i of this.itemsStockStatusData) {
              let stOf = res.items.filter((itms: any) => {
                return itms.itemid === i;
              });

              for (let s of stOf) {
                s.in_stock = '1';
                // // // console.log(s);
              }
            }
          }
        });







        res.items = res.items.filter(
          (t: { item_attributeid: any }) => t.item_attributeid == a
        );
        if (this.items.length) {
          this.notFound = false;
        } else {
          this.notFound = true;
        }




        res.items.forEach((element: any) => {
          element.tax_detail = this.taxesList.filter(
            (it: any) => it.item_tax === element.taxid
          );

          element.addon.forEach((el: any) => {
            el.full = this.addOn.filter(
              (it: any) => it.addongroupid === el.addon_group_id
            );

            for (let t of el.full) {
              el.name = t.addongroup_name;
              el.addongroupitems = this.getAddOnName(el.addon_group_id);
            }
          });





        });


        this.items = res.items;


        console.log(this.items);
      });

























  }

  cartToggle() {
    this.CartOpened = !this.CartOpened;
  }

  itemCart: any = [];
  cartObj: any = {};
  AlreadyCart: any;
  match: any;
  matchItem: any;

  dataSend: any = {
    app_key: '2xmbdf5e01pjusiqokcw64nh38r9ytgv',
    app_secret: '617cde9e9fffa154ca8515f3bf692f79803261ab',
    access_token: 'ba6f62f4121aa56b042f605a45bd91f45606c8bf',
    orderinfo: {
      OrderInfo: {
        Restaurant: {
          details: {
            res_name: 'Dynamite Lounge',
            address: '2nd Floor, Reliance Mall, Nr.Akshar Chowk',
            contact_information: '9427846660',
            restID: 'okz15g4x',
          },
        },
        Customer: {
          details: {
            email: 'xxx@yahoo.com',
            name: 'Advait',
            address: '2, Amin Society, Naranpura',
            phone: '9090909090',
            latitude: '34.11752681212772',
            longitude: '74.72949172653219',
          },
        },
        Order: {
          details: {
            orderID: 'A-2',
            preorder_date: '2022-01-01',
            preorder_time: '15:50:00',
            service_charge: '',
            sc_tax_amount: '',
            delivery_charges: '',
            dc_tax_amount: '',
            dc_gst_details: [
              {
                gst_liable: 'vendor',
                amount: '',
              },
              {
                gst_liable: 'restaurant',
                amount: '',
              },
            ],
            packing_charges: '',
            pc_tax_amount: '',
            pc_gst_details: [
              {
                gst_liable: 'vendor',
                amount: '0',
              },
              {
                gst_liable: 'restaurant',
                amount: '0',
              },
            ],
            order_type: 'H',
            ondc_bap: 'buyerAppName',
            advanced_order: 'N',
            payment_type: 'COD',
            table_no: '',
            no_of_persons: '0',
            discount_total: '',
            tax_total: '',
            discount_type: 'F',
            total: '',
            description: '',
            created_on: '',
            enable_delivery: 1,
            min_prep_time: 20,
            callback_url: '',
          },
        },
        OrderItem: {
          details: [],
        },
        Tax: {
          details: [
            {
              id: '20375',
              title: 'SGST',
              type: 'P',
              price: '2.5',
              tax: '5.9',
              restaurant_liable_amt: '0.00',
            },
          ],
        },
        Discount: {
          details: [
            {
              id: '',
              title: '',
              type: 'F',
              price: '',
            },
          ],
        },
      },
      udid: '',
      device_type: 'Web',
    },
  };



  arrayId: any = []


  finditem: any
  tempCart: any = {}
  getQty(evt_: any, e: any, addonitemid: any, addon_group_id: any, quantity: any, addonitem_price: any, addonitem_name: any, groupName: any) {

    this.tempCart = {
      "id": addonitemid,
      "name": addonitem_name,
      "group_name": groupName,
      "price": (parseFloat(addonitem_price) * evt_.target.value).toString(),
      "group_id": addon_group_id,
      "quantity": evt_.target.value,
    }

    // console.log('sd', this.tempCart)
  }

  add_addOn(e: any) {
    this.arrayId.push(this.tempCart)
    e.AddonItem = this.arrayId


  }

  getVariation(item: any, e: any) {
    item.price = e.price
    item.variation_name = e.name
    item.variation_id = e.variationid
  }

  not_selected: boolean = false
  add_cart(e: any) {
    this.tempCart = {}
    this.arrayId = []
    if (e.price == '0') {
      console.log('price not av')
      this.not_selected = true
    } else {
      this.not_selected = false
      let itemsInCart: any = sessionStorage.getItem('OrderItem');
      this.AlreadyCart = JSON.parse(itemsInCart);
      if (e.AddonItem) {

        let addon__Total: any
        e.AddonItem.forEach((item: any) => {
          addon__Total = e.AddonItem.reduce(function (acc: any, item: any) {
            return acc + item.price;
          }, 0);

          this.cartObj.price = addon__Total + parseFloat(e.price) - parseFloat(e.item_discount)
          this.cartObj.temp_addon__Total = addon__Total
        });





        this.cartObj = {
          addon: e.addon,
          id: e.itemid,
          name: e.itemname,
          gst_liability: 'restaurant',
          item_tax: [],
          item_discount: '', //parseFloat(e.item_discount),
          price: addon__Total + parseFloat(e.price),
          final_price: '',//(parseFloat(e.price) - parseFloat(e.item_discount)),
          quantity: 1,
          description: '',
          variation_name: e.variation_name,
          variation_id: e.variation_id,
          gst_total_tax_amount: '',
          AddonItem: {
            details: [...e.AddonItem],
          },



        };

        if (!e.item_discount) {
          this.cartObj.item_discount = '0'
          this.cartObj.final_price = parseFloat(e.price)
        } else {
          this.cartObj.item_discount = parseFloat(e.item_discount)
          this.cartObj.final_price = (parseFloat(e.price) - parseFloat(e.item_discount))
        }
        // this.cartObj.final_price = this.cartObj.price +

        // console.warn(this.cartObj)


      } else {
        this.cartObj = {
          addon: e.addon,
          id: e.itemid,
          name: e.itemname,
          gst_liability: 'restaurant',
          item_tax: [
            // ...e.tax_detail
          ],
          item_discount: '',//parseFloat(e.item_discount),
          price: parseFloat(e.price),
          final_price: (parseFloat(e.price) - parseFloat(e.item_discount)),
          quantity: 1,
          description: '',
          variation_name: e.variation_name,
          variation_id: e.variation_id,
          gst_total_tax_amount: '',
          AddonItem: {
            details: [],
          },
        }

        if (!e.item_discount) {
          this.cartObj.item_discount = '0'
          this.cartObj.final_price = parseFloat(e.price)
        } else {
          this.cartObj.item_discount = parseFloat(e.item_discount)
          this.cartObj.final_price = (parseFloat(e.price) - parseFloat(e.item_discount))
        }


      }
      let AddonItem: any = {
        ...e.AddonItem
      }



      // console.warn(AddonItem[0])

      if (!AddonItem[0]) {
        this.cartObj.price = parseFloat(e.price).toString()

        if (!e.item_discount) {
          this.cartObj.item_discount = '0'
          this.cartObj.final_price = parseFloat(e.price)
          this.cartObj.test_price = parseFloat(e.price)
        } else {
          this.cartObj.item_discount = parseFloat(e.item_discount)
          this.cartObj.final_price = (parseFloat(e.price) - parseFloat(e.item_discount))
          this.cartObj.test_price = (parseFloat(e.price) - parseFloat(e.item_discount))
        }

        //   this.cartObj.final_price = (parseFloat(e.price) - parseFloat(e.item_discount))// + _TotalAdd
        // this.cartObj.test_price = (parseFloat(e.price) - parseFloat(e.item_discount)) //+ _TotalAdd

      } else {

        let TotalAdd = 0
        this.cartObj.AddonItem.details.forEach((item: any) => {
          TotalAdd = this.cartObj.AddonItem.details.reduce(function (acc: any, item: any) {
            return acc + parseFloat(item.price);
          }, 0);
          console.log(TotalAdd)
          this.cartObj.price = (parseFloat(e.price) + TotalAdd).toString(),
            this.cartObj.final_price = parseFloat(e.price) + TotalAdd - parseFloat(e.item_discount)
          this.cartObj.test_price = parseFloat(e.price) + TotalAdd - parseFloat(e.item_discount)
          // this.cartObj.price = (parseFloat(e.price) + TotalAdd).toString(),
          //   this.cartObj.final_price = parseFloat(e.price) + TotalAdd + _TotalAdd - parseFloat(e.item_discount)
          // this.cartObj.test_price = parseFloat(e.price) + TotalAdd + _TotalAdd - parseFloat(e.item_discount)
        });
      }




      let ConTax: any

      if (e.tax_detail) {

        for (let t of e.tax_detail) {

          console.log(t)
          ConTax = {
            "id": t.taxid,
            "name": t.taxname,
            "amount": ((t.tax * this.cartObj.final_price) / 100).toString()
          }

          this.cartObj.item_tax.push(ConTax)
        }
      }

      let _TotalAdd: any

      if (this.cartObj.item_tax == '') {
        console.warn("khali")
        this.cartObj.gst_total_tax_amount = '0'
      } else {

        this.cartObj.item_tax.forEach((element: any) => {
          _TotalAdd = this.cartObj.item_tax.reduce(function (acc: any, item: any) {
            return acc + parseFloat(element.amount);
          }, 0);
        });
        this.cartObj.gst_total_tax_amount = _TotalAdd * this.cartObj.quantity

      }




      // if (e.ignore_taxes == '0') {
      //   console.warn('0 - consider item for tax calculation,')
      //   this.cartObj.gst_total_tax_amount = _TotalAdd
      // } else {
      //   console.warn('1 - ignore item for tax calculation')
      //   this.cartObj.gst_total_tax_amount = ''
      // }


      // if (!AddonItem[0]) {
      //   this.cartObj.price = parseFloat(e.price).toString(),
      //     this.cartObj.final_price = (parseFloat(e.price) - parseFloat(e.item_discount)) + _TotalAdd 
      //   this.cartObj.test_price = (parseFloat(e.price) - parseFloat(e.item_discount)) + _TotalAdd

      // } else {

      //   let TotalAdd = 0
      //   this.cartObj.AddonItem.details.forEach((item: any) => {
      //     TotalAdd = this.cartObj.AddonItem.details.reduce(function (acc: any, item: any) {
      //       return acc + parseFloat(item.quantity) * parseFloat(item.price);
      //     }, 0);
      //     this.cartObj.price = (parseFloat(e.price) + TotalAdd).toString(),
      //     this.cartObj.final_price = parseFloat(e.price) + TotalAdd + _TotalAdd - parseFloat(e.item_discount)
      //     this.cartObj.test_price = parseFloat(e.price) + TotalAdd + _TotalAdd - parseFloat(e.item_discount)
      //   });
      // }




      this.dataSend.orderinfo.OrderInfo.OrderItem.details.push(this.cartObj);


      if (this.AlreadyCart) {
        for (var i = 0; i < this.AlreadyCart.length; i++) {
          this.match = parseFloat(e.itemid) === parseFloat(this.AlreadyCart[i].id);
          this.matchItem = this.AlreadyCart[i];
        }

        if (!this.match) {
          // // // // console.log('1')
          this.itemCart = JSON.parse(itemsInCart);
          this.itemCart.push(this.cartObj);
          sessionStorage.setItem('OrderItem', JSON.stringify(this.itemCart));
          this.IsCart();
          this.getTotal();
        } else {
          // // // // console.log('2')
          this.matchItem.quantity = this.matchItem.quantity += 1;

          sessionStorage.setItem('OrderItem', JSON.stringify(this.AlreadyCart));
          this.IsCart();
          this.getTotal();
        }
      } else {
        // // // // console.log('3')

        this.itemCart.push(this.cartObj);
        sessionStorage.setItem('OrderItem', JSON.stringify(this.itemCart));
        this.IsCart();
        this.getTotal();
      }

      // this.itemCart.push(this.cartObj);
      // sessionStorage.setItem('OrderItem', JSON.stringify(this.itemCart));
      // this.IsCart();
      // this.getTotal();



      this.fatchMENU();
      this.closeAddOn()
    }

  }

  leftBar: boolean = false;

  mobileFilter() {
    this.leftBar = !this.leftBar;
  }

  removeCartItem(id: any, index: any) {
    this.CartItemData.splice(index, 1);
    sessionStorage.setItem('OrderItem', JSON.stringify(this.CartItemData));
    this.IsCart();
    this.getTotal();

    let itemsInCart_ = sessionStorage.getItem('OrderItem');
    if (itemsInCart_?.length == 2) {
      // sessionStorage.removeItem('OrderItem')
      sessionStorage.clear();
      this.cartObj = {};
      this.CartItemData = [];
      window.location.replace('/#/Menu');
    }
    this.fatchMENU();

    this.IsCart();
  }

  searchKey(e: any) {
    let searchText: any = e;

    if (searchText == '') {
      this.fatchMENU();
      this.notFound = false;
    } else {
      this.items = this.searchProducts.filter((itemSearch: any) => {
        return (
          itemSearch.itemname.toLowerCase().indexOf(searchText.toLowerCase()) >
          -1
        );
      });
      if (this.items == '') {
        this.notFound = true;
      } else {
        this.notFound = false;
      }
    }
  }

  tokenLocal: any;

  redirect() {
    if (localStorage.getItem('user')) {
      let UserStore = localStorage.getItem('user');
      let UserData = UserStore && JSON.parse(UserStore);
      var bytes = JSON.parse(
        CryptoJS.AES.decrypt(UserData.reFreshToken, 'hiddenKey').toString(
          CryptoJS.enc.Utf8
        )
      );
      this.router.navigate(['/checkout']);
    } else {
      // // // console.log('no');
      this.router.navigate(['/login']);
    }
  }
}



