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
    {
        rcode: 1,
        pcode: 1,
        resp_id: 1,
        next_latitude: 78,
        longitude: 20,
        country: 'Brazil',
        city: 'Sao Paulo',
        latitude: 104,
        longitude: 35,
        velocity: 1000,
        surveyresponsegeo_id: 1,
        next_surveyresponsegeo_id: 2
    },
    {
        rcode: 1,
        pcode: 1,
        resp_id: 1,
        next_latitude: 78,
        longitude: 20,
        country: 'Colombia',
        city: 'Bogota',
        latitude: 78,
        longitude: 20,
        velocity: 0,
        surveyresponsegeo_id: 2,
        next_surveyresponsegeo_id: 3
    },
    {
        rcode: 1,
        pcode: 1,
        resp_id: 1,
        next_latitude: 78,
        longitude: 20,
        country: 'Colombia',
        city: 'Bogota',
        latitude: 78,
        longitude: 20,
        velocity: 0,
        surveyresponsegeo_id: 3,
        next_surveyresponsegeo_id: 4
    },
    {
        rcode: 1,
        pcode: 1,
        resp_id: 1,
        next_latitude: -51,
        longitude: -14,
        country: 'Colombia',
        city: 'Bogota',
        latitude: 78,
        longitude: 20,
        velocity: null,
        surveyresponsegeo_id: 4,
        next_surveyresponsegeo_id: null
    },
    {
        rcode: 2,
        pcode: 2,
        resp_id: 2,
        next_latitude: -51,
        longitude: -14,
        country: 'China',
        city: 'Hong Kong',
        latitude: -51,
        longitude: -14,
        velocity: 0,
        surveyresponsegeo_id: 5,
        next_surveyresponsegeo_id: 6
    },
    {
        rcode: 2,
        pcode: 2,
        resp_id: 2,
        next_latitude: -51,
        longitude: -14,
        country: 'China',
        city: 'Hong Kong',
        latitude: -51,
        longitude: -14,
        velocity: 0,
        surveyresponsegeo_id: 6,
        next_surveyresponsegeo_id: 7
    },
    {
        rcode: 2,
        pcode: 2,
        resp_id: 2,
        next_latitude: 113,
        longitude: 0,
        country: 'China',
        city: 'Hong Kong',
        latitude: -51,
        longitude: -14,
        velocity: null,
        surveyresponsegeo_id: 7,
        next_surveyresponsegeo_id: null
    },
    {
        rcode: 3,
        pcode: 3,
        resp_id: 3,
        next_latitude: 200,
        longitude: 0,
        country: 'United States',
        city: 'Boston',
        latitude: 113,
        longitude: 0,
        velocity: null,
        surveyresponsegeo_id: 8,
        next_surveyresponsegeo_id: null
    },
    {
        rcode: 4,
        pcode: 4,
        resp_id: 4,
        next_latitude: -98,
        longitude: 39,
        country: 'United States',
        city: 'Washington',
        latitude: 200,
        longitude: 0,
        velocity: 100,
        surveyresponsegeo_id: 9,
        next_surveyresponsegeo_id: 10
    },
    {
        rcode: 4,
        pcode: 4,
        resp_id: 4,
        next_latitude: null,
        longitude: null,
        country: 'Italy',
        city: 'Venice',
        latitude: -98,
        longitude: 39,
        velocity: null,
        surveyresponsegeo_id: 10,
        next_surveyresponsegeo_id: null
    }
];
var lines = [
    {
        from: 1,
        to: 2
    },
    {
        from: 2,
        to: 3
    },
    {
        from: 3,
        to: 4
    },
    {
        from: 5,
        to: 6
    },
    {
        from: 6,
        to: 7
    },
    {
        from: 9,
        to: 10
    }
];
            
             // Map to store coordinates by country name for line connections
            var coordinatesMap = {};
            data.forEach(item => {
                coordinatesMap[item.name] = item.value;
            });

            // Create line series from the `lines` array
             var lineData = [
                {resp_id:1, 
                    from: "Brazil",
                    to: "Colombia",
                    coords: [[104,35],[78,20]],
                    isSuspicious: false
                },
                {resp_id:1, 
                    from: "Colombia",
                    to: "Colombia",
                    coords: [[78,20],[78,20]],
                    isSuspicious: false
                },
                {resp_id:1, 
                    from: "Colombia",
                    to: "Colombia",
                    coords: [[78,20],[78,20]],
                    isSuspicious: false
                },
                {resp_id:2, 
                    from: "China",
                    to: "China",
                    coords: [[-51,-14],[-51,-14]],
                    isSuspicious: false
                },
                {resp_id:2,
                    from: "China",
                    to: "China",
                    coords: [[-51,-14],[-51,-14]],
                    isSuspicious: false
                },
                {resp_id:4,
                    from: "United States",
                    to: "Italy",
                    coords: [[200,0],[-98,39]],
                    isSuspicious: true
                }
            ];
            // Calculate size based on population
            function getDotSize(population) {
                return population*10; // Scale the size for better visual clarity
            }
            // Calculate size based on population
            function getLineSize(isSuspicious) {
                if (isSuspicious) {
                    return 5
                }
                return 1 // Scale the size for better visual clarity
            }

            // Calculate color based on population
            function getGradientColor(population, minPop, maxPop) {
                var ratio = (population - minPop) / (maxPop - minPop);
                
                // Calculate RGB values for gradient from fuchsia to blue
                var red = Math.floor(255 - (ratio * 255)); // Red decreases as we move from fuchsia to blue
                var green = 0; // Green remains constant (no green in either color)
                var blue = Math.floor(ratio * 255); // Blue increases as we move from fuchsia to blue

                return `rgb(${red}, ${green}, ${blue})`; // Return RGB value (gradient between fuchsia and blue)
 
            }

            // Get the minimum and maximum population values for the gradient
            var minPop = Math.min(...data.map(d => d.resp_id));
            var maxPop = Math.max(...data.map(d => d.resp_id));
            
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
                            name: item.country,
                            value: [item.latitude, item.longitude, item.resp_id],
                            symbolSize: getDotSize(item.resp_id),
                            itemStyle: {
                                color: getGradientColor(item.resp_id, minPop, maxPop)
                            }
                            
                        };
                    }),
                    tooltip: {
                        trigger: 'item',
                        formatter: function(params) {
                            return params.name + '<br><b>Respondent</b>: ' + params.value[2];
                        }
                    }
                },
                
                // Line connections between specific dots
                    {
                        type: 'lines',
                        coordinateSystem: 'geo',
                        data: lineData,
                        lineStyle: {
                            color: function (params) {
                                return getGradientColor(params.data.resp_id, minPop, maxPop)
                                 // Use dynamic line color based on the source country's population
                            },  // Set color of the lines
                            width: getLineSize(false)
                            ,
                            opacity: 0.7,
                            curveness: 0.3  // Curve the lines
                        },
                        tooltip: {
                            trigger: 'item',
                            formatter: function(params) {
                                var fromCountry = params.data.from;
                                var toCountry = params.data.to;
                                return fromCountry + '  → ' + toCountry + ' ' + params.data.isSuspicious;
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