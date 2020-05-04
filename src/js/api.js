const url = 'https://brasil.io/api/dataset/covid19/caso/data?state=SP&city=Tabo%C3%A3o+da+Serra';

const dia 		= document.querySelector('#ts__data');
const mortes 	= document.querySelector('#ts__mortes');
const casos		= document.querySelector('#ts__casos');
const cidade	= document.querySelector('#ts__cidade');

const corpo = document.getElementById('corpo');

let hora 		=  22 // new Date().getHours();
let corFont = '';

if (hora >= 05 && hora <= 17) {
	corFont = '#00000080';
	corpo.classList.remove('noite');
} else {
	corFont = '#ffffff80';
	corpo.classList.add('noite');
}

fetch(url)
.then(resp => resp.json())
.then(function(d) {
	let dados = d.results;

	// Resolve o problema com GMT negativo passando as horas
	let h = dados[0].date + 'T00:00';

	const hData 	= new Date(h);
	const hAno		= hData.getFullYear();
	const hDia		= hData.getDate();
	const meses		= ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
	const hMes		= hData.getMonth();
	const mesNome	= meses[hMes];

	let hoje 			= `${hDia} ${mesNome} ${hAno}`;
	let tsCidade	= dados[0].city;
	let tsMortes 	= dados[0].deaths;
	let tsCasos		= dados[0].confirmed;
	
	dia.innerHTML 		= hoje;
	mortes.innerHTML	= tsMortes;
	casos.innerHTML 	= tsCasos;
	cidade.innerHTML 	= tsCidade;

	let dDia 			= [];
	let nMortes 	= [];
	let nCasos		= [];

	for(i = 0; i < dados.length; i++ ) {
		dDia.push(dados[i].date);
		nMortes.push(dados[i].deaths);
		nCasos.push(dados[i].confirmed);

	}

	var options = {
		chart: {
			type: 'area',
			defaultLocale: 'pt',
				locales: [{
					name: 'pt',
					options: {
						months: [
							'Janeiro', 
							'Fevereiro', 
							'Março', 
							'Abril', 
							'Maio', 
							'Junho', 
							'Julho', 
							'Agosto', 
							'Setembro', 
							'Outubro', 
							'November', 
							'December'
						],
						shortMonths: [
							'Jan', 
							'Fev', 
							'Mar', 
							'Abr', 
							'Mai', 
							'Jun', 
							'Jul', 
							'Ago', 
							'Set', 
							'Out', 
							'Nov', 
							'Dez'],
						days: [
							'Domingo', 
							'Segunda', 
							'Terça', 
							'Quarta', 
							'Quinta', 
							'Sexta', 
							'Sábado'
						],
						shortDays: [
							'Dom', 
							'Seg', 
							'Ter', 
							'Qua', 
							'Qui', 
							'Sex', 
							'Sáb'
					],
						toolbar: {
							download: 'Download SVG',
							selection: 'Seleção',
							selectionZoom: 'Selection Zoom',
							zoomIn: 'Zoom In',
							zoomOut: 'Zoom Out',
							pan: 'Panning',
							reset: 'Resetar Zoom',
						}
    }
  }],
			toolbar: {
				show: false,
				tools: {
					download: true,
					selection: true,
					zoom: true,
					zoomin: true,
					zoomout: true,
					pan: false,
					reset: true | '<img src="/static/icons/reset.png" width="20">',
				},
				autoSelected: '' 
				},
			},
			theme: {
				monochrome: {
					enabled: true,
					color: '#ff001f',
					shadeTo: 'dark',
					shadeIntensity: 1
				}
			},
		series: [{
			type: 'area',
			name: 'Mortes',
			data: nMortes.reverse()
		}, {
				type: 'area',
				name: 'Confirmados',
				data: nCasos.reverse(),
			}, ],
		xaxis: {
			type: 'datetime',
			categories: dDia.reverse(),
			
			labels: {
				datetimeFormatter: {
						year: 'yyyy',
						month: "MMM 'yy",
						day: 'dd MMM',
						hour: 'HH:mm',
				},
				style: {
					colors: corFont, // cor do texto do eixo X.
				},
				format: 'dd MMM yy',
				datetimeUTC: true,
			},
			
		},
		yaxis: {
			show: true,
			seriesName: 'numeros',
			min: 0,
			tickAmount: 20,
			labels: {
				style: {
					colors: corFont, // cor do texto do eixo Y.
				},
			},
		},
		dataLabels: {
			enabled: false,
			offsetY: -10,
			style: {
				colors: ['#f2f2f2', '#f3f3f3'],
				fontSize: '10px',
			},
			background: {
				enabled: true,
				foreColor: 'rgba(0,0,0,.5)',
				padding: 8,
				borderRadius: 4,
			},
		},

		stroke: {
			curve: 'smooth',
			width: 4,
		},
		markers: {
			size: 2,
		},
		grid: {
			show: true,
		},
		tooltip: {
      enabled: true,
      enabledOnSeries: undefined,
      shared: true,
      followCursor: true,
      intersect: false,
      inverseOrder: false,
      custom: undefined,
      fillSeriesColor: false,
			theme: 'dark',
			x: {
				show: false,
				format: 'dd.MM.yyyy',
				formatter: undefined,
		},
  },
		legend: {
			show: true,
			position: 'bottom',
			inverseOrder: true,
			horizontalAlign: 'center',
			itemMargin: {
				horizontal: 20,
				vertical: 20,
			},
			labels: {
				colors: corFont,
				useSeriesColors: false
		},
			onItemClick: {
				toggleDataSeries: true
			},
			onItemHover: {
				highlightDataSeries: true,
			},
		
		},
		
		
	}

	var chart = new ApexCharts(document.querySelector("#chart"), options);
	chart.render();


})
