var dom = document.getElementById('chart-container');
var myChart = echarts.init(dom, null, {
  renderer: 'canvas',
  useDirtyRect: false
});
var app = {};
var ROOT_PATH = 'https://echarts.apache.org/examples';

var option;

myChart.showLoading();
$.get('world.json', function (usaJson) {
  myChart.hideLoading();
  echarts.registerMap('USA', usaJson);
  var data = [
                {name: 'China', value: [104.195397, 35.86166], population: 1444216107},
                {name: 'India', value: [78.96288, 20.593684], population: 1393409038},
                {name: 'United States', value: [-98.5795, 39.8283], population: 331002651},
                {name: 'Indonesia', value: [113.9213, -0.7893], population: 273523615},
                {name: 'Pakistan', value: [69.3451, 30.3753], population: 200},
                {name: 'Brazil', value: [-51.9253, -14.2350], population: 212559417},
                // Add more countries as necessary
            ];
var lines = [
                {from: 'China', to: 'India'},
                {from: 'India', to: 'United States'},
                {from: 'Brazil', to: 'United States'}
            ];
            
             // Map to store coordinates by country name for line connections
            var coordinatesMap = {};
            data.forEach(item => {
                coordinatesMap[item.name] = item.value;
            });

            // Create line series from the `lines` array
             var lineData = lines.map(line => {
                var fromCoords = coordinatesMap[line.from];
                var toCoords = coordinatesMap[line.to];

                // Only include lines if both the 'from' and 'to' countries have valid coordinates
                if (fromCoords && toCoords) {
                    return {
                        coords: [fromCoords, toCoords],
    from: line.from,
    to: line.to

                    };
                } else {
                    return null; // Return null if any coordinates are missing
                }
            }).filter(item => item !== null);
            // Calculate size based on population
            function getDotSize(population) {
                return Math.log(population) * 2; // Scale the size for better visual clarity
            }

            // Calculate color based on population
            function getColor(population) {
                if (population > 1000000000) return '#ff0000'; // High population (red)
                if (population > 500000000) return '#ff9900'; // Medium population (orange)
                return '#33cc33'; // Low population (green)
            }
            
  option = {
    title: {
                    text: 'World Map with Population Data',
                    subtext: 'Hover over the dots to see the population',
                    left: 'center'
                },
    tooltip: {
      trigger: 'item',
      showDelay: 0,
      transitionDuration: 0.2
    },
                
                
                geo: {
                    map: 'world',
                    roam: true,
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    itemStyle: {
                        areaColor: '#e0e0e0',
                        borderColor: '#111'
                    },
                },
                series: [{
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: data.map(function(item) {
                        return {
                            name: item.name,
                            value: item.value.concat(item.population),
                            symbolSize: getDotSize(item.population),
                            itemStyle: {
                                color: getColor(item.population)
                            }
                        };
                    }),
                    tooltip: {
                        trigger: 'item',
                        formatter: function(params) {
                            return params.name + '<br>Population: ' + params.value[2];
                        }
                    }
                },
                
                // Line connections between specific dots
                    {
                        type: 'lines',
                        coordinateSystem: 'geo',
                        data: lineData,
                        lineStyle: {
                            color: '#ff7f50',  // Set color of the lines
                            width: 5,
                            opacity: 0.7,
                            curveness: 0.3  // Curve the lines
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: function(params) {
                                var fromCountry = params.data.from;
                                var toCountry = params.data.to;
                                return fromCountry + '  → ' + toCountry;
                            }
                        }
                    }],
                
              
    
  };
  myChart.setOption(option);
});

if (option && typeof option === 'object') {
  myChart.setOption(option);
}

window.addEventListener('resize', myChart.resize);