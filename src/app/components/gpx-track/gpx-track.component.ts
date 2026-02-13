import {
  Component,
  AfterViewInit,
  OnDestroy,
  effect,
  signal,
  Input,
  ViewChild,
  ElementRef
} from '@angular/core';
import * as L from 'leaflet';
import { Chart } from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-map',
  imports: [DecimalPipe],
  templateUrl: './gpx-track.component.html',
  styleUrls: ['./gpx-track.component.scss']
})
export class GpxTrackComponent implements AfterViewInit, OnDestroy {

  @Input() traceUrl = signal<string>('');

  @ViewChild('elevationChart') chartCanvas!: ElementRef<HTMLCanvasElement>;

  private map?: L.Map;
  private trackLayer?: L.Polyline;
  private chart?: Chart;
  private hoverMarker?: L.CircleMarker;

  private mapContainer = signal<HTMLDivElement | null>(null);

  totalDistance = signal(0);
  totalGain = signal(0);
  totalLoss = signal(0);

  constructor(private http: HttpClient) {
    effect(() => {
      const url = this.traceUrl();
      const container = this.mapContainer();
      if (!container) return;

      if (!this.map) this.initMap(container);

      if (this.trackLayer) {
        this.map!.removeLayer(this.trackLayer);
        this.trackLayer = undefined;
      }

      if (url) {
        this.loadAndParseGPX(url);
      }
    });
  }

  ngAfterViewInit(): void {
    const container = document.querySelector<HTMLDivElement>('.map')!;
    this.mapContainer.set(container);
  }

  private initMap(container: HTMLDivElement) {
    this.map = L.map(container);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    this.hoverMarker = L.circleMarker([0, 0], {
      radius: 6,
      color: '#ff0000',
      fillColor: '#ff0000',
      fillOpacity: 1
    }).addTo(this.map);

    this.hoverMarker.setStyle({ opacity: 0, fillOpacity: 0 });
  }

  private loadAndParseGPX(url: string) {
    this.http.get('assets/' + url, { responseType: 'text' })
      .subscribe(xmlText => this.parseGPX(xmlText));
  }

  private parseGPX(xmlText: string) {

    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");

    const trkpts = Array.from(xml.querySelectorAll("trkpt"));

    if (!trkpts.length) return;

    const latlngs: L.LatLng[] = [];
    const elevations: number[] = [];
    const labels: number[] = [];

    let distance = 0;
    let gain = 0;
    let loss = 0;
    let prevLatLng: L.LatLng | null = null;
    let prevEle: number | null = null;

    for (const trkpt of trkpts) {

      const lat = parseFloat(trkpt.getAttribute("lat")!);
      const lng = parseFloat(trkpt.getAttribute("lon")!);
      const ele = parseFloat(trkpt.querySelector("ele")?.textContent ?? "0");

      const latlng = L.latLng(lat, lng);
      latlngs.push(latlng);

      if (prevLatLng) {
        const d = prevLatLng.distanceTo(latlng) / 1000;
        distance += d;

        if (prevEle !== null) {
          const delta = ele - prevEle;
          if (delta > 0) gain += delta;
          else loss += -delta;
        }
      }

      labels.push(parseFloat(distance.toFixed(2)));
      elevations.push(ele);

      prevLatLng = latlng;
      prevEle = ele;
    }

    // 🔹 Dessiner la trace
    this.trackLayer = L.polyline(latlngs, {
      color: '#ff3b30',
      weight: 4
    }).addTo(this.map!);

    this.map!.fitBounds(this.trackLayer.getBounds(), { padding: [20, 20] });

    // 🔹 Update stats
    this.totalDistance.set(distance);
    this.totalGain.set(gain);
    this.totalLoss.set(loss);

    // 🔹 Graph
    this.buildChart(labels, elevations, latlngs);
  }

  private buildChart(labels: number[], data: number[], latlngs: L.LatLng[]) {

    if (!this.chartCanvas?.nativeElement) return;

    if (this.chart) this.chart.destroy();

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data,
          fill: true,
          tension: 0.25,
          borderColor: '#ff3b30',
          backgroundColor: 'rgba(255,59,48,0.25)',
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { display: false },
          y: { display: true }
        },
        onHover: (_, activeEls) => {
          if (!activeEls.length) {
            this.hoverMarker?.setStyle({ opacity: 0, fillOpacity: 0 });
            return;
          }

          const idx = activeEls[0].index;
          const latlng = latlngs[idx];

          this.hoverMarker
            ?.setLatLng(latlng)
            .setStyle({ opacity: 1, fillOpacity: 1 });
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.trackLayer) this.map?.removeLayer(this.trackLayer);
    if (this.chart) this.chart.destroy();
    if (this.hoverMarker) this.map?.removeLayer(this.hoverMarker);
    this.map?.remove();
  }
}
