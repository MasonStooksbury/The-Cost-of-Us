import { Component } from '@angular/core';
import cpu_data from '../assets/cpu-consumption.json';
import gpu_data from '../assets/gpu-consumption.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'the-cost-of-us';
  selected_cpu = 'CPU';
  selected_gpu = 'GPU';
  cpu_list = cpu_data;
  gpu_list = gpu_data;
}
