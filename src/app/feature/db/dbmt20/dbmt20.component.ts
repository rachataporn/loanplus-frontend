import { Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from "@angular/common/http";
import { FormGroup, FormBuilder } from '@angular/forms';
import { Dbmt20Service } from '@app/feature/db/dbmt20/dbmt20.service';
import { Page, ModalService } from '@app/shared';
import { AlertService, LangService, SaveDataService } from '@app/core';
import { finalize } from 'rxjs/internal/operators/finalize';
// import * as Highcharts from 'highcharts/highmaps';
// import worldMap from '@highcharts/map-collection/countries/th/th-all.geo.json';
import * as L from "leaflet";
import countries from './dbmt20.map.json';
import { FooterRowOutlet } from '@angular/cdk/table';

@Component({
  selector: 'app-dbmt20',
  templateUrl: './dbmt20.component.html',
  styleUrls: ['./dbmt20.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class Dbmt20Component implements OnInit {

  provinceList = [];

  userTrackingList = [];
  
  page = new Page();
  searchForm: FormGroup;
  statusPage: boolean;
  beforeSearch = '';
  nameForm: FormGroup;


  myfrugalmap: any;
  map;
  states;
  statesProvince;
  savedGeojson = L.geoJSON();
  saveProvincedGeojson = L.geoJSON();
  countriesJson: any;
  saveInfo: any;
  saveLegend: any;
  
  constructor(
    public router: Router,
    public modal: ModalService,
    public fb: FormBuilder,
    public dbmt20Service: Dbmt20Service,
    public lang: LangService,
    public saveData: SaveDataService,
    public as: AlertService,
    private http: HttpClient
    
  ) {
    this.createForm();

  }

  createForm() {
    this.nameForm = this.fb.group({
      ProvinceName: [null],
      DateStart: null,
      DateEnd: null,
      Detail: null,
      page: new Page(),
      InputSearch: null,
      flagSearch: true,
      beforeSearch: null,
    });

    //this.nameForm.valueChanges.subscribe(() => this.page.index = 0);
  }

  getStateShapes() {
    return this.http.disableApiPrefix().get('assets/json/dbmt20.json');
  }

  getProvinceShapes() {
    return this.http.disableApiPrefix().get('assets/json/dbmt20.province.json');
  }

  private getJson(){

    if (this.savedGeojson) this.map.removeLayer(this.savedGeojson);

    let body = { Province: this.nameForm.controls['ProvinceName'].value, DateStart: this.nameForm.controls['DateStart'].value, DateEnd: this.nameForm.controls['DateEnd'].value }

    this.dbmt20Service.searchPcmUserTrackingDisplay(body)
    .subscribe(
      (res: any) => {

        for (let i = 0; i < res.length; i++) {
          if(null != res[i].subDistrictEn){

            var tambon = this.countriesJson.features.find(item => (item.properties.tam_en).replace(/\s/g, "").toLocaleLowerCase() == res[i].subDistrictEn.replace(/\s/g, "").toLocaleLowerCase());

            if(tambon){
              tambon["properties"].device = res[i].count;
            }
            
          }
        }

        this.states = this.countriesJson;
        this.initStatesLayer();
    });
    
  }

  private initMap(): void {
    this.map = L.map('frugalmap', {
      center: [ 39.8282, -98.5795 ],
      zoom: 3
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 11,
      minZoom: 5,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  private highlightFeature(e) {
    const layer = e.target;
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera12 && !L.Browser.edge) {
      layer.bringToFront();
    }

    this.saveInfo.update(layer.feature.properties);
  }

  public getColor(d) {
      return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 1   ? '#FED976' :
                      'white';
  }

  private resetFeature(e) {
    const layer = e.target;

    layer.setStyle({
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
      fillColor: this.getColor(layer.feature.properties.device)
    });

    this.saveInfo.update();
  }

  private zoomToFeature(e) {
    this.map.fitBounds(e.target.getBounds());
  }

  private initStatesLayer() {
    this.savedGeojson = L.geoJSON(this.states, {
      style: (feature) => ({
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: this.getColor(feature.properties.device)
      }),
      onEachFeature: (feature, layer) => (
        layer.on({
          mouseover: (e) => (this.highlightFeature(e)),
          mouseout: (e) => (this.resetFeature(e)),
          //click: (e) => (this.zoomToFeature(e)),
        }),
        layer.bindPopup('<b>ตำบล/แขวง : ' + feature.properties.tam_th + '</b>')
      )
    });


    // this.saveProvincedGeojson = L.geoJSON(this.statesProvince, {
    //   style: (feature) => ({
    //     weight: 2,
    //     opacity: 1,
    //     color: 'red',
    //     dashArray: '3',
    //     fillOpacity: 0.7
    //   })
    // });


    this.map.addLayer(this.savedGeojson);
    //this.map.addLayer(this.saveProvincedGeojson);
    this.savedGeojson.bringToBack();

    this.map.fitBounds(this.savedGeojson.getBounds());

    this.legendBottomRight();

    this.infoTopRight();

  }

  private legendBottomRight(){

    if(this.saveLegend) this.saveLegend.remove();

    this.saveLegend = new L.Control({position: 'bottomright'});

    var grades = [0, 1, 20, 50, 100, 200, 500, 1000];
    var gradesColor = "";

    for (var i = 0; i < grades.length; i++) {
      gradesColor += '<i style="background:' + this.getColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    this.saveLegend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend');

        div.innerHTML = gradesColor;

        return div;
    };

    this.saveLegend.addTo(this.map);
  }


  private infoTopRight(){

    if(this.saveInfo) this.saveInfo.remove();

    this.saveInfo = new L.Control();

    this.saveInfo.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    this.saveInfo.update = function (props) {
      this._div.innerHTML = '<h4>รายละเอียด</h4>' +  (props ?
        '<b>จังหวัด : ' + props.pro_th + '</b><br />'+'<b>อำเภอ/เขต : ' + props.amp_th + '</b><br /><b>ตำบล/แขวง : ' + props.tam_th + ' </b><br /><b>จำนวนผู้ใช้งาน (อุปกรณ์) : '+ props.device + '</b>': '');
        //this._div.innerHTML = (props ? '<h4>'+props.pro_th+'</h4><br /><b>' + props.amp_th + '</b><br />' + props.tam_th : '');
    };

    this.saveInfo.addTo(this.map);
  }
  async ngOnInit() {

    await this.getDetailSelectProvince();
    this.initMap();
    this.onSearch();
    

  }

  getDetailSelectProvince() {
    var arrayDataProvince = []
    let body = {};
    this.dbmt20Service.getProvince(body).subscribe(
      (res) => {
        //console.log(res)
        if (res.Rows.length != 0) {
          for (let i = 0; i < res.Rows.length; i++) {
            let data = {
              TextEng: res.Rows[i].province_en,
              TextTha: res.Rows[i].province_local,
              Value: res.Rows[i].province_en
            }
            arrayDataProvince.push(data)
          }

          this.provinceList = arrayDataProvince;
        }

      }
    );
  }


  onTableEvent(event) {
    
    this.page = event;
    this.statusPage = false;
    this.onSearch();
  }

  search() {
    this.page = new Page();
    this.statusPage = true;
    this.onSearch();
  }

  onSearch() {
  
    this.getStateShapes().subscribe(states => {
      
      this.countriesJson = states;
      
      this.getJson();

      // this.getProvinceShapes().subscribe(province => {
      //   this.statesProvince = province;
      // });
    });

    
    //let body = { Province: this.nameForm.controls['ProvinceName'].value, DateStart: this.nameForm.controls['DateStart'].value, DateEnd: this.nameForm.controls['DateEnd'].value,Sort: this.page.sort,Index: this.page.index,Size: this.page.size }
    let body = { Province: this.nameForm.controls['ProvinceName'].value, DateStart: this.nameForm.controls['DateStart'].value, DateEnd: this.nameForm.controls['DateEnd'].value,Index: this.page.index,Size: this.page.size }
    this.dbmt20Service.searchPcmUserTracking(body)
      .pipe(finalize(() => {
        if (this.statusPage) {
          this.beforeSearch = this.nameForm.value;
          this.nameForm.controls.beforeSearch.setValue(this.beforeSearch);
        }
      }))
      .subscribe(
        (res: any) => {
          console.log(" chow res : ",res);
          this.userTrackingList = res.Rows;
          this.page.totalElements = res.Rows.length ? res.Total : 0;
        });

    // this.dbmt20Service.searchPcmUserTracking(this.statusPage ? (this.searchForm.value) : this.beforeSearch, this.page)
    //   .pipe(finalize(() => {
    //     if (this.statusPage) {
    //       this.beforeSearch = this.searchForm.value;
    //       this.searchForm.controls.beforeSearch.reset();
    //       this.searchForm.controls.page.setValue(this.page);
    //       this.searchForm.controls.beforeSearch.setValue(this.searchForm.value);
    //     }
    //   }))
    //   .subscribe(
    //     (res: any) => {
    //       this.faqList = res.Rows;
    //       this.page.totalElements = res.Total;
    //     });
  }


}
