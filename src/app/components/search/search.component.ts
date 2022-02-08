import { WeatherService } from "./../../services/weather.service";
import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from "@angular/core";
import { ISearchResult } from "../../models/IWeatherData.interface";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"],
})
export class SearchComponent implements OnInit {
  @ViewChild("searchInput") searchInput;
  searchResults: ISearchResult[];
  @Output() selectedCity = new EventEmitter();

  constructor(private weatherService: WeatherService) {}
  ngOnInit() {}

  search(term) {
    // console.log(term);
    this.searchResults = null;
    if (term !== null && term !== "") {
      this.weatherService.searchLocation(term).subscribe((response) => {
        this.searchResults = response;
      });
    }
  }

  selectedLocation(cityDetails: ISearchResult) {
    this.searchInput.nativeElement.value = "";
    this.searchResults = null;
    console.log(cityDetails.woeid);
    this.selectedCity.emit(cityDetails.woeid);
  }
}
