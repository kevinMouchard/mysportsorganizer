import {
  Component,
  AfterViewInit,
  OnDestroy,
  effect,
  signal,
  Input,
  ViewChild,
  ElementRef,
  NgZone
} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-gpx';
import { Chart } from 'chart.js/auto';
import { HttpClient } from '@angular/common/http';
import {DecimalPipe} from '@angular/common';

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
  private gpxLayer?: any;
  private chart?: Chart;
  private hoverMarker?: L.Marker;

  private mapContainer = signal<HTMLDivElement | null>(null);

  // 🔹 signals pour stats
  totalDistance = signal(0);
  totalGain = signal(0);
  totalLoss = signal(0);

  constructor(private http: HttpClient) {
    effect(() => {
      const url = this.traceUrl();
      const container = this.mapContainer();
      if (!container) return;

      if (!this.map) this.initMap(container);

      if (this.gpxLayer) {
        this.map!.removeLayer(this.gpxLayer);
        this.gpxLayer = undefined;
      }

      if (url) {
        this.loadGPX(url);
      }
    });
  }

  ngAfterViewInit(): void {
    const container = document.querySelector<HTMLDivElement>('.map')!;
    this.mapContainer.set(container);
  }

  private initMap(container: HTMLDivElement) {
    this.map = L.map(container).setView([43.5297, 5.4474], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    setTimeout(() => this.map?.invalidateSize(), 100);

    this.hoverMarker = L.marker([0, 0]).addTo(this.map);
    this.hoverMarker.setOpacity(0);
  }

  private loadGPX(url: string) {
    if (!this.map) return;

    const gpx = new (L as any).GPX('assets/' + url, {
      async: true,
      polyline_options: { color: 'red', weight: 4 }
    });

    gpx.on('loaded', (e: any) => {
      const bounds = e.target.getBounds();
      if (bounds.isValid()) this.map?.fitBounds(bounds, { padding: [20, 20] });

      // 🔹 Parse GPX pour profil
      this.http.get('assets/' + url, { responseType: 'text' })
        .subscribe(xmlText => this.parseGPX(xmlText));
    });

    gpx.addTo(this.map);
    this.gpxLayer = gpx;
  }

  private parseGPX(xmlText: string) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, "application/xml");
    const trkpts = Array.from(xml.querySelectorAll("trkpt"));

    if (!trkpts.length) {
      console.warn('Aucun point trouvé dans le GPX');
      return;
    }

    const elevations: number[] = [];
    const labels: number[] = [];
    const latlngs: L.LatLng[] = [];

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
        distance += prevLatLng.distanceTo(latlng) / 1000;
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

    // 🔹 mise à jour des signals pour stats
    this.totalDistance.set(distance);
    this.totalGain.set(gain);
    this.totalLoss.set(loss);

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
          label: 'Altitude (m)',
          data,
          fill: true,
          tension: 0.2,
          borderColor: '#FF5733',
          backgroundColor: 'rgba(255,87,51,0.3)',
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          tooltip: {
            enabled: true,
            callbacks: {
              label: (ctx) => `Altitude: ${ctx.raw} m`
            }
          }
        },
        scales: {
          x: { title: { display: true, text: 'Distance (km)' } },
          y: { title: { display: true, text: 'Altitude (m)' } }
        },
        onHover: (evt, activeEls) => {
          if (!activeEls.length) {
            this.hoverMarker?.setOpacity(0);
            return;
          }
          const idx = activeEls[0].index;
          const latlng = latlngs[idx];
          this.hoverMarker?.setLatLng(latlng).setOpacity(1);
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.gpxLayer) this.map?.removeLayer(this.gpxLayer);
    if (this.chart) this.chart.destroy();
    if (this.hoverMarker) this.map?.removeLayer(this.hoverMarker);
    this.map?.remove();
  }
}
