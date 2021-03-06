// Casos do Estado de São Paulo
const urlSP = 'https://brasil.io/api/dataset/covid19/caso/data?place_type=state&state=SP';
// Dados da cidade de Taboão da Serra
const url = 'https://brasil.io/api/dataset/covid19/caso/data?state=SP&city=Tabo%C3%A3o+da+Serra';

const corpo 		= document.getElementById('corpo');
const dia 			= document.querySelectorAll('.data');

const nomeMeses	=	['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const abrMeses	= ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const nomeDia		= ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const abrDia		= ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];


function documento(id) {
	return document.querySelector(id);
}

function formataNumero(valor) { 
	let n = new Intl.NumberFormat('pt-BR').format(valor); return n; 
}

function taxaCrescimento(hoje, ontem) {
	let calculo =  Math.floor( (hoje - ontem)/ontem*100 );
	if (calculo >= 0) {
		return `<span class="crescimento" style="color: red;">${'▲ ' + calculo + '%'}</span>`;
	} else {
		return `<span class="crescimento" style="color: green;">${'▼ ' + calculo + '%'}</span>`;
	}
}


// TS
const mortes 		= documento('#ts__mortes');
const casos			= documento('#ts__casos');
const cidade		= documento('#ts__cidade');

// SP
const mortesSP 	= documento('#sp__mortes');
const casosSP		= documento('#sp__casos');

// Modo noturo ou diurno
let hora 		=  new Date().getHours();
let corFont = '';

if (hora >= 05 && hora <= 17) {
	corFont = '#00000080';
	corpo.classList.remove('noite');
} else {
	corFont = '#ffffff80';
	corpo.classList.add('noite');
}

// Fetch Api SP
fetch(urlSP)
.then(rSP => rSP.json())
.then((sp) => {
	// dados do dia atual
	let spCasos 				= sp.results[0].confirmed;
	let spMortes 				= sp.results[0].deaths;
	// dados do dia anterior
	let spAntCasos 			= sp.results[1].confirmed;
	let spAntMortes 		= sp.results[1].deaths;
	
	casosSP.innerHTML 	= formataNumero(spCasos)
		+ taxaCrescimento(spCasos, spAntCasos);
	mortesSP.innerHTML 	= formataNumero(spMortes)
		+ taxaCrescimento(spMortes, spAntMortes);

});

// Fetch API para Taboão
fetch(url)
.then(resp => resp.json())
.then((d) => {
	let dados = d.results;

	// Resolve o problema com GMT negativo passando as horas
	let h = dados[0].date + 'T00:00';

	// Tratamento para a data de hoje
	const hData 	= new Date(h);
	const hAno		= hData.getFullYear();
	const hDia		= hData.getDate();

	const hMes		= hData.getMonth();
	const mesNome	= abrMeses[hMes];

	let hoje 			= `${hDia} ${mesNome} ${hAno}`;
	let tsCidade	= dados[0].city;
	// dados do dia atual
	let tsMortes 	= dados[0].deaths;
	let tsCasos		= dados[0].confirmed;
	// dados do dia anterior
	let tsAntMortes 	= dados[1].deaths;
	let tsAntCasos		= dados[1].confirmed;
	
	dia[1].innerHTML 		= hoje;	// Data para TS
	dia[0].innerHTML 		= hoje;	// Data para SP
	cidade.innerHTML 		= tsCidade;

	casos.innerHTML 		= formataNumero(tsCasos)
		+ taxaCrescimento(tsCasos, tsAntCasos);
	mortes.innerHTML		= formataNumero(tsMortes) 
		+ taxaCrescimento(tsMortes, tsAntMortes);
	
	
	let dDia 						= [];
	let nMortes 				= [];
	let nCasos					= [];

	dados.forEach( (dado) => {
		dDia.push(dado.date);
		nMortes.push(dado.deaths);
		nCasos.push(dado.confirmed);
	});


	var options = {
		chart: {
			type: 'area',
			defaultLocale: 'pt',
				locales: [{
					name: 'pt',
					options: {
						months: nomeMeses,
						shortMonths: abrMeses,
						days: nomeDia,
						shortDays: abrDia,
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
					pan: true,
					reset: true | '<img src="/static/icons/reset.png" width="20">',
				},
				autoSelected: 'zoom' 
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
			seriesName: 'Logarithmic',
			min: 1,
			max: 4000,
      tickAmount: 10,
      logarithmic: true,
			labels: {
				style: {
					colors: corFont, // cor do texto do eixo Y.
				},
			},
			title: {
				text: 'Escala Logarítmica',
				style: {
					color: corFont,
					fontWeight: 'normal'
				}
			},
			axisTicks: {
        show: true
      },
      axisBorder: {
        show: true,
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
		title: {
			text: 'Números de casos e mortes no munucipio de Taboão da Serra - SP',
			align: 'center',
			margin: 10,
			offsetX: 0,
			offsetY: 10,
			floating: false,
			style: {
				fontSize:  '16px',
				fontWeight:  'bold',
				color:  corFont
			},
		},
		subtitle: {
      text: 'Os números apresentados podem ser maiores devido a subnotificações. ',
      align: 'center',
      margin: 10,
      offsetX: 0,
      offsetY: 40,
      floating: false,
      style: {
        fontSize:  '12px',
        color:  corFont
      },
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
