import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import cpu_data from '../assets/cpu-consumption.json';
import gpu_data from '../assets/gpu-consumption.json';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'the-cost-of-us';

  fg = new FormGroup({
    'cpu': new FormControl('', Validators.required),
    'gpu': new FormControl('', Validators.required),
    'kwh': new FormControl('', Validators.required)
  });

  cpu_list = cpu_data.map((d) => d['name']);
  gpu_list = gpu_data.map((d) => d['name']);

  filtered_cpu_list: string[] = Object.assign([], this.cpu_list);
  filtered_gpu_list: string[] = Object.assign([], this.gpu_list);

  cpuControl = new FormControl('');
  gpuControl = new FormControl('');

  // options: string[] = ['One', 'Two', 'Three'];
  // filteredOptions: Observable<string[]> | undefined;

  showFormAndNotChart = !true;

  options: EChartsOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
      }
    ]
  };

  ngOnInit() {
    this.fg.controls['cpu'].valueChanges.subscribe((ft) => {
      console.log('filter!');
      this.filtered_cpu_list = !!ft ? this.cpu_list.filter((c) => c.toLowerCase().includes(ft.toLowerCase())) : Object.assign([], this.cpu_list);
    });

    this.fg.controls['gpu'].valueChanges.subscribe((ft) => {
      this.filtered_gpu_list = !!ft ? this.gpu_list.filter((c) => c.toLowerCase().includes(ft.toLowerCase())) : Object.assign([], this.gpu_list);
    });
  }

  toggleChart() {
    this.showFormAndNotChart = !this.showFormAndNotChart;
  }
}
