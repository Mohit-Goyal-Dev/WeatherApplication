import { ICityWeather } from "./../models/IWeatherData.interface";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { IWeatherRawData } from "../models/IWeatherRawData.interface";
import { ISearchResult, IWeatherData } from "../models/IWeatherData.interface";

@Injectable({
  providedIn: "root",
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  baseUrl = "https://cors-anywhere.herokuapp.com/https://www.metaweather.com";

  searchLocation(term): Observable<ISearchResult[]> {
    let searchParams = new HttpParams();
    searchParams = searchParams.append("query", term);

    return this.http
      .get(this.baseUrl + "/api/location/search/", { params: searchParams })
      .pipe(
        map((response) => {
          return <ISearchResult[]>response;
        })
      );
  }

  getCityDetails(woeid): Observable<IWeatherData> {
    /*
      woeid is the city id(number).
      you can use below sample url to fetch the city weather details
      sample url : baseUrl/api/location/111111
    */
    return this.http
      .get<IWeatherRawData>(this.baseUrl + "/api/location/" + woeid)
      .pipe(
        map((response) => {
          return this.transformRawData(response);
        })
      );
  }

  transformRawData(rawData: IWeatherRawData) {
    const transformedWeather: Array<ICityWeather> = [];

    rawData.consolidated_weather.forEach(function (obj) {
      const date = obj.applicable_date;
      const temperature = obj.the_temp;
      const weather_name = obj.weather_state_name;
      const weather_image = `https://www.metaweather.com/static/img/weather/${obj.weather_state_abbr}.svg`;

      transformedWeather.push({
        date: date,
        temperature: temperature,
        weather_name: weather_name,
        weather_image: weather_image,
      } as ICityWeather);
    });

    return {
      city: rawData.title,
      country: rawData.parent.title,
      weather: transformedWeather,
    };
  }
}
