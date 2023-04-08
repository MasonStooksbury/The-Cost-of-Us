import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EChartsOption } from 'echarts';
import cpu_data from '../assets/cpu-consumption.json';
import gpu_data from '../assets/gpu-consumption.json';
import beat_time_data from '../assets/how-long-to-beat-data.json';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
	title = 'the-cost-of-us';

	fg = new FormGroup({
		'cpu': new FormControl('', Validators.required),
		'gpu': new FormControl('', Validators.required),
		'kwh': new FormControl('', Validators.required)
	});

	cpu_list = cpu_data.map((d) => d['name']);
	gpu_list = gpu_data.map((d) => d['name']);
	beat_time_data = beat_time_data;

	filtered_cpu_list: string[] = Object.assign([], this.cpu_list);
	filtered_gpu_list: string[] = Object.assign([], this.gpu_list);

	selected_cpu_power_consumption = 0;
	selected_gpu_power_consumption = 0;
	kilowatt_per_hour_cost = 0;

	show_form_and_not_chart = true;

	x_axis_labels: string[] = [];

	options: EChartsOption = {
		title: {
			text: 'Additional Cost to Beat The Game'
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: {
				type: 'shadow'
			}
		},
		legend: {
			left: 'right'
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis: {
			type: 'value',
			boundaryGap: [0, 0.01]
		},
		yAxis: {
			type: 'category',
			data: this.x_axis_labels
		},
		series: []
	};

	ngOnInit() {
		this.fg.controls['cpu'].valueChanges.subscribe((ft) => {
			this.filtered_cpu_list = !!ft ? this.cpu_list.filter((c) => c.toLowerCase().includes(ft.toLowerCase())) : Object.assign([], this.cpu_list);
		});

		this.fg.controls['gpu'].valueChanges.subscribe((ft) => {
			this.filtered_gpu_list = !!ft ? this.gpu_list.filter((c) => c.toLowerCase().includes(ft.toLowerCase())) : Object.assign([], this.gpu_list);
		});

		beat_time_data.forEach(category => {
			this.x_axis_labels.push(category.play_style)
		});
	}

	changeStuff(event: Event) {
		this.show_form_and_not_chart = !this.show_form_and_not_chart;
		this.selected_cpu_power_consumption = this.getPowerConsumption('cpu', this.fg.controls['cpu'].value);
		this.selected_gpu_power_consumption = this.getPowerConsumption('gpu', this.fg.controls['gpu'].value);
		// This ternary is kinda gross, but the errors were pissing me off
		const temp = this.fg.controls['kwh'].value
		this.kilowatt_per_hour_cost = parseFloat(temp ? temp : '0');

		this.setupChartData();
	}

	setupChartData() {
		interface SeriesThing {
			name: string;
			type: string;
			data: number[];
			tooltip: object;
		}

		const new_series_data: SeriesThing[] = [
			{
				name: 'average',
				type: 'bar',
				data: [],
				tooltip: {
					valueFormatter: function (value: number) {
						return `$${value.toFixed(2)}`;
					}
				},
			},
			{
				name: 'median',
				type: 'bar',
				data: [],
				tooltip: {
					valueFormatter: function (value: number) {
						return `$${value.toFixed(2)}`;
					}
				},
			},
			{
				name: 'rushed',
				type: 'bar',
				data: [],
				tooltip: {
					valueFormatter: function (value: number) {
						return `$${value.toFixed(2)}`;
					}
				},
			},
			{
				name: 'leisure',
				type: 'bar',
				data: [],
				tooltip: {
					valueFormatter: function (value: number) {
						return `$${value.toFixed(2)}`;
					}
				},
			}
		]

		this.beat_time_data.forEach(category => {
			for (const [key, value] of Object.entries(category.times)) {
				for (let series of new_series_data) {
					if (series.name === key) {
						series.data.push(this.getMathResult(
							this.selected_cpu_power_consumption,
							this.selected_gpu_power_consumption,
							this.kilowatt_per_hour_cost,
							value
						))
					}
				}
			}
		})

		this.options.series = <EChartsOption["series"]>new_series_data;
	}

	// component_name should never be null, but I'm going to put it here anyway
	getPowerConsumption(component: string, component_name: string | null): number {
		if (component === 'cpu') {
			for (let cpu of cpu_data) {
				if (cpu.name === component_name) {
					return cpu.power
				}
			}
		} else {
			for (let gpu of gpu_data) {
				if (gpu.name === component_name) {
					return gpu.power
				}
			}
		}
		return 0
	}

	getMathResult(cpu_consumption: number, gpu_consumption: number, kilowatt_cost: number, hours_to_beat: number) {
		const total_kw_consumption = cpu_consumption + gpu_consumption
		const cents_to_beat_the_game = (total_kw_consumption/1000) * hours_to_beat * kilowatt_cost
		return cents_to_beat_the_game
	}
}
